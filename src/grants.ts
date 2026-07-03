/**
 * NEXUS-OS – Grants Router
 * AI-driven bidragsmatchning och ansökningsgenerering via Grant-Gamma
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

const GRANT_GAMMA_PROMPT = `Du är Grant-Gamma, en bidragsmatchnings-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar på svenska och är strategisk och detaljorienterad. Du matchar företag mot:
- EU Horisont Europa, Life+, ERUF, Erasmus+
- Vinnova (Cirkulär ekonomi, Innovativa startups, Spårbara cirkulära produktflöden)
- Almi (Innovationslån, Verifieringsmedel)
- Klimatklivet, Energimyndigheten Industriklivet
- Naturvårdsverket (Klimatinvesteringsstöd)
- Tillväxtverket (Regionala fonder)

Du rapporterar alltid matchningsgrad (%), belopp (SEK/EUR), deadline och ansökningskrav.
Peter Johansson är din HITL-operatör. Håll svar korta och handlingsinriktade.
Använd â˜… för hög matchning (>80%), â—‹ för medel (50-80%), Â· för låg (<50%).`;

const DPP_DELTA_PROMPT = `Du är DPP-Delta, en Digital Produktpass-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar på svenska och är noggrann och EU-regelkunnig. Du arbetar med:
- ESPR-förordningen (EU) 2024/1781
- ISO 14040/14044 (LCA-analys)
- EU-taxonomin för hållbar verksamhet
- Scope 1, 2 och 3 utsläppsberäkningar
- JSON-LD format för DPP-data
Du flaggar alltid när du är osäker och kräver Peters expertbedömning för klassificeringar.
Peter Johansson är din HITL-operatör. Håll svar korta och tekniskt precisa.
Använd âœ“ för verifierat, ? för osäkert, âš ï¸ för kräver beslut.`;

export const grantsRouter = router({
  /**
   * AI-generera ett ansökningsutkast för ett specifikt bidragsprogram
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
      const userPrompt = `Generera ett professionellt ansökningsutkast för följande bidragsprogram:

**Program:** ${input.grantName}
**Leverantör:** ${input.grantProvider}
${input.companyDescription ? `**Företagsbeskrivning:** ${input.companyDescription}` : "**Företag:** Nexus-OS AB – AI-plattform för EU-hållbarhetsefterlevnad (DPP, bidragsmatchning, greenwashing-detektion)"}
${input.projectIdea ? `**ProjektidÃ©:** ${input.projectIdea}` : "**ProjektidÃ©:** Implementering av EU ESPR-kompatibla Digitala Produktpass med AI-driven LCA-analys för svenska tillverkare"}

Strukturera ansökan med:
1. **Projektsammanfattning** (3-4 meningar)
2. **Problemformulering** (varför detta projekt behövs)
3. **Lösning och innovation** (vad som är nytt och unikt)
4. **Förväntade resultat** (konkreta, mätbara mål)
5. **Budget och resurser** (uppskattad kostnad och finansieringsplan)
6. **Tidplan** (milstolpar)
7. **Eligibilitetsmotivering** (varför vi uppfyller kraven)

Håll varje sektion under 100 ord. Skriv på svenska. Var konkret och faktabaserad.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system" as const, content: GRANT_GAMMA_PROMPT },
            { role: "user" as const, content: userPrompt },
          ],
        });
        const text =
          (response as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ??
          "Ansökningsgenerering misslyckades.";
        return { application: text, grantName: input.grantName };
      } catch (error) {
        console.error("[Grants] LLM error:", error);
        return {
          application: "âš ï¸ AI-tjänsten är tillfälligt otillgänglig. Försök igen om ett ögonblick.",
          grantName: input.grantName,
        };
      }
    }),

  /**
   * AI-matchning: analysera ett företag mot alla tillgängliga bidragsprogram
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
      const userPrompt = `Analysera följande företag och identifiera de 5 mest relevanta bidragsprogrammen:

**Företagsbeskrivning:** ${input.companyDescription}
${input.industry ? `**Bransch:** ${input.industry}` : ""}
${input.size ? `**Storlek:** ${input.size}` : ""}

För varje program, ange:
- Programnamn och leverantör
- Matchningsgrad (â˜…/â—‹/Â·) och procent
- Maximalt belopp (SEK/EUR)
- Nästa deadline
- 2-3 meningar om varför detta program passar
- Viktigaste eligibilitetskravet att verifiera

Sortera efter matchningsgrad. Svara på svenska.`;

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
        return { analysis: "âš ï¸ AI-tjänsten är tillfälligt otillgänglig." };
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
      const userPrompt = `Generera ett EU ESPR-kompatibelt Digitalt Produktpass (DPP) för:

**Produkt:** ${input.productName}
**Varumärke:** ${input.brand}
**Kategori:** ${input.category || "Ej angiven"}
**Material:** ${input.materials || "Ej angiven"}
**COâ‚‚-fotavtryck:** ${input.co2 ? `${input.co2} kg COâ‚‚e` : "Ej angiven"}
**Återvunnet innehåll:** ${input.recycledContent ? `${input.recycledContent}%` : "Ej angiven"}
${input.additionalInfo ? `**Ytterligare info:** ${input.additionalInfo}` : ""}

Generera:
1. **DPP-sammanfattning** (ESPR-status, nyckeldata)
2. **LCA-analys** (Scope 1, 2, 3 uppskattning baserat på materialen)
3. **Reparerbarhetsindex** (EU-skala 1-10 med motivering)
4. **End-of-Life rekommendation** (återvinning, demontering)
5. **Saknade datapunkter** (vad som behöver kompletteras för full ESPR-efterlevnad)
6. **HITL-flaggor** (vad Peter Johansson behöver verifiera)

Svara på svenska. Var tekniskt precis men tillgänglig.`;

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
          analysis: "âš ï¸ AI-tjänsten är tillfälligt otillgänglig.",
          dppId: null,
          jsonLD: null,
        };
      }
    }),
});

