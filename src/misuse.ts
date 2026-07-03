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
        title: "GWD Falskt Positivt – Greenwashing-flagga",
        description:
          "GWD-Alpha flaggar ett företags hållbarhetsrapport som greenwashing när det faktiskt följer EU-standarder.",
        affectedModule: "GWD-Alpha",
        scenarioType: "false_positive" as const,
        likelihood: 3,
        consequence: 4,
        trigger:
          "Företag med certifierad grön produktion publicerar hållbarhetsrapport",
        impact:
          "Felaktig flaggning skadar företagets rykte och kan leda till rättsliga åtgärder",
        mitigationMeasures:
          "Implementera dubbel-verifikation med HITL-granskning innan flagga publiceras. Lägg till appeals-process för företag.",
        detectionMethod:
          "Jämför flaggade påståenden mot certifieringsdatabaser (FSC, B Corp, etc.)",
      },
      {
        scenarioId: "GRANT-GAMMA-MISMATCH",
        title: "Grant-Gamma Felaktig Matchning – Fel Bidragsprogram",
        description:
          "Grant-Gamma rekommenderar ett EU-bidragsprogram som inte matchar företagets profil eller är stängt för ansökan.",
        affectedModule: "Grant-Gamma",
        scenarioType: "false_negative" as const,
        likelihood: 2,
        consequence: 3,
        trigger:
          "Småföretag söker bidrag för industriell omställning eller cirkulär ekonomi",
        impact:
          "Företag missar relevanta bidrag och får rekommendation om irrelevanta program",
        mitigationMeasures:
          "Validera bidragsprogram mot aktuella tidsfrister och krav. Implementera feedback-loop från användare.",
        detectionMethod:
          "Jämför rekommenderade program mot företagets bransch och storlek",
      },
      {
        scenarioId: "SCRAPER-BETA-EXCLUSION",
        title: "WA-04 Felaktig Nekad – Legitimt Bidrag Avvisas",
        description:
          "Webskrapningsagenten (Scraper-Beta) klassificerar ett legitimt bidragsprogram som 'inte relevant' och exkluderar det från resultatet.",
        affectedModule: "Scraper-Beta",
        scenarioType: "false_negative" as const,
        likelihood: 2,
        consequence: 4,
        trigger:
          "Scraper-Beta klassificerar bidragsprogram baserat på nyckelordsmatchning",
        impact:
          "Företag missar kritiska bidrag för cirkulär ekonomi eller ESPR-relaterade stöd",
        mitigationMeasures:
          "Implementera manuell granskning av exkluderade bidrag. Lägg till user-feedback för att träna om klassificeringsmodellen.",
        detectionMethod:
          "Spåra användarfeedback när användare hittar relevanta bidrag som agenten missade",
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

