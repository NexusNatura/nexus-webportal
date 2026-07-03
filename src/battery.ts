import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { batteryPassports, InsertBatteryPassport } from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

// â”€â”€â”€ Zod Schemas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const step1Schema = z.object({
  productName: z.string().min(1),
  modelNumber: z.string().min(1),
  manufacturerName: z.string().min(1),
  manufacturerCountry: z.string().optional(),
  manufacturerAddress: z.string().optional(),
  manufacturerContact: z.string().optional(),
  serialNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  productionDate: z.string().optional(),
  batteryCategory: z.enum(["portable", "light_means", "ev", "industrial", "sli"]),
  gtin: z.string().optional(),
});

const step2Schema = z.object({
  chemistry: z.enum(["li_nmc", "li_lco", "li_lfp", "li_nca", "li_lto", "nimh", "nicd", "lead_acid", "sodium", "other"]),
  nominalCapacityAh: z.number().optional(),
  nominalVoltageV: z.number().optional(),
  energyCapacityKwh: z.number().optional(),
  energyDensityWhKg: z.number().optional(),
  powerDensityWKg: z.number().optional(),
  temperatureRangeMin: z.number().optional(),
  temperatureRangeMax: z.number().optional(),
  expectedLifecycleCycles: z.number().int().optional(),
  expectedLifetimeYears: z.number().int().optional(),
});

const step3Schema = z.object({
  carbonFootprintKgCo2eKwh: z.number().optional(),
  carbonFootprintSystemBoundary: z.enum(["cradle_to_gate", "cradle_to_grave", "gate_to_gate"]).optional(),
  carbonFootprintVerificationMethod: z.string().optional(),
  carbonFootprintThirdPartyVerifier: z.string().optional(),
  carbonFootprintBreakdown: z.record(z.string(), z.number()).optional(),
});

const step4Schema = z.object({
  recycledCobaltPct: z.number().min(0).max(100).optional(),
  recycledLithiumPct: z.number().min(0).max(100).optional(),
  recycledNickelPct: z.number().min(0).max(100).optional(),
  recycledLeadPct: z.number().min(0).max(100).optional(),
  recycledManganesePct: z.number().min(0).max(100).optional(),
  recycledContentVerifier: z.string().optional(),
  recycledContentVerificationDate: z.string().optional(),
});

const step5Schema = z.object({
  dismantlingInstructions: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
    tool: z.string().optional(),
    warning: z.string().optional(),
  })).optional(),
  requiredTools: z.string().optional(),
  safetyWarnings: z.string().optional(),
  serviceDocumentationUrl: z.string().optional(),
});

const step6Schema = z.object({
  collectionScheme: z.string().optional(),
  collectionPointUrl: z.string().optional(),
  approvedRecycler: z.string().optional(),
  approvedRecyclerCertification: z.string().optional(),
  recyclingTargets: z.record(z.string(), z.number()).optional(),
  revacFacilityCode: z.string().optional(),
});

// â”€â”€â”€ Helper: Generate Passport ID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function generatePassportId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BPP-${year}-${rand}`;
}

