import chokidar from 'chokidar';
import neo4j from 'neo4j-driver';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

// Configuration
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';
const MOCK_MODE = process.env.MOCK_NEO4J !== 'false'; // Default to mock mode to prevent crash if no local DB

let driver: neo4j.Driver | null = null;

if (!MOCK_MODE) {
  try {
    driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
    console.log(`[WA-Core] Ansluten till Neo4j på ${NEO4J_URI}`);
  } catch (error) {
    console.error('[WA-Core] Fel vid anslutning till Neo4j:', error);
  }
} else {
  console.log('[WA-Core] Startar i MOCK-läge (Ingen riktig databasanslutning görs).');
}

/**
 * Parsar en TypeScript/React-fil och returnerar en lista med modul-imports.
 */
function extractImports(filePath: string): string[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    const imports: string[] = [];

    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (ts.isStringLiteral(moduleSpecifier)) {
          imports.push(moduleSpecifier.text);
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return imports;
  } catch (err) {
    console.error(`Kunde inte parsa fil: ${filePath}`, err);
    return [];
  }
}

/**
 * Skickar beroendegrafen till Neo4j
 */
async function syncFileToGraph(filePath: string) {
  const fileName = path.basename(filePath);
  const imports = extractImports(filePath);
  
  if (MOCK_MODE) {
    console.log(`\n[Graf-Synk (MOCK)] Analyserade: ${fileName}`);
    console.log(`  Beroenden hittade: ${imports.length}`);
    imports.forEach(imp => console.log(`  - [:DEPENDS_ON] -> ${imp}`));
    return;
  }

  if (!driver) return;

  const session = driver.session();
  try {
    // 1. Skapa eller uppdatera huvudfilen
    await session.run(
      `MERGE (f:File {path: $path})
       SET f.name = $name, f.lastUpdated = timestamp()`,
      { path: filePath, name: fileName }
    );

    // 2. Rensa gamla relationer för den här filen
    await session.run(
      `MATCH (f:File {path: $path})-[r:DEPENDS_ON]->()
       DELETE r`,
      { path: filePath }
    );

    // 3. Skapa nya noder och relationer för varje import
    for (const imp of imports) {
      const isInternal = imp.startsWith('.') || imp.startsWith('@/');
      const label = isInternal ? 'File' : 'Module';
      
      await session.run(
        `MATCH (source:File {path: $path})
         MERGE (target:${label} {name: $importName})
         MERGE (source)-[:DEPENDS_ON]->(target)`,
        { path: filePath, importName: imp }
      );
    }

    console.log(`[WA-Core Neo4j] Synkroniserade ${fileName} (${imports.length} beroenden)`);
  } catch (error) {
    console.error(`Fel vid synk av ${filePath}:`, error);
  } finally {
    await session.close();
  }
}

// Starta Chokidar-övervakning
console.log('  WA-Core: Initierar dynamisk graf-synkning...');
const watcher = chokidar.watch('./src/**/*.{ts,tsx}', {
  ignored: /(^|[\/\\])\../, // ignorerar dolda filer
  persistent: true
});

watcher
  .on('add', path => syncFileToGraph(path))
  .on('change', path => syncFileToGraph(path))
  .on('error', error => console.error(`Watcher error: ${error}`));

// Hantera avstängning
process.on('SIGINT', async () => {
  if (driver) {
    await driver.close();
  }
  process.exit(0);
});
