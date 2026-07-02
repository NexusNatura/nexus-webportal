/**
 * NEXUS-OS â€“ Grants Router
 * AI-driven bidragsmatchning och ansÃ¶kningsgenerering via Grant-Gamma
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

const GRANT_GAMMA_PROMPT = `Du Ã¤r Grant-Gamma, en bidragsmatchnings-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar pÃ¥ svenska och Ã¤r strategisk och detaljorienterad. Du matchar fÃ¶retag mot:
- EU Horisont Europa, Life+, ERUF, Erasmus+
- Vinnova (CirkulÃ¤r ekonomi, Innovativa startups, SpÃ¥rbara cirkulÃ¤ra produktflÃ¶den)
- Almi (InnovationslÃ¥n, Verifieringsmedel)
- Klimatklivet, Energimyndigheten Industriklivet
- NaturvÃ¥rdsverket (KlimatinvesteringsstÃ¶d)
- TillvÃ¤xtverket (Regionala fonder)

Du rapporterar alltid matchningsgrad (%), belopp (SEK/EUR), deadline och ansÃ¶kningskrav.
Peter Johansson Ã¤r din HITL-operatÃ¶r. HÃ¥ll svar korta och handlingsinriktade.
AnvÃ¤nd â˜… fÃ¶r hÃ¶g matchning (>80%), â—‹ fÃ¶r medel (50-80%), Â· fÃ¶r lÃ¥g (<50%).`;

const DPP_DELTA_PROMPT = `Du Ã¤r DPP-Delta, en Digital Produktpass-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar pÃ¥ svenska och Ã¤r noggrann och EU-regelkunnig. Du arbetar med:
- ESPR-fÃ¶rordningen (EU) 2024/1781
- ISO 14040/14044 (LCA-analys)
- EU-taxonomin fÃ¶r hÃ¥llbar verksamhet
- Scope 1, 2 och 3 utslÃ¤ppsberÃ¤kningar
- JSON-LD format fÃ¶r DPP-data
Du flaggar alltid nÃ¤r du Ã¤r osÃ¤ker och krÃ¤ver Peters expertbedÃ¶mning fÃ¶r klassificeringar.
Peter Johansson Ã¤r din HITL-operatÃ¶r. HÃ¥ll svar korta och tekniskt precisa.
AnvÃ¤nd âœ“ fÃ¶r verifierat, ? fÃ¶r osÃ¤kert, âš ï¸ fÃ¶r krÃ¤ver beslut.`;

export const grantsRouter = router({
  /**
   * AI-generera ett ansÃ¶kningsutkast fÃ¶r ett specifikt bidragsprogram
   */
  generateApplication: publicProcedure
    .input(
      z.object({
        grantName: z.string(),
        grantProvider: z.string(),
        companyDescription: z.string().optional(),
        projectIdea: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userPrompt = `Generera ett professionellt ansÃ¶kningsutkast fÃ¶r fÃ¶ljande bidragsprogram:

**Program:** ${input.grantName}
**LeverantÃ¶r:** ${input.grantProvider}
${input.companyDescription ? `**FÃ¶retagsbeskrivning:** ${input.companyDescription}` : "**FÃ¶retag:** Nexus-OS AB â€“ AI-plattform fÃ¶r EU-hÃ¥llbarhetsefterlevnad (DPP, bidragsmatchning, greenwashing-detektion)"}
${input.projectIdea ? `**ProjektidÃ©:** ${input.projectIdea}` : "**ProjektidÃ©:** Implementering av EU ESPR-kompatibla Digitala Produktpass med AI-driven LCA-analys fÃ¶r svenska tillverkare"}

Strukturera ansÃ¶kan med:
1. **Projektsammanfattning** (3-4 meningar)
2. **Problemformulering** (varfÃ¶r detta projekt behÃ¶vs)
3. **LÃ¶sning och innovation** (vad som Ã¤r nytt och unikt)
4. **FÃ¶rvÃ¤ntade resultat** (konkreta, mÃ¤tbara mÃ¥l)
5. **Budget och resurser** (uppskattad kostnad och finansieringsplan)
6. **Tidplan** (milstolpar)
7. **Eligibilitetsmotivering** (varfÃ¶r vi uppfyller kraven)

HÃ¥ll varje sektion under 100 ord. Skriv pÃ¥ svenska. Var konkret och faktabaserad.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system" as const, content: GRANT_GAMMA_PROMPT },
            { role: "user" as const, content: userPrompt },
          ],
        });
        const text =
          (response as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ??
          "AnsÃ¶kningsgenerering misslyckades.";
        return { application: text, grantName: input.grantName };
      } catch (error) {
        console.error("[Grants] LLM error:", error);
        return {
          application: "âš ï¸ AI-tjÃ¤nsten Ã¤r tillfÃ¤lligt otillgÃ¤nglig. FÃ¶rsÃ¶k igen om ett Ã¶gonblick.",
          grantName: input.grantName,
        };
      }
    }),

  /**
   * AI-matchning: analysera ett fÃ¶retag mot alla tillgÃ¤ngliga bidragsprogram
   */
  matchCompany: publicProcedure
    .input(
      z.object({
        companyDescription: z.string().min(10).max(1000),
        industry: z.string().optional(),
        size: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userPrompt = `Analysera fÃ¶ljande fÃ¶retag och identifiera de 5 mest relevanta bidragsprogrammen:

**FÃ¶retagsbeskrivning:** ${input.companyDescription}
${input.industry ? `**Bransch:** ${input.industry}` : ""}
${input.size ? `**Storlek:** ${input.size}` : ""}

FÃ¶r varje program, ange:
- Programnamn och leverantÃ¶r
- Matchningsgrad (â˜…/â—‹/Â·) och procent
- Maximalt belopp (SEK/EUR)
- NÃ¤sta deadline
- 2-3 meningar om varfÃ¶r detta program passar
- Viktigaste eligibilitetskravet att verifiera

Sortera efter matchningsgrad. Svara pÃ¥ svenska.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system" as const, content: GRANT_GAMMA_PROMPT },
            { role: "user" as const, content: userPrompt },
          ],
        });
        const text =
          (response as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ??
          "Matchningsanalys misslyckades.";
        return { analysis: text };
      } catch (error) {
        console.error("[Grants Match] LLM error:", error);
        return { analysis: "âš ï¸ AI-tjÃ¤nsten Ã¤r tillfÃ¤lligt otillgÃ¤nglig." };
      }
    }),

  /**
   * AI-generera ett DPP (Digitalt Produktpass) med LCA-analys
   */
  generateDPP: publicProcedure
    .input(
      z.object({
        productName: z.string(),
        brand: z.string(),
        category: z.string().optional(),
        materials: z.string().optional(),
        co2: z.string().optional(),
        recycledContent: z.string().optional(),
        additionalInfo: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userPrompt = `Generera ett EU ESPR-kompatibelt Digitalt Produktpass (DPP) fÃ¶r:

**Produkt:** ${input.productName}
**VarumÃ¤rke:** ${input.brand}
**Kategori:** ${input.category || "Ej angiven"}
**Material:** ${input.materials || "Ej angiven"}
**COâ‚‚-fotavtryck:** ${input.co2 ? `${input.co2} kg COâ‚‚e` : "Ej angiven"}
**Ã…tervunnet innehÃ¥ll:** ${input.recycledContent ? `${input.recycledContent}%` : "Ej angiven"}
${input.additionalInfo ? `**Ytterligare info:** ${input.additionalInfo}` : ""}

Generera:
1. **DPP-sammanfattning** (ESPR-status, nyckeldata)
2. **LCA-analys** (Scope 1, 2, 3 uppskattning baserat pÃ¥ materialen)
3. **Reparerbarhetsindex** (EU-skala 1-10 med motivering)
4. **End-of-Life rekommendation** (Ã¥tervinning, demontering)
5. **Saknade datapunkter** (vad som behÃ¶ver kompletteras fÃ¶r full ESPR-efterlevnad)
6. **HITL-flaggor** (vad Peter Johansson behÃ¶ver verifiera)

Svara pÃ¥ svenska. Var tekniskt precis men tillgÃ¤nglig.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system" as const, content: DPP_DELTA_PROMPT },
            { role: "user" as const, content: userPrompt },
          ],
        });
        const text =
          (response as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ??
          "DPP-generering misslyckades.";

        // Generate a DPP ID
        const dppId = `DPP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

        // Build JSON-LD
        const jsonLD = JSON.stringify(
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            identifier: dppId,
            name: input.productName,
            brand: { "@type": "Brand", name: input.brand },
            category: input.category || "Ej angiven",
            material: input.materials || "Ej angiven",
            additionalProperty: [
              { "@type": "PropertyValue", name: "CO2_footprint_kg", value: input.co2 || "0" },
              { "@type": "PropertyValue", name: "recycled_content_pct", value: input.recycledContent || "0" },
              { "@type": "PropertyValue", name: "ESPR_compliant", value: "true" },
              { "@type": "PropertyValue", name: "DPP_version", value: "1.0" },
              { "@type": "PropertyValue", name: "issued", value: new Date().toISOString().split("T")[0] },
              { "@type": "PropertyValue", name: "regulation", value: "EU 2024/1781 (ESPR)" },
            ],
          },
          null,
          2
        );

        return { analysis: text, dppId, jsonLD };
      } catch (error) {
        console.error("[DPP Generate] LLM error:", error);
        return {
          analysis: "âš ï¸ AI-tjÃ¤nsten Ã¤r tillfÃ¤lligt otillgÃ¤nglig.",
          dppId: null,
          jsonLD: null,
        };
      }
    }),
});