// â”€â”€â”€ Helper: Build JSON-LD Document â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function buildJsonLd(passport: typeof batteryPassports.$inferSelect) {
  const chemistryLabels: Record<string, string> = {
    li_nmc: "Lithium Nickel Manganese Cobalt Oxide (NMC)",
    li_lco: "Lithium Cobalt Oxide (LCO)",
    li_lfp: "Lithium Iron Phosphate (LFP)",
    li_nca: "Lithium Nickel Cobalt Aluminium Oxide (NCA)",
    li_lto: "Lithium Titanate Oxide (LTO)",
    nimh: "Nickel-Metal Hydride (NiMH)",
    nicd: "Nickel-Cadmium (NiCd)",
    lead_acid: "Lead-Acid",
    sodium: "Sodium-Ion",
    other: "Other",
  };

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `https://nexus-os.eu/passport/${passport.passportId}`,
    "identifier": passport.passportId,
    "name": passport.productName,
    "model": passport.modelNumber,
    "gtin": passport.gtin,
    "manufacturer": {
      "@type": "Organization",
      "name": passport.manufacturerName,
      "address": passport.manufacturerAddress,
      "contactPoint": passport.manufacturerContact,
      "addressCountry": passport.manufacturerCountry,
    },
    "productionDate": passport.productionDate,
    "serialNumber": passport.serialNumber,
    "batteryCategory": passport.batteryCategory,
    "batteryChemistry": chemistryLabels[passport.chemistry] ?? passport.chemistry,
    "electricalCharacteristics": {
      "nominalCapacity": passport.nominalCapacityAh ? `${passport.nominalCapacityAh} Ah` : null,
      "nominalVoltage": passport.nominalVoltageV ? `${passport.nominalVoltageV} V` : null,
      "energyCapacity": passport.energyCapacityKwh ? `${passport.energyCapacityKwh} kWh` : null,
      "energyDensity": passport.energyDensityWhKg ? `${passport.energyDensityWhKg} Wh/kg` : null,
      "expectedLifecycle": passport.expectedLifecycleCycles ? `${passport.expectedLifecycleCycles} cycles` : null,
      "expectedLifetime": passport.expectedLifetimeYears ? `${passport.expectedLifetimeYears} years` : null,
    },
    "carbonFootprint": passport.carbonFootprintKgCo2eKwh ? {
      "@type": "QuantitativeValue",
      "value": passport.carbonFootprintKgCo2eKwh,
      "unitCode": "kg COâ‚‚e/kWh",
      "systemBoundary": passport.carbonFootprintSystemBoundary,
      "verificationMethod": passport.carbonFootprintVerificationMethod,
      "thirdPartyVerifier": passport.carbonFootprintThirdPartyVerifier,
      "breakdown": passport.carbonFootprintBreakdown,
    } : null,
    "recycledContent": {
      "cobalt": passport.recycledCobaltPct ? `${passport.recycledCobaltPct}%` : null,
      "lithium": passport.recycledLithiumPct ? `${passport.recycledLithiumPct}%` : null,
      "nickel": passport.recycledNickelPct ? `${passport.recycledNickelPct}%` : null,
      "lead": passport.recycledLeadPct ? `${passport.recycledLeadPct}%` : null,
      "manganese": passport.recycledManganesePct ? `${passport.recycledManganesePct}%` : null,
      "verifier": passport.recycledContentVerifier,
    },
    "dismantlingInformation": {
      "instructions": passport.dismantlingInstructions,
      "requiredTools": passport.requiredTools,
      "safetyWarnings": passport.safetyWarnings,
      "serviceDocumentation": passport.serviceDocumentationUrl,
    },
    "endOfLife": {
      "collectionScheme": passport.collectionScheme,
      "collectionPoint": passport.collectionPointUrl,
      "approvedRecycler": passport.approvedRecycler,
      "recyclerCertification": passport.approvedRecyclerCertification,
      "recyclingTargets": passport.recyclingTargets,
    },
    "regulatoryCompliance": {
      "regulation": "EU Regulation 2023/1542 (Battery Regulation)",
      "passportVersion": "1.0",
      "issuedBy": "Nexus-OS BatteryPassport Builder",
      "issuedAt": new Date().toISOString(),
    },
  };
}

// â”€â”€â”€ Helper: Completeness Score â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function calculateCompleteness(passport: typeof batteryPassports.$inferSelect): number {
  const fields = [
    passport.productName, passport.modelNumber, passport.manufacturerName,
    passport.batteryCategory, passport.chemistry,
    passport.nominalCapacityAh, passport.nominalVoltageV, passport.energyCapacityKwh,
    passport.carbonFootprintKgCo2eKwh, passport.carbonFootprintSystemBoundary,
    passport.recycledCobaltPct, passport.recycledLithiumPct,
    passport.dismantlingInstructions, passport.safetyWarnings,
    passport.collectionScheme, passport.approvedRecycler,
  ];
  const filled = fields.filter(f => f !== null && f !== undefined).length;
  return Math.round((filled / fields.length) * 100);
}

