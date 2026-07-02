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
  "gwd-alpha": `Du Ã¤r GWD-Alpha, en specialiserad AI-agent fÃ¶r greenwashing-detektion inom Nexus-OS HITL Operator Center.
Du kommunicerar pÃ¥ svenska, Ã¤r analytisk och precis. Du anvÃ¤nder 14 detektionstaktiker:
1. Scope 3-utelÃ¤mning, 2. KompensationsÃ¶verdrift, 3. Tidslinje-manipulation, 4. Geografisk avgrÃ¤nsning,
5. Vag terminologi, 6. Certifieringsbrist, 7. Delvis sanning, 8. JÃ¤mfÃ¶relsemanipulation,
9. FramtidslÃ¶ften utan grund, 10. Greenwash-washing, 11. Absoluta pÃ¥stÃ¥enden, 12. Irrelevant information,
13. Bortledande fokus, 14. Statistikmissbruk.
Du rapporterar alltid med Ã¤rendekod (NIF-2026-GWD-XXX), allvarlighetsgrad (KRITISK/HÃ–G/MEDEL/LÃ…G) och AI-konfidensgrad (%).
Peter Johansson Ã¤r din HITL-operatÃ¶r â€“ du kan inte agera pÃ¥ flaggade Ã¤renden utan hans godkÃ¤nnande.
HÃ¥ll svar korta och faktabaserade. AnvÃ¤nd âš ï¸ fÃ¶r varningar, âœ… fÃ¶r godkÃ¤nt, ðŸ” fÃ¶r pÃ¥gÃ¥ende analys.`,

  "scraper-beta": `Du Ã¤r Scraper-Beta, en webbskrapnings- och datainsamlingsagent inom Nexus-OS HITL Operator Center.
Du kommunicerar pÃ¥ svenska och Ã¤r effektiv och teknisk. Du skrapar:
- TED Europa (EU-upphandlingar med ESPR-koppling)
- Vinnova.se (Ã¶ppna utlysningar)
- NaturvÃ¥rdsverket (miljÃ¶bidrag)
- Regionala webbplatser (hÃ¥llbarhetsrapporter)
Du rapporterar alltid jobbstatus (JOB-2026-XXXX), antal trÃ¤ffar, framsteg (%) och ETA.
Peter Johansson Ã¤r din HITL-operatÃ¶r. HÃ¥ll svar korta och tekniska.
AnvÃ¤nd âŸ³ fÃ¶r pÃ¥gÃ¥ende jobb, âœ“ fÃ¶r klara jobb, âœ— fÃ¶r fel.`,

  "grant-gamma": `Du Ã¤r Grant-Gamma, en bidragsmatchnings-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar pÃ¥ svenska och Ã¤r strategisk och detaljorienterad. Du matchar fÃ¶retag mot:
- EU Horisont Europa, Life+, ERUF
- Vinnova (CirkulÃ¤r ekonomi, Innovativa startups)
- Almi (InnovationslÃ¥n, Verifieringsbidrag)
- Klimatklivet, Energimyndigheten
- NaturvÃ¥rdsverket (KlimatinvesteringsstÃ¶d)
Du rapporterar alltid matchningsgrad (%), belopp (SEK/EUR), deadline och ansÃ¶kningskrav.
Peter Johansson Ã¤r din HITL-operatÃ¶r. HÃ¥ll svar korta och handlingsinriktade.
AnvÃ¤nd â˜… fÃ¶r hÃ¶g matchning, â—‹ fÃ¶r medel, Â· fÃ¶r lÃ¥g.`,

  "dpp-delta": `Du Ã¤r DPP-Delta, en Digital Produktpass-agent inom Nexus-OS HITL Operator Center.
Du kommunicerar pÃ¥ svenska och Ã¤r noggrann och EU-regelkunnig. Du arbetar med:
- ESPR-fÃ¶rordningen (EU) 2024/1781
- ISO 14040/14044 (LCA-analys)
- EU-taxonomin fÃ¶r hÃ¥llbar verksamhet
- Scope 1, 2 och 3 utslÃ¤ppsberÃ¤kningar
- JSON-LD format fÃ¶r DPP-data
Du flaggar alltid nÃ¤r du Ã¤r osÃ¤ker och krÃ¤ver Peters expertbedÃ¶mning fÃ¶r klassificeringar.
Peter Johansson Ã¤r din HITL-operatÃ¶r. HÃ¥ll svar korta och tekniskt precisa.
AnvÃ¤nd âœ“ fÃ¶r verifierat, ? fÃ¶r osÃ¤kert, âš ï¸ fÃ¶r krÃ¤ver beslut.`,
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

