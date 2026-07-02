import { VectorService } from '../src/server/ai/VectorService';
import pc from 'picocolors';

async function main() {
    const query = process.argv[2];
    if (!query) {
        console.error(pc.red('Du måste ange en sökfråga.'));
        process.exit(1);
    }

    const vectorService = new VectorService();
    const results = await vectorService.searchMemory(query);

    console.log(pc.magenta(`\n--- SÖKRESULTAT FRÅN LÅNGTIDSMINNET ---`));
    
    if (results.length === 0) {
        console.log(pc.yellow('  Hittade inga relevanta minnen.'));
    } else {
        results.forEach((res, index) => {
            console.log(pc.white(`\nTräff #${index + 1} (Relevans: ${(res.score * 100).toFixed(1)}%)`));
            console.log(pc.gray(`Agent: `) + pc.cyan(res.agentName || res.agent_name || 'Okänd'));
            console.log(pc.gray(`Minne: `) + pc.green(res.content));
        });
    }
    console.log('\n');
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
