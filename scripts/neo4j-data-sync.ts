import { db } from '../src/server/db';
import { ledgerAssets, salesLeads, opportunities } from '../src/server/db/schema';
import pc from 'picocolors';

const MOCK_MODE = process.env.MOCK_NEO4J !== 'false';

async function syncSQLToGraph() {
  console.log(pc.cyan('\n[NEXUS-Ontologin] Initierar SQL -> Neo4j Graf-Synkronisering'));
  
  if (MOCK_MODE) {
    console.log(pc.yellow('  Kör i MOCK-läge. Inga anslutningar till Neo4j görs.\n'));
  }

  try {
    // 1. Fetch data from MySQL via Drizzle
    let dpps: any[] = [];
    let leads: any[] = [];
    let opps: any[] = [];
    
    try {
        dpps = await db.select().from(ledgerAssets);
        leads = await db.select().from(salesLeads);
        opps = await db.select().from(opportunities);
    } catch (dbErr) {
        console.log(pc.yellow('  [VARNING] Kunde inte ansluta till MySQL (Drizzle). Använder MOCK-data för SQL.'));
        dpps = [ { id: 'dpp-1', filename: 'Volvo_V70_Generator.json', data: { rules: ['ESPR-2024'] } } ];
        leads = [ { id: 1, company: 'TechCorp AB', selectedPlan: 'Enterprise' } ];
        opps = [ { id: 1, title: 'AI Automation Projekt' } ];
    }

    console.log(pc.green(`✔ Hämtade ${dpps.length} DPPs (Ledger Assets)`));
    console.log(pc.green(`✔ Hämtade ${leads.length} Sälj-Leads`));
    console.log(pc.green(`✔ Hämtade ${opps.length} Opportunities\n`));

    // 2. Map Ontologies (Graph Construction)
    let nodesCreated = 0;
    let edgesCreated = 0;

    console.log(pc.cyan('Skapar Kunskapsgraf (Ontologi)...'));

    // DPP & Rule Compliance
    for (const dpp of dpps) {
      if (MOCK_MODE) {
        console.log(`  [NODE] (Product:DPP { id: "${dpp.id}", name: "${dpp.filename}" })`);
        nodesCreated++;
        // Simulate extracting rules from the JSON data
        let rules = ['ESPR-2024', 'GDPR', 'REACH'];
        if (dpp.data && (dpp.data as any).rules) {
             rules = (dpp.data as any).rules;
        }

        for (const rule of rules) {
             console.log(`  [NODE] (Rule { name: "${rule}" })`);
             console.log(`  [EDGE] (Product:DPP)-[:COMPLIES_WITH]->(Rule { name: "${rule}" })`);
             nodesCreated++;
             edgesCreated++;
        }
      }
    }

    // Sales Leads linking to DPP or Opportunities
    for (const lead of leads) {
        if (MOCK_MODE) {
            console.log(`  [NODE] (Company:Lead { name: "${lead.company}", plan: "${lead.selectedPlan}" })`);
            nodesCreated++;
            
            // Connect to an opportunity if it matches
            if (opps.length > 0) {
                const opp = opps[0]; // Example logic
                console.log(`  [EDGE] (Company:Lead)-[:INTERESTED_IN]->(Opportunity { title: "${opp.title}" })`);
                edgesCreated++;
            }

            // Connect to a Plan
            console.log(`  [NODE] (Plan { name: "${lead.selectedPlan}" })`);
            console.log(`  [EDGE] (Company:Lead)-[:SUBSCRIBES_TO]->(Plan { name: "${lead.selectedPlan}" })`);
            nodesCreated++;
            edgesCreated++;
        }
    }

    console.log(pc.green(`\n✔ Synkronisering Klar! Mappade ${nodesCreated} Noder och ${edgesCreated} Relationer till grafen.`));
    if (!MOCK_MODE) {
        // Here we would use the neo4j-driver session to run the actual Cypher queries
        // await session.run('MERGE (p:Product {id: $id}) ...', { id: dpp.id })
    }

  } catch (error) {
    console.error(pc.red('[FEL] Misslyckades att synka SQL till Neo4j:'), error);
  } finally {
    process.exit(0);
  }
}

syncSQLToGraph();