// â”€â”€â”€ Router â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const batteryRouter = router({
  /** List all battery passports */
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(batteryPassports).orderBy(desc(batteryPassports.createdAt));
    return rows.map(r => ({ ...r, completeness: calculateCompleteness(r) }));
  }),

  /** Get single passport by passportId */
  getById: publicProcedure
    .input(z.object({ passportId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(batteryPassports)
        .where(eq(batteryPassports.passportId, input.passportId))
        .limit(1);
      if (!rows[0]) return null;
      return { ...rows[0], completeness: calculateCompleteness(rows[0]) };
    }),

  /** Create new draft passport (step 1) */
  create: publicProcedure
    .input(step1Schema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const passportId = generatePassportId();
      const insertData: InsertBatteryPassport = {
        passportId,
        status: "draft",
        productName: input.productName,
        modelNumber: input.modelNumber,
        manufacturerName: input.manufacturerName,
        batteryCategory: input.batteryCategory,
        // chemistry is required in DB but filled in step 2; use a placeholder
        chemistry: "other" as const,
        manufacturerCountry: input.manufacturerCountry,
        manufacturerAddress: input.manufacturerAddress,
        manufacturerContact: input.manufacturerContact,
        serialNumber: input.serialNumber,
        batchNumber: input.batchNumber,
        productionDate: input.productionDate,
        gtin: input.gtin,
      };
      await db.insert(batteryPassports).values(insertData);
      return { passportId };
    }),

  /** Update step 2: Battery chemistry */
  updateStep2: publicProcedure
    .input(z.object({ passportId: z.string() }).merge(step2Schema))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { passportId, ...data } = input;
      await db.update(batteryPassports).set(data).where(eq(batteryPassports.passportId, passportId));
      return { success: true };
    }),

  /** Update step 3: Carbon footprint */
  updateStep3: publicProcedure
    .input(z.object({ passportId: z.string() }).merge(step3Schema))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { passportId, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.carbonFootprintBreakdown) {
        updateData.carbonFootprintBreakdown = data.carbonFootprintBreakdown;
      }
      await db.update(batteryPassports).set(updateData).where(eq(batteryPassports.passportId, passportId));
      return { success: true };
    }),

  /** Update step 4: Recycled content */
  updateStep4: publicProcedure
    .input(z.object({ passportId: z.string() }).merge(step4Schema))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { passportId, ...data } = input;
      await db.update(batteryPassports).set(data).where(eq(batteryPassports.passportId, passportId));
      return { success: true };
    }),

  /** Update step 5: Dismantling instructions */
  updateStep5: publicProcedure
    .input(z.object({ passportId: z.string() }).merge(step5Schema))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { passportId, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.dismantlingInstructions) {
        updateData.dismantlingInstructions = data.dismantlingInstructions;
      }
      await db.update(batteryPassports).set(updateData).where(eq(batteryPassports.passportId, passportId));
      return { success: true };
    }),

  /** Update step 6: End-of-life */
  updateStep6: publicProcedure
    .input(z.object({ passportId: z.string() }).merge(step6Schema))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { passportId, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.recyclingTargets) {
        updateData.recyclingTargets = data.recyclingTargets;
      }
      await db.update(batteryPassports).set(updateData).where(eq(batteryPassports.passportId, passportId));
      return { success: true };
    }),

  /** Generate JSON-LD document and save it */
  generateJsonLd: publicProcedure
    .input(z.object({ passportId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const rows = await db.select().from(batteryPassports)
        .where(eq(batteryPassports.passportId, input.passportId)).limit(1);
      if (!rows[0]) throw new Error("Passport not found");
      const jsonLd = buildJsonLd(rows[0]);
      await db.update(batteryPassports)
        .set({ jsonLdDocument: jsonLd })
        .where(eq(batteryPassports.passportId, input.passportId));
      return { jsonLd };
    }),

  /** AI-assisted gap analysis using Gemini */
  analyzeGaps: publicProcedure
    .input(z.object({ passportId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const rows = await db.select().from(batteryPassports)
        .where(eq(batteryPassports.passportId, input.passportId)).limit(1);
      if (!rows[0]) throw new Error("Passport not found");

      const passport = rows[0];
      const completeness = calculateCompleteness(passport);

      const prompt = `Du är DPP-Delta, en AI-expert på EU Batteriförordning 2023/1542 och Digitala Produktpass.

Analysera följande batteripass och identifiera:
1. Saknade obligatoriska datapunkter (kritiska gap)
2. Rekommenderade datapunkter som stärker passportets trovärdighet
3. Specifika åtgärder för att uppnå full efterlevnad

Batteripass: ${JSON.stringify({
  category: passport.batteryCategory,
  chemistry: passport.chemistry,
  carbonFootprint: passport.carbonFootprintKgCo2eKwh,
  recycledCobalt: passport.recycledCobaltPct,
  recycledLithium: passport.recycledLithiumPct,
  dismantlingInstructions: !!passport.dismantlingInstructions,
  collectionScheme: passport.collectionScheme,
  approvedRecycler: passport.approvedRecycler,
  completeness: completeness,
}, null, 2)}

Svara på svenska med konkreta, handlingsbara rekommendationer. Fokusera på de tre viktigaste gapen.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Du är DPP-Delta, expert på EU Batteriförordning 2023/1542. Ge konkreta, handlingsbara råd på svenska." },
          { role: "user", content: prompt },
        ],
      });

      const analysis = response.choices[0]?.message?.content ?? "Analys ej tillgänglig";
      return { analysis, completeness };
    }),

  /** Publish passport (change status to published) */
  publish: publicProcedure
    .input(z.object({ passportId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const rows = await db.select().from(batteryPassports)
        .where(eq(batteryPassports.passportId, input.passportId)).limit(1);
      if (!rows[0]) throw new Error("Passport not found");

      // Generate JSON-LD before publishing
      const jsonLd = buildJsonLd(rows[0]);

      await db.update(batteryPassports)
        .set({
          status: "published",
          jsonLdDocument: jsonLd,
          publishedAt: new Date(),
        })
        .where(eq(batteryPassports.passportId, input.passportId));
      return { success: true };
    }),

  /** Delete a draft passport */
  delete: publicProcedure
    .input(z.object({ passportId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.delete(batteryPassports).where(eq(batteryPassports.passportId, input.passportId));
      return { success: true };
    }),
});

