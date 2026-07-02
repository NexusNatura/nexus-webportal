import { db } from '../db';
import { jobs } from '../db/schema';
import pc from 'picocolors';
import { eq } from 'drizzle-orm';

const MOCK_MODE = process.env.MOCK_DB !== 'false';

export class JobWorker {
    /**
     * Lägger till ett nytt jobb i kön. Returnerar direkt (asynkront).
     */
    public async enqueueJob(jobType: string, payload: any) {
        console.log(pc.blue(`[JobWorker] Skapar jobb: ${jobType}`));
        
        if (MOCK_MODE) {
            console.log(pc.yellow(`  [MOCK_MODE] Jobb tillagt i kön.`));
            return 1; // Mock ID
        }

        try {
            const result = await db.insert(jobs).values({
                jobType,
                payload: payload, // Spara som JSON
                status: 'PENDING',
                createdAt: new Date().toISOString()
            });
            console.log(pc.green(`✔ Jobb inlagt i databas-kön.`));
            return result[0].insertId;
        } catch (error) {
            console.error(pc.red('Kunde inte lägga till jobb i databasen.'), error);
            return null;
        }
    }

    /**
     * Processerar kön i bakgrunden.
     */
    public async processQueue() {
        console.log(pc.magenta(`\n[JobWorker] Letar efter PENDING jobb...`));

        if (MOCK_MODE) {
            console.log(pc.yellow(`  [MOCK_MODE] Simulerar hämtning av Strawberry AI-jobb...`));
            await this.executeDeepResearchMock({ task: 'Analysera solcellsmarknaden i Spanien' });
            return;
        }

        try {
            // Hämta det första PENDING jobbet
            // (I produktion skulle vi använda en transaktion med låsning, typ "SELECT FOR UPDATE")
            const pendingJobs = await db.select().from(jobs).where(eq(jobs.status, 'PENDING')).limit(1);

            if (pendingJobs.length === 0) {
                console.log(pc.gray(`Inga jobb i kön just nu.`));
                return;
            }

            const job = pendingJobs[0];
            console.log(pc.cyan(`Hittade jobb #${job.id}: ${job.jobType}`));

            // Markera som PROCESSING
            await db.update(jobs).set({ status: 'PROCESSING' }).where(eq(jobs.id, job.id));

            // Utför uppgiften
            if (job.jobType === 'DEEP_RESEARCH') {
                await this.executeDeepResearchMock(job.payload);
            }

            // Markera som COMPLETED
            await db.update(jobs)
                .set({ status: 'COMPLETED', completedAt: new Date().toISOString() })
                .where(eq(jobs.id, job.id));
                
            console.log(pc.green(`✔ Jobb #${job.id} slutfört!`));

        } catch (error) {
            console.error(pc.red('Kunde inte processera kön.'), error);
        }
    }

    /**
     * Simulerar Strawberry AI:s långsamma (10-20 sek) asynkrona "deep research"-loop.
     */
    private async executeDeepResearchMock(payload: any) {
        console.log(pc.bgMagenta.white(`\n  STRAWBERRY AI: DEEP RESEARCH INITIATED  `));
        console.log(pc.gray(`  Uppgift: ${JSON.stringify(payload)}`));
        
        // Simulerar STaR loop (Tänker, Värderar, Handlar, Anspassar)
        const steps = [
            "Tänker: Identifierar nyckelområden för solceller.",
            "Handling: Utför webbsökning på spansk energilagstiftning...",
            "Valör: Resultatet verkar konsekvent med EU:s taxonomi.",
            "Verifiering: Reflector-agent bekräftar källornas validitet.",
            "Sammanställning: Bygger slutrapport med citat."
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Väntar 2 sek per steg
            console.log(pc.blue(`  [Steg ${i + 1}/5] `) + pc.white(steps[i]));
        }

        console.log(pc.bgGreen.black(`  RESEARCH KLAR! Slutrapport genererad.  \n`));
    }
}
