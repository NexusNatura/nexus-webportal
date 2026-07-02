import { intro, outro, confirm, select, spinner, text, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function runCommand(command: string, description: string) {
    const s = spinner();
    s.start(`Executing: ${description}`);
    try {
        execSync(command, { stdio: 'inherit' });
        s.stop(pc.green(`✔ Success: ${description}`));
    } catch (error: any) {
        s.stop(pc.red(`✖ Failed: ${description}`));
        console.error(pc.red(error.message));
    }
}

async function main() {
    console.clear();
    intro(pc.bgCyan(pc.black(' NEXUS-OS Terminal Agent (Human-in-the-Loop) ')));
    
    console.log(pc.gray('Välkommen arkitekt. Jag är din interaktiva installationsagent.'));
    console.log(pc.gray('Enligt WA-Core Zero-Trust protokoll kommer jag att begära ditt'));
    console.log(pc.gray('explicita godkännande (HITL) innan några kritiska kommandon körs.\n'));

    while (true) {
        const action = await select({
            message: 'Vilken operation vill du utföra?',
            options: [
                { value: 'install', label: '1. Installera Beroenden (npm install)' },
                { value: 'env', label: '2. Konfigurera Databas (.env.local)' },
                { value: 'db', label: '3. Bygg & Synka Databas (drizzle-kit)' },
                { value: 'graph', label: '4. Mappa SQL-data till Kunskapsgraf (Neo4j Ontologi)' },
                { value: 'dev', label: '5. Starta NEXUS-OS Utvecklingsserver (Vite/Express)' },
                { value: 'deploy', label: '6. Driftsätt till Produktion (Vercel)' },
                { value: 'component', label: '7. Skapa ny React-komponent (NEXUS Boilerplate)' },
                { value: 'ruleagent', label: '8. Kör Regel-Tolkningsagent (Läs PDF och extrahera krav)' },
                { value: 'memory', label: '9. Sök i Agentens Långtidsminne (Vector Search)' },
                { value: 'async_job', label: '10. Testa Asynkron Jobb-Kö (Simulera Strawberry AI)' },
                { value: 'exit', label: '0. Avsluta Agenten' }
            ],
        });

        if (isCancel(action) || action === 'exit') {
            outro(pc.cyan('NEXUS-OS Agent avslutad. Ha en bra dag!'));
            process.exit(0);
        }

        if (action === 'install') {
            const cmd = 'npm install';
            const go = await confirm({
                message: `[HITL] Vill du exekvera kommandot: ${pc.yellow(cmd)}?`
            });
            if (isCancel(go) || !go) continue;
            runCommand(cmd, 'NPM Install');
        }

        if (action === 'env') {
            const dbUrl = await text({
                message: 'Klistra in din MySQL/PlanetScale Connection URL:',
                placeholder: 'mysql://root:password@localhost:3306/nexus'
            });
            if (isCancel(dbUrl)) continue;

            const go = await confirm({
                message: `[HITL] Vill du spara detta säkert i ${pc.yellow('.env.local')}?`
            });
            if (isCancel(go) || !go) continue;
            
            const envPath = path.resolve(process.cwd(), '.env.local');
            fs.writeFileSync(envPath, `DATABASE_URL="${dbUrl}"\nRUN_LOCAL="true"\n`, 'utf8');
            console.log(pc.green('✔ Miljövariabler sparade!'));
        }

        if (action === 'db') {
            const cmd = 'npx drizzle-kit push';
            const go = await confirm({
                message: `[HITL] Varning: Detta ändrar databasschemat! Vill du exekvera: ${pc.yellow(cmd)}?`
            });
            if (isCancel(go) || !go) continue;
            runCommand(cmd, 'Drizzle Database Push');
        }

        if (action === 'graph') {
            const cmd = 'npx tsx scripts/neo4j-data-sync.ts';
            const go = await confirm({
                message: `[HITL] Vill du extrahera SQL-data och mappa det till Neo4j-grafen? ${pc.yellow(cmd)}`
            });
            if (isCancel(go) || !go) continue;
            runCommand(cmd, 'NEXUS-Ontologin Neo4j Sync');
        }

        if (action === 'dev') {
            const cmd = 'npm run dev';
            const go = await confirm({
                message: `[HITL] Vill du starta servern? ${pc.yellow(cmd)}`
            });
            if (isCancel(go) || !go) continue;
            runCommand(cmd, 'Vite & Express Dev Server');
        }

        if (action === 'deploy') {
            const cmd = 'npx vercel';
            const go = await confirm({
                message: `[HITL] Varning: Detta pushar koden till live-produktion. Exekvera: ${pc.yellow(cmd)}?`
            });
            if (isCancel(go) || !go) continue;
            runCommand(cmd, 'Vercel Deployment');
        }

        if (action === 'component') {
            // ... (keeping component logic identical)
            const compName = await text({
                message: 'Vad ska komponenten heta? (ex. "DataCard")',
                placeholder: 'MyComponent'
            });
            if (isCancel(compName) || !compName) continue;

            const compDesc = await text({
                message: 'Kort beskrivning av komponenten (för JSDoc):',
                placeholder: 'Renderar en snygg kort-vy'
            });
            if (isCancel(compDesc)) continue;

            const go = await confirm({
                message: `[HITL] Vill du att jag bygger och sparar filen ${pc.cyan(compName + '.tsx')}?`
            });
            if (isCancel(go) || !go) continue;

            const s = spinner();
            s.start(`Bygger komponent: ${compName}`);
            
            const compDir = path.resolve(process.cwd(), 'src/components');
            if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });
            
            const template = `import React from 'react';
import { cn } from '../lib/utils'; // NEXUS standard

/**
 * ${compDesc || compName}
 */
export const ${compName} = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
    return (
        <div className={cn("p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-xl", className)}>
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-nexus-gold">${compName}</h3>
                {children}
            </div>
        </div>
    );
};
`;
            fs.writeFileSync(path.join(compDir, `${compName}.tsx`), template, 'utf8');
            s.stop(pc.green(`✔ Komponent skapad: src/components/${compName}.tsx`));
        }

        if (action === 'ruleagent') {
            const cmd = 'npx tsx src/server/agents/RuleAgent.ts';
            const go = await confirm({
                message: `[HITL] Vill du köra NLP-Agenten och läsa in ESPR-krav till SQL? ${pc.yellow(cmd)}`
            });
            if (isCancel(go) || !go) continue;
            runCommand(cmd, 'Berry-Svärmen: Regel-Tolk');
        }

        if (action === 'memory') {
            const query = await text({
                message: 'Vad vill du fråga agentens minne om?',
                placeholder: 'T.ex. "Finns det några krav på Digital Link?"'
            });
            if (isCancel(query) || !query) continue;

            const cmd = `npx tsx scripts/search-memory.ts "${query}"`;
            runCommand(cmd, 'Långtidsminne (Vector Search)');
        }

        if (action === 'async_job') {
            console.log(pc.yellow('\n[HITL] Initierar Asynkront Strawberry AI Jobb...'));
            // Startar en worker i en separat process som inte blockerar terminalen
            const cmd = `npx tsx scripts/run-async-job.ts`;
            runCommand(cmd, 'JobWorker (Background Queue)');
        }

        console.log('\n'); // Space before returning to menu
    }
}

main().catch(console.error);
