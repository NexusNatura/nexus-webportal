import { JobWorker } from '../src/server/jobs/JobWorker';
import pc from 'picocolors';

async function main() {
    const worker = new JobWorker();
    
    // 1. Placera jobbet i kön (Asynkront)
    const jobId = await worker.enqueueJob('DEEP_RESEARCH', {
        task: "Analysera solcellsmarknaden i Spanien",
        agentId: "Strawberry-o1",
        priority: "HIGH"
    });

    if (jobId) {
        // 2. Starta processorn i bakgrunden utan att vänta (Fire-and-forget simulering)
        // I verkligheten skulle denna loop ligga på en egen node-process / server
        worker.processQueue().catch(err => console.error("Worker Error:", err));
        
        console.log(pc.yellow(`[SYSTEM] Jobb inlagt i kön och körs i bakgrunden. Terminalen är inte blockerad!`));
    }
}

main();
