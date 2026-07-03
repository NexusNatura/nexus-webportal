import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { complianceRouter } from "./routers/compliance";
import { batteryRouter } from "./routers/battery";
import { blogRouter } from "./routers/blog";
import { grantsRouter } from "./routers/grants";
import { marketplaceRouter } from "./routers/marketplace";
import { agentsRouter } from "./routers/agents";
import { dppRouter } from "./routers/dpp";
import { pricingRouter } from "./routers/pricing";
import { batteryPassportRouter } from "./routers/batteryPassport";
import { misuseRouter } from "./routers/misuse";

// â”€â”€â”€ Agent Personalities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AGENT_PERSONAS: Record<string, string> = {
  "gwd-alpha": `Du är GWD-Alpha, en specialiserad AI-agent för greenwashing-detektion inom Nexus-OS HITL Operator Center.
Du kommunicerar på svenska, är analytisk och precis. Du använder 14 detektionstaktiker:
1. Scope 3-utelämning, 2. Kompensationsöverdrift, 3. Tidslinje-manipulation, 4. Geografisk avgränsning,
5. Vag terminologi, 6. Certifieringsbrist, 7. Delvis sanning, 8. Jämförelsemanipulation,
9. Framtidslöften utan grund, 10. Greenwash-washing, 11. Absoluta påståenden, 12. Irrelevant information,
13. Bortledande fokus, 14. Statistikmissbruk.
Du rapporterar alltid med ärendekod (NIF-2026-GWD-XXX), allvarlighetsgrad (KRITISK/HÖG/MEDEL/LÅG) och AI-konfidensgrad (%).
Peter Johansson är din HITL-operatör – du kan inte agera på flaggade ärenden utan hans godkännande.
Håll svar korta och faktabaserade. Använd âš ï¸ för varningar, âœ… för godkänt, ðŸ” för pågående analys.`,

  "scraper-beta": `Du är Scraper-Beta, en webbskrapnings- och datainsamlingsagent inom Nexus-OS HITL Operator Center.
Du kommunicerar på svenska och är effektiv och teknisk. Du skrapar:
- TED Europa (EU-upphandlingar med ESPR-koppling)
- Vinnova.se (öppna utlysningar)
- Naturvårdsverket (miljöbidrag)
- Regionala webbplatser (hållbarhetsrapporter)
Du rapporterar alltid jobbstatus (JOB-2026-XXXX), antal träffar, framsteg (%) och ETA.
Peter Johansson är din HITL-operatör. Håll svar korta och tekniska.
Använd âŸ³ för pågående jobb, âœ“ för klara jobb, âœ— för fel.`,

  "grant-gamma": `Du är Grant-Gamma, en bidragsmatchnings-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar på svenska och är strategisk och detaljorienterad. Du matchar företag mot:
- EU Horisont Europa, Life+, ERUF
- Vinnova (Cirkulär ekonomi, Innovativa startups)
- Almi (Innovationslån, Verifieringsbidrag)
- Klimatklivet, Energimyndigheten
- Naturvårdsverket (Klimatinvesteringsstöd)
Du rapporterar alltid matchningsgrad (%), belopp (SEK/EUR), deadline och ansökningskrav.
Peter Johansson är din HITL-operatör. Håll svar korta och handlingsinriktade.
Använd â˜… för hög matchning, â—‹ för medel, Â· för låg.`,

  "dpp-delta": `Du är DPP-Delta, en Digital Produktpass-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar på svenska och är noggrann och EU-regelkunnig. Du arbetar med:
- ESPR-förordningen (EU) 2024/1781
- ISO 14040/14044 (LCA-analys)
- EU-taxonomin för hållbar verksamhet
- Scope 1, 2 och 3 utsläppsberäkningar
- JSON-LD format för DPP-data
Du flaggar alltid när du är osäker och kräver Peters expertbedömning för klassificeringar.
Peter Johansson är din HITL-operatör. Håll svar korta och tekniskt precisa.
Använd âœ“ för verifierat, ? för osäkert, âš ï¸ för kräver beslut.`,
};

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  compliance: complianceRouter,
  battery: batteryRouter,
  blog: blogRouter,
  grants: grantsRouter,
  marketplace: marketplaceRouter,
  agents: agentsRouter,
  dpp: dppRouter,
  pricing: pricingRouter,
  batteryPassport: batteryPassportRouter,
  misuse: misuseRouter,

  // â”€â”€â”€ Agent Chat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  agent: router({
    chat: publicProcedure
      .input(
        z.object({
          agentId: z.string(),
          message: z.string().max(2000),
          context: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const systemPrompt = AGENT_PERSONAS[input.agentId] ?? AGENT_PERSONAS["gwd-alpha"];
        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
          { role: "system", content: systemPrompt },
        ];
        if (input.context) {
          messages.push({ role: "user", content: `[KONTEXT \u2013 Aktuellt \u00e4rende/jobb]\n${input.context}` });
          messages.push({ role: "assistant", content: "F\u00f6rst\u00e5r kontexten. Jag \u00e4r redo att hj\u00e4lpa." });
        }
        messages.push({ role: "user", content: input.message });
        try {
          const response = await invokeLLM({ messages });
          const text = (response as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ?? "Inget svar fr\u00e5n agenten.";
          return { reply: text, agentId: input.agentId };
        } catch (error) {
          console.error("[Agent Chat] LLM error:", error);
          return { reply: "\u26a0\ufe0f Agenten \u00e4r tillf\u00e4lligt otillg\u00e4nglig. F\u00f6rs\u00f6k igen om ett \u00f6gonblick.", agentId: input.agentId };
        }
      }),

    analyzeGWD: publicProcedure
      .input(
        z.object({
          company: z.string(),
          claim: z.string(),
          url: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const systemPrompt = AGENT_PERSONAS["gwd-alpha"];
        const userPrompt = `Analysera f\u00f6ljande h\u00e5llbarhetsP\u00e5st\u00e5ende f\u00f6r potentiell greenwashing:\n\nF\u00f6retag: ${input.company}\nP\u00e5st\u00e5ende: "${input.claim}"\n${input.url ? `K\u00e4lla: ${input.url}` : ""}\n\nGe en strukturerad analys med:\n1. Identifierade greenwash-taktiker (lista med namn)\n2. Bevisunderlag (vad saknas eller \u00e4r missvisande)\n3. Allvarlighetsgrad (KRITISK/H\u00d6G/MEDEL/L\u00c5G)\n4. AI-konfidensgrad (0-100%)\n5. Rekommendation till HITL-operat\u00f6ren\n\nH\u00e5ll svaret under 200 ord. Var konkret och faktabaserad.`;
        try {
          const response = await invokeLLM({
            messages: [
              { role: "system" as const, content: systemPrompt },
              { role: "user" as const, content: userPrompt },
            ],
          });
          const text = (response as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ?? "Analys misslyckades.";
          return { analysis: text };
        } catch (error) {
          console.error("[GWD Analysis] LLM error:", error);
          return { analysis: "\u26a0\ufe0f Analys tillf\u00e4lligt otillg\u00e4nglig." };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

