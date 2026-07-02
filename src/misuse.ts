import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { misuseScenarios } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const misuseRouter = router({
  // List all misuse scenarios
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(misuseScenarios);
  }),

  // Get a specific misuse scenario by ID
  getById: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error("ID must be a string");
    })
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(misuseScenarios)
        .where(eq(misuseScenarios.scenarioId, input))
        .limit(1);
      return rows.length > 0 ? rows[0] : null;
    }),

  // Get scenarios by type
  getByType: publicProcedure
    .input((val: unknown) => {
      const type = val as string;
      return type;
    })
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(misuseScenarios)
        .where(eq(misuseScenarios.scenarioType, input as any));
    }),

  // Create a new misuse scenario (protected - admin only)
  create: protectedProcedure
    .input((val: unknown) => {
      const obj = val as any;
      return {
        scenarioId: obj.scenarioId as string,
        title: obj.title as string,
        description: obj.description as string,
        affectedModule: obj.affectedModule as string,
        scenarioType: obj.scenarioType as
          | "false_positive"
          | "false_negative"
          | "misuse_by_user"
          | "data_poisoning"
          | "scope_creep"
          | "over_reliance",
        likelihood: obj.likelihood as number,
        consequence: obj.consequence as number,
        trigger: obj.trigger as string,
        impact: obj.impact as string,
        mitigationMeasures: obj.mitigationMeasures as string,
        detectionMethod: obj.detectionMethod as string | undefined,
      };
    })
    .mutation(async ({ input, ctx }) => {
      // Only admins can create misuse scenarios
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: Only admins can create misuse scenarios");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const result = await db.insert(misuseScenarios).values({
        scenarioId: input.scenarioId,
        title: input.title,
        description: input.description,
        affectedModule: input.affectedModule,
        scenarioType: input.scenarioType,
        likelihood: input.likelihood,
        consequence: input.consequence,
        trigger: input.trigger,
        impact: input.impact,
        mitigationMeasures: input.mitigationMeasures,
        detectionMethod: input.detectionMethod,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, id: (result as any).insertId || 0 };
    }),

  // Update misuse scenario
  update: protectedProcedure
    .input((val: unknown) => {
      const obj = val as any;
      return {
        scenarioId: obj.scenarioId as string,
        likelihood: obj.likelihood as number | undefined,
        consequence: obj.consequence as number | undefined,
        mitigationMeasures: obj.mitigationMeasures as string | undefined,
      };
    })
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: Only admins can update misuse scenarios");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const updates: any = { updatedAt: new Date() };
      if (input.likelihood !== undefined) updates.likelihood = input.likelihood;
      if (input.consequence !== undefined) updates.consequence = input.consequence;
      if (input.mitigationMeasures !== undefined)
        updates.mitigationMeasures = input.mitigationMeasures;

      await db
        .update(misuseScenarios)
        .set(updates)
        .where(eq(misuseScenarios.scenarioId, input.scenarioId));

      return { success: true };
    }),

  // Seed misuse scenarios (protected - admin only)
  seed: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Unauthorized: Only admins can seed data");
    }

    const scenarios = [
      {
        scenarioId: "WA-04-FALSE-POSITIVE",
        title: "GWD Falskt Positivt â€“ Greenwashing-flagga",
        description:
          "GWD-Alpha flaggar ett fÃ¶retags hÃ¥llbarhetsrapport som greenwashing nÃ¤r det faktiskt fÃ¶ljer EU-standarder.",
        affectedModule: "GWD-Alpha",
        scenarioType: "false_positive" as const,
        likelihood: 3,
        consequence: 4,
        trigger:
          "FÃ¶retag med certifierad grÃ¶n produktion publicerar hÃ¥llbarhetsrapport",
        impact:
          "Felaktig flaggning skadar fÃ¶retagets rykte och kan leda till rÃ¤ttsliga Ã¥tgÃ¤rder",
        mitigationMeasures:
          "Implementera dubbel-verifikation med HITL-granskning innan flagga publiceras. LÃ¤gg till appeals-process fÃ¶r fÃ¶retag.",
        detectionMethod:
          "JÃ¤mfÃ¶r flaggade pÃ¥stÃ¥enden mot certifieringsdatabaser (FSC, B Corp, etc.)",
      },
      {
        scenarioId: "GRANT-GAMMA-MISMATCH",
        title: "Grant-Gamma Felaktig Matchning â€“ Fel Bidragsprogram",
        description:
          "Grant-Gamma rekommenderar ett EU-bidragsprogram som inte matchar fÃ¶retagets profil eller Ã¤r stÃ¤ngt fÃ¶r ansÃ¶kan.",
        affectedModule: "Grant-Gamma",
        scenarioType: "false_negative" as const,
        likelihood: 2,
        consequence: 3,
        trigger:
          "SmÃ¥fÃ¶retag sÃ¶ker bidrag fÃ¶r industriell omstÃ¤llning eller cirkulÃ¤r ekonomi",
        impact:
          "FÃ¶retag missar relevanta bidrag och fÃ¥r rekommendation om irrelevanta program",
        mitigationMeasures:
          "Validera bidragsprogram mot aktuella tidsfrister och krav. Implementera feedback-loop frÃ¥n anvÃ¤ndare.",
        detectionMethod:
          "JÃ¤mfÃ¶r rekommenderade program mot fÃ¶retagets bransch och storlek",
      },
      {
        scenarioId: "SCRAPER-BETA-EXCLUSION",
        title: "WA-04 Felaktig Nekad â€“ Legitimt Bidrag Avvisas",
        description:
          "Webskrapningsagenten (Scraper-Beta) klassificerar ett legitimt bidragsprogram som 'inte relevant' och exkluderar det frÃ¥n resultatet.",
        affectedModule: "Scraper-Beta",
        scenarioType: "false_negative" as const,
        likelihood: 2,
        consequence: 4,
        trigger:
          "Scraper-Beta klassificerar bidragsprogram baserat pÃ¥ nyckelordsmatchning",
        impact:
          "FÃ¶retag missar kritiska bidrag fÃ¶r cirkulÃ¤r ekonomi eller ESPR-relaterade stÃ¶d",
        mitigationMeasures:
          "Implementera manuell granskning av exkluderade bidrag. LÃ¤gg till user-feedback fÃ¶r att trÃ¤na om klassificeringsmodellen.",
        detectionMethod:
          "SpÃ¥ra anvÃ¤ndarfeedback nÃ¤r anvÃ¤ndare hittar relevanta bidrag som agenten missade",
      },
    ];

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    for (const scenario of scenarios) {
      // Check if scenario already exists
      const existing = await db
        .select()
        .from(misuseScenarios)
        .where(eq(misuseScenarios.scenarioId, scenario.scenarioId))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(misuseScenarios).values({
          ...scenario,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return { success: true, count: scenarios.length };
  }),
});

