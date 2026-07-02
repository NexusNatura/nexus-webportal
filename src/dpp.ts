/**
 * DPP Passport Router â€“ Nexus-OS
 * Handles creation, retrieval, Stripe payment, and publishing of Digital Product Passports
 */
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { dppPassports } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { getStripe } from "../_core/stripe";
import { ENV } from "../_core/env";
import { notifyOwner } from "../_core/notification";

function genDppId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DPP-${year}-${rand}`;
}

export const dppRouter = router({
  // â”€â”€ List user's own passports â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const passports = await db
      .select()
      .from(dppPassports)
      .where(eq(dppPassports.userId, ctx.user.id))
      .orderBy(desc(dppPassports.createdAt));
    return passports;
  }),

  // â”€â”€ Get a single passport by dppId (public for QR scanning) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  getByDppId: publicProcedure
    .input(z.object({ dppId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [passport] = await db
        .select()
        .from(dppPassports)
        .where(eq(dppPassports.dppId, input.dppId))
        .limit(1);
      return passport ?? null;
    }),

  // â”€â”€ Generate + save DPP (AI-powered, saves as draft) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  generate: protectedProcedure
    .input(
      z.object({
        productName: z.string().min(2),
        brand: z.string().min(1),
        category: z.string().min(1),
        materials: z.string().min(2),
        co2: z.string().optional(),
        recycled: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = Math.floor(Date.now() / 1000);
      const dppId = genDppId();

      // Build JSON-LD skeleton
      const jsonLd = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": `https://nexus-os.se/dpp/${dppId}`,
        name: input.productName,
        brand: { "@type": "Brand", name: input.brand },
        category: input.category,
        material: input.materials,
        additionalProperty: [
          { "@type": "PropertyValue", name: "CO2-fotavtryck", value: input.co2 ?? "Ej angiven" },
          { "@type": "PropertyValue", name: "Ã…tervunnet innehÃ¥ll", value: input.recycled ?? "Ej angiven" },
          { "@type": "PropertyValue", name: "DPP-ID", value: dppId },
          { "@type": "PropertyValue", name: "ESPR-kompatibel", value: "Ja" },
          { "@type": "PropertyValue", name: "UtfÃ¤rdat av", value: "Nexus-OS DPP-Omega" },
          { "@type": "PropertyValue", name: "UtfÃ¤rdandedatum", value: new Date().toISOString().split("T")[0] },
        ],
      }, null, 2);

      // AI analysis
      let aiAnalysis = "";
      try {
        const resp = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Du Ã¤r DPP-Omega, Nexus-OS:s AI-agent fÃ¶r Digitala Produktpass. 
Du analyserar produktdata och ger en strukturerad hÃ¥llbarhetsanalys pÃ¥ svenska.
Svara med markdown, max 400 ord. Inkludera: 
1. ESPR-bedÃ¶mning (vilka krav som uppfylls/saknas)
2. CirkulÃ¤ritetspotential (reparerbarhet, Ã¥tervinningsbarhet)
3. Tre konkreta fÃ¶rbÃ¤ttringsrekommendationer
4. Uppskattad LCA-fas med stÃ¶rst pÃ¥verkan`,
            },
            {
              role: "user",
              content: `Analysera detta produktpass:
Produkt: ${input.productName}
VarumÃ¤rke: ${input.brand}
Kategori: ${input.category}
Material: ${input.materials}
CO2-fotavtryck: ${input.co2 ?? "Ej angiven"}
Ã…tervunnet innehÃ¥ll: ${input.recycled ?? "Ej angiven"}`,
            },
          ],
        });
        const raw = resp.choices?.[0]?.message?.content;
        aiAnalysis = typeof raw === "string" ? raw : "";
      } catch {
        aiAnalysis = "AI-analys ej tillgÃ¤nglig just nu.";
      }

      // Save to DB
      const db = await getDb();
      if (!db) throw new Error("Databas ej tillgÃ¤nglig");
      await db.insert(dppPassports).values({
        userId: ctx.user.id,
        dppId,
        productName: input.productName,
        brand: input.brand,
        category: input.category,
        materials: input.materials,
        co2Footprint: input.co2 ?? null,
        recycledContent: input.recycled ?? null,
        jsonLd,
        aiAnalysis,
        status: "draft",
        paid: false,
        createdAt: now,
        updatedAt: now,
      });

      return { dppId, jsonLd, aiAnalysis, co2: input.co2, recycled: input.recycled };
    }),

  // â”€â”€ Create Stripe Checkout to publish a DPP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  createCheckout: protectedProcedure
    .input(z.object({ dppId: z.string(), origin: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Databas ej tillgÃ¤nglig");
      const [passport] = await db
        .select()
        .from(dppPassports)
        .where(eq(dppPassports.dppId, input.dppId))
        .limit(1);

      if (!passport) throw new Error("Produktpass hittades inte");
      if (passport.userId !== ctx.user.id) throw new Error("Ã…tkomst nekad");
      if (passport.paid) return { alreadyPaid: true, checkoutUrl: null };

      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: ctx.user.email ?? undefined,
        allow_promotion_codes: true,
        line_items: [
          {
            price_data: {
              currency: "sek",
              unit_amount: 29900, // 299 SEK
              product_data: {
                name: `Digitalt Produktpass â€“ ${passport.productName}`,
                description: `EU-kompatibelt DPP (ESPR) fÃ¶r ${passport.brand} Â· ID: ${passport.dppId}`,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          user_id: ctx.user.id.toString(),
          dpp_id: input.dppId,
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
        },
        client_reference_id: ctx.user.id.toString(),
        success_url: `${input.origin}/produktpass?success=1&dpp=${input.dppId}`,
        cancel_url: `${input.origin}/produktpass?cancelled=1`,
      });

      return { alreadyPaid: false, checkoutUrl: session.url };
    }),

  // â”€â”€ Mark DPP as paid (called by webhook) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  markPaid: protectedProcedure
    .input(z.object({ dppId: z.string(), stripePaymentIntentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Databas ej tillgÃ¤nglig");
      const now = Math.floor(Date.now() / 1000);
      await db
        .update(dppPassports)
        .set({ paid: true, status: "active", stripePaymentIntentId: input.stripePaymentIntentId, updatedAt: now })
        .where(eq(dppPassports.dppId, input.dppId));
      return { success: true };
    }),

  // â”€â”€ Delete a draft passport â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  delete: protectedProcedure
    .input(z.object({ dppId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Databas ej tillgÃ¤nglig");
      const [passport] = await db
        .select()
        .from(dppPassports)
        .where(eq(dppPassports.dppId, input.dppId))
        .limit(1);
      if (!passport) throw new Error("Hittades inte");
      if (passport.userId !== ctx.user.id) throw new Error("Ã…tkomst nekad");
      if (passport.paid) throw new Error("Betalda pass kan inte raderas");
      await db.delete(dppPassports).where(eq(dppPassports.dppId, input.dppId));
      return { success: true };
    }),
});

