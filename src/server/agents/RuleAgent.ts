import { db } from '../db';
import { rules, requirements } from '../db/schema';
import * as path from 'path';
import pc from 'picocolors';
import { VectorService } from '../ai/VectorService';
import url from 'url';

const MOCK_MODE = process.env.MOCK_DB !== 'false';

/**
 * Regel-Tolkningsagenten (RuleAgent)
 * En del av "Berry-svärmen". Ansvarar för att läsa in PDF/lagtexter 
 * och omvandla ostrukturerad text till strikta, logiska regler i SQL.
 */
export class RuleAgent {
  name = 'RuleAgent (NLP)';

  /**
   * Simulerar NLP-extraktion av en text. I en produktionsmiljö
   * skulle denna metod anropa OpenAI, Gemini eller lokala LLM:er.
   */
  public async analyzeDocument(filePath: string) {
    const fileName = path.basename(filePath);
    console.log(pc.cyan(`\n[${this.name}] Analyserar dokument: ${fileName}`));
    console.log(pc.gray('  Initierar NLP-modell (Mock)...'));

    // Simulera lite tanketid
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock-resultat baserat på innehållet i "PPPASSPORTS.pdf"
    const extractedData = {
      rule: {
        name: 'Förordning (EU) 2024/1781 (ESPR)',
        documentSource: fileName
      },
      requirements: [
        {
          description: 'DPP-posten ska stödja användning av produktidentifierare (GS1 Digital Link)',
          targetEntity: 'DPP'
        },
        {
          description: 'Informationen i DPP ska kunna särskiljas utifrån syfte och åtkomstvillkor',
          targetEntity: 'DPP'
        },
        {
          description: 'Hållbarhet, ursprung, äkthet och spårbarhet ska stödjas av styrkande uppgifter',
          targetEntity: 'DPP'
        }
      ]
    };

    console.log(pc.green(`✔ Extraherade 1 Huvudregel och ${extractedData.requirements.length} relaterade krav.`));

    // Spara till SQL
    if (MOCK_MODE) {
        console.log(pc.yellow(`  [VARNING] Kör i MOCK_MODE, sparar ej till MySQL:`));
        console.log(pc.gray(`  INSERT INTO rules: ${extractedData.rule.name}`));
        for (const req of extractedData.requirements) {
            console.log(pc.gray(`  INSERT INTO requirements: [${req.targetEntity}] ${req.description}`));
        }
    } else {
        try {
            console.log(pc.cyan(`  Sparar till MySQL-databasen...`));
            
            // Insert Rule
            await db.insert(rules).values({
                name: extractedData.rule.name,
                documentSource: extractedData.rule.documentSource,
                createdAt: new Date().toISOString()
            });

            // Läs tillbaka ID:t för the nyskapade regeln
            const savedRule = await db.query.rules.findFirst({
                orderBy: (rules, { desc }) => [desc(rules.id)]
            });

            if (savedRule) {
                // Insert Requirements
                for (const req of extractedData.requirements) {
                    await db.insert(requirements).values({
                        ruleId: savedRule.id,
                        description: req.description,
                        targetEntity: req.targetEntity
                    });
                }
            }
            
            // Spara till Långtidsminnet (Vektordatabasen)
            console.log(pc.magenta(`\n  [Memory] Sparar insikter till Långtidsminnet...`));
            const vectorService = new VectorService();
            await vectorService.saveToMemory(this.name, `Regel inläst: ${extractedData.rule.name} från ${extractedData.rule.documentSource}`);
            for (const req of extractedData.requirements) {
                await vectorService.saveToMemory(this.name, `[${req.targetEntity}] Krav: ${req.description}`);
            }

            console.log(pc.green(`✔ Sparat till databasen och Vektor-minnet! Redo för Neo4j Graph-Synk.`));
        } catch (error) {
            console.error(pc.red('Kunde inte spara till databasen. MOCK_MODE rekommenderas.'), error);
        }
    }
  }
}

import url from 'url';

// Kör scriptet om det anropas direkt (CLI)
const isMain = import.meta.url 
  ? process.argv[1] === url.fileURLToPath(import.meta.url) 
  : require.main === module;

if (isMain) {
  const agent = new RuleAgent();
  // Använd den identifierade filen på skrivbordet
  const targetPdf = "C:\\Users\\infin\\Desktop\\Inkommande Digitalt Material\\PPPASSPORTS.pdf";
  agent.analyzeDocument(targetPdf).catch(console.error);
}
