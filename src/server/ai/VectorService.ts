import { db } from '../db';
import { agentMemory } from '../db/schema';
import pc from 'picocolors';

const MOCK_MODE = process.env.MOCK_DB !== 'false';

/**
 * Vektor-Motor för Agenters Långtidsminne.
 * Lagrar och söker fram text baserat på "semantisk likhet".
 */
export class VectorService {
  /**
   * Skapar en simulerad vektor-inbäddning (embedding) för en text.
   * I produktion skulle detta anropa t.ex. OpenAI's text-embedding-3-small.
   */
  private generateMockEmbedding(text: string): number[] {
    const vector = [];
    for (let i = 0; i < 10; i++) {
        // Skapa pseudo-slumpmässiga siffror baserat på textens längd
        vector.push((Math.sin(text.length * (i + 1)) + 1) / 2);
    }
    return vector;
  }

  /**
   * Cosine Similarity - matematisk formel för att jämföra hur lika två vektorer är.
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Spara en insikt/regel i agentens Långtidsminne.
   */
  public async saveToMemory(agentName: string, content: string) {
    console.log(pc.blue(`[VectorService] Skapar vektor för: "${content.substring(0, 30)}..."`));
    const embedding = this.generateMockEmbedding(content);

    if (MOCK_MODE) {
        console.log(pc.yellow(`  [MOCK_MODE] Simulerar sparning av minne till MySQL:`));
        console.log(pc.gray(`  Agent: ${agentName} | Vektor-storlek: ${embedding.length}`));
    } else {
        try {
            await db.insert(agentMemory).values({
                agentName,
                content,
                embedding, // JSON array
                status: 'PENDING',
                createdAt: new Date().toISOString()
            });
            console.log(pc.green(`✓ Minne sparat till MySQL (Långtidsminne) som PENDING.`));
        } catch (err) {
            console.error(pc.red('Kunde inte spara minne till databasen.'), err);
        }
    }
  }

  /**
   * Sök i minnet (Vector Search).
   */
  public async searchMemory(query: string, topK: number = 3) {
    console.log(pc.blue(`\n[VectorService] Söker i minnet efter: "${query}"`));
    const queryEmbedding = this.generateMockEmbedding(query);

    let memories: any[] = [];

    if (MOCK_MODE) {
        console.log(pc.yellow(`  [MOCK_MODE] Genererar mock-minnen...`));
        memories = [
            { id: 1, agentName: 'RuleAgent', content: 'Kravet säger att GS1 Digital Link är obligatoriskt.', embedding: this.generateMockEmbedding('Kravet säger att GS1 Digital Link är obligatoriskt.') },
            { id: 2, agentName: 'RuleAgent', content: 'Informationen i DPP ska kunna särskiljas.', embedding: this.generateMockEmbedding('Informationen i DPP ska kunna särskiljas.') },
            { id: 3, agentName: 'SalesAgent', content: 'Kund TechCorp vill ha Enterprise-licens.', embedding: this.generateMockEmbedding('Kund TechCorp vill ha Enterprise-licens.') }
        ];
    } else {
        try {
            const { eq } = await import('drizzle-orm');
            memories = await db.select().from(agentMemory).where(eq(agentMemory.status, 'APPROVED'));
        } catch (err) {
            console.error(pc.red('Kunde inte läsa minnet från databasen. MOCK_MODE rekommenderas.'));
            return [];
        }
    }

    // Utför Vektor-matematiken för att hitta de närmaste träffarna
    const scoredMemories = memories.map(mem => ({
        ...mem,
        score: this.cosineSimilarity(queryEmbedding, mem.embedding as number[])
    }));

    // Sortera efter högst poäng och returnera Top-K
    const results = scoredMemories
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    return results;
  }
}
