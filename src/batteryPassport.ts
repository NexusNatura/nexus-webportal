/**
 * BatteryPassport Router â€“ EU BatterifÃ¶rordning 2023/1542 (ESPR)
 * Handles creation, retrieval, and JSON-LD generation for battery passports
 */
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { batteryPassports } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";

// â”€â”€â”€ Shared Zod schemas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const batteryPassportDraftSchema = z.object({
  // Step 1 â€“ Basic info
  productName: z.string().max(255).optional(),
  modelNumber: z.string().max(128).optional(),
  manufacturerName: z.string().max(255).optional(),
  manufacturerAddress: z.string().optional(),
  manufacturerContact: z.string().max(255).optional(),
  serialNumber: z.string().max(128).optional(),
  batchNumber: z.string().max(128).optional(),
  productionDate: z.string().max(32).optional(),
  batteryCategory: z.enum(["portable", "light_means", "ev", "industrial", "sli"]).optional(),
  gtin: z.string().max(64).optional(),

  // Step 2 â€“ Chemistry
  chemistry: z.enum(["li_nmc", "li_lco", "li_lfp", "li_nca", "li_lto", "nimh", "nicd", "lead_acid", "sodium", "other"]).optional(),
  nominalCapacityAh: z.number().positive().optional(),
  nominalVoltageV: z.number().positive().optional(),
  energyCapacityKwh: z.number().positive().optional(),
  energyDensityWhKg: z.number().positive().optional(),
  powerDensityWKg: z.number().positive().optional(),
  temperatureRangeMin: z.number().optional(),
  temperatureRangeMax: z.number().optional(),
  expectedLifecycleCycles: z.number().int().positive().optional(),
  expectedLifetimeYears: z.number().int().positive().optional(),

  // Step 3 â€“ Carbon footprint
  carbonFootprintKgCo2eKwh: z.number().positive().optional(),
  carbonFootprintSystemBoundary: z.enum(["cradle_to_gate", "cradle_to_grave", "gate_to_gate"]).optional(),
  carbonFootprintVerificationMethod: z.string().max(255).optional(),
  carbonFootprintThirdPartyVerifier: z.string().max(255).optional(),

  // Step 4 â€“ Recycled content
  recycledCobaltPct: z.number().min(0).max(100).optional(),
  recycledLithiumPct: z.number().min(0).max(100).optional(),
  recycledNickelPct: z.number().min(0).max(100).optional(),
  recycledLeadPct: z.number().min(0).max(100).optional(),
  recycledManganesePct: z.number().min(0).max(100).optional(),
  recycledContentVerifier: z.string().max(255).optional(),

  // Step 5 â€“ Dismantling
  requiredTools: z.string().optional(),
  safetyWarnings: z.string().optional(),
  serviceDocumentationUrl: z.string().url().optional(),

  // Step 6 â€“ End-of-life
  collectionScheme: z.string().max(255).optional(),
  collectionPointUrl: z.string().url().optional(),
  approvedRecycler: z.string().max(255).optional(),
  approvedRecyclerCertification: z.string().max(128).optional(),
  revacFacilityCode: z.string().max(64).optional(),
});

export type BatteryPassportDraft = z.infer<typeof batteryPassportDraftSchema>;

export const batteryPassportRouter = router({
  /**
   * Create a new battery passport draft
   * Returns the ID for use in the 6-step wizard
   */
  createDraft: protectedProcedure
    .input(batteryPassportDraftSchema.optional())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      // Generate unique passportId: BPP-YYYY-XXXXXX
      const year = new Date().getFullYear();
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const passportId = `BPP-${year}-${randomSuffix}`;

      const insertData: any = {
        passportId,
        productName: input?.productName ?? "Untitled Battery",
        modelNumber: input?.modelNumber ?? "MODEL-001",
        manufacturerName: input?.manufacturerName ?? "Unknown Manufacturer",
        batteryCategory: input?.batteryCategory ?? "portable",
        chemistry: input?.chemistry ?? "li_nmc",
      };
      if (input) {
        Object.assign(insertData, input);
      }

      const [inserted] = await db
        .insert(batteryPassports)
        .values(insertData)
        .$returningId();

      return { passportId: inserted.id };
    }),

  /**
   * Get a battery passport draft by ID (must belong to current user)
   */
  getDraft: protectedProcedure
    .input(z.object({ passportId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const [passport] = await db
        .select()
        .from(batteryPassports)
        .where(and(eq(batteryPassports.id, input.passportId), eq(batteryPassports.createdBy, ctx.user.id.toString())))
        .limit(1);

      return passport ?? null;
    }),

  /**
   * Update battery passport draft
   */
  updateDraft: protectedProcedure
    .input(
      z.object({
        passportId: z.number().int().positive(),
        data: batteryPassportDraftSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [existing] = await db
        .select()
        .from(batteryPassports)
        .where(and(eq(batteryPassports.id, input.passportId), eq(batteryPassports.createdBy, ctx.user.id.toString())))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Batteripasset hittades inte." });
      }

      await db
        .update(batteryPassports)
        .set(input.data as any)
        .where(eq(batteryPassports.id, input.passportId));

      return { ok: true };
    }),

  /**
   * List all battery passports for current user
   */
  listMyPassports: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(batteryPassports)
      .where(eq(batteryPassports.createdBy, ctx.user.id.toString()));
  }),

  /**
   * Generate JSON-LD document for the battery passport
   * Validates data and creates EU-compliant output
   */
  generateJsonLd: protectedProcedure
    .input(z.object({ passportId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [passport] = await db
        .select()
        .from(batteryPassports)
        .where(and(eq(batteryPassports.id, input.passportId), eq(batteryPassports.createdBy, ctx.user.id.toString())))
        .limit(1);

      if (!passport) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Batteripasset hittades inte." });
      }

      // Validate required fields
      if (!passport.manufacturerName || !passport.serialNumber || !passport.batteryCategory) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Obligatoriska fÃ¤lt saknas: tillverkare, serienummer, batterikategori.",
        });
      }

      // Generate JSON-LD using LLM
      const prompt = `Generate a valid EU Battery Regulation (2023/1542) JSON-LD document for this battery:

Manufacturer: ${passport.manufacturerName}
Address: ${passport.manufacturerAddress || "N/A"}
Serial: ${passport.serialNumber}
Category: ${passport.batteryCategory}
Chemistry: ${passport.chemistry}
Capacity: ${passport.energyCapacityKwh} kWh
Carbon Footprint: ${passport.carbonFootprintKgCo2eKwh} kg COâ‚‚e/kWh
Recycled Content: Co ${passport.recycledCobaltPct}%, Li ${passport.recycledLithiumPct}%, Ni ${passport.recycledNickelPct}%

Return ONLY valid JSON-LD (no markdown, no explanation). Use the ESPR schema.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are an EU Battery Regulation (2023/1542) compliance expert. Generate valid JSON-LD documents that comply with the ESPR specification.",
          },
          { role: "user", content: prompt as any },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "battery_jsonld",
            strict: true,
            schema: {
              type: "object",
              properties: {
                "@context": { type: "string" },
                "@type": { type: "string" },
                manufacturer: { type: "object" },
                batteryProperties: { type: "object" },
                carbonFootprint: { type: "object" },
                recycledContent: { type: "object" },
              },
              required: ["@context", "@type", "manufacturer", "batteryProperties"],
              additionalProperties: true,
            },
          },
        },
      });

      const content = response.choices[0].message.content;
      const jsonLdStr = typeof content === "string" ? content : JSON.stringify(content);
      const jsonLd = JSON.parse(jsonLdStr || "{}");

      // Save to database
      await db
        .update(batteryPassports)
        .set({ jsonLdDocument: jsonLd as any, publishedAt: new Date() })
        .where(eq(batteryPassports.id, input.passportId));

      return { jsonLd, ok: true };
    }),

  /**
   * Publish battery passport (marks as official, generates QR code)
   */
  publish: protectedProcedure
    .input(z.object({ passportId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [passport] = await db
        .select()
        .from(batteryPassports)
        .where(and(eq(batteryPassports.id, input.passportId), eq(batteryPassports.createdBy, ctx.user.id.toString())))
        .limit(1);

      if (!passport) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Batteripasset hittades inte." });
      }

      if (!passport.jsonLdDocument) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "JSON-LD-dokumentet mÃ¥ste genereras innan publicering.",
        });
      }

      // Generate QR code URL (using a simple encoding for now)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `https://nexus-os.se/batteripass/${input.passportId}`
      )}`;

      await db
        .update(batteryPassports)
        .set({ qrCodeUrl, publishedAt: new Date() })
        .where(eq(batteryPassports.id, input.passportId));

      return { ok: true, qrCodeUrl };
    }),
});

