/**
 * Marketplace tRPC router
 * Handles DPP data listings, Stripe Checkout purchases, and seller/buyer views.
 */
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  marketplaceListings,
  marketplacePurchases,
  type InsertMarketplaceListing,
} from "../../drizzle/schema";
import { getStripe } from "../_core/stripe";
import { notifyOwner } from "../_core/notification";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Seed listings for demo/fallback when DB is empty */
const SEED_LISTINGS = [
  {
    sellerId: 1,
    title: "LCA-data â€“ Silverring 925 (Ã…tervunnet)",
    description:
      "FullstÃ¤ndig LCA-analys fÃ¶r silverring tillverkad av 94% Ã¥tervunnet silver. Inkluderar Scope 1â€“3, materialsammansÃ¤ttning och certifieringsdokumentation.",
    category: "Smycken & Accessoarer",
    priceOre: 45000,
    sellerSharePct: 70,
    dataPoints: 47,
    co2Value: "0.8 kg COâ‚‚e/enhet",
    recycledContent: "94%",
    certifications: ["ESPR 2026", "ISO 14040", "Fairtrade Silver"],
    status: "active" as const,
    dppId: "DPP-2024-SE-0142",
  },
  {
    sellerId: 1,
    title: "LCA-data â€“ StÃ¥lbalk (Ã…tervunnet konstruktionsstÃ¥l)",
    description:
      "Industriell LCA-data fÃ¶r konstruktionsstÃ¥l med 78% Ã¥tervunnet innehÃ¥ll. Inkluderar EPD-rapport, karbonfotavtryck per ton och materialflÃ¶desanalys.",
    category: "Metall & StÃ¥l",
    priceOre: 120000,
    sellerSharePct: 70,
    dataPoints: 112,
    co2Value: "1.2 ton COâ‚‚e/ton",
    recycledContent: "78%",
    certifications: ["ESPR 2026", "EPD", "ISO 14001"],
    status: "active" as const,
    dppId: "DPP-2025-SE-0089",
  },
  {
    sellerId: 1,
    title: "LCA-data â€“ Ekologisk bomullsjacka",
    description:
      "Textil LCA-data fÃ¶r GOTS-certifierad bomullsjacka. Inkluderar vattenavtryck, kemikalieanvÃ¤ndning och end-of-life-rekommendationer.",
    category: "Textil & Mode",
    priceOre: 75000,
    sellerSharePct: 70,
    dataPoints: 63,
    co2Value: "3.4 kg COâ‚‚e/enhet",
    recycledContent: "60%",
    certifications: ["ESPR 2026", "GOTS", "Oeko-Tex"],
    status: "active" as const,
    dppId: "DPP-2025-SE-0203",
  },
  {
    sellerId: 1,
    title: "LCA-data â€“ BioPUR gummiprodukter",
    description:
      "HÃ¥llbarhetsdata fÃ¶r biopolymerbaserade gummiprodukter. Inkluderar jÃ¤mfÃ¶relse mot konventionellt PUR, COâ‚‚-besparingsberÃ¤kning och ESPR-checklista.",
    category: "Polymerer & Gummi",
    priceOre: 89000,
    sellerSharePct: 70,
    dataPoints: 78,
    co2Value: "2.1 kg COâ‚‚e/kg",
    recycledContent: "45%",
    certifications: ["ESPR 2026", "ISO 14044", "Biobased Certified"],
    status: "active" as const,
    dppId: "DPP-2025-SE-0311",
  },
  {
    sellerId: 1,
    title: "LCA-data â€“ LimtrÃ¤ konstruktionsbalkar",
    description:
      "Skogsbruksdata och LCA fÃ¶r EUDR-spÃ¥rbara limtrÃ¤balkar. Inkluderar FSC-certifiering, koldioxidlagring och end-of-life-data.",
    category: "TrÃ¤ & Skogsbruk",
    priceOre: 65000,
    sellerSharePct: 80,
    dataPoints: 55,
    co2Value: "-45 kg COâ‚‚e/mÂ³ (nettoupptag)",
    recycledContent: "0%",
    certifications: ["EUDR 2025", "FSC", "EPD"],
    status: "active" as const,
    dppId: "DPP-2025-SE-0178",
  },
];

// â”€â”€â”€ Router â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const marketplaceRouter = router({
  /**
   * List active marketplace listings (public)
   */
  list: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          limit: z.number().min(1).max(50).optional().default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      try {
        const rows = await db
          .select()
          .from(marketplaceListings)
          .where(eq(marketplaceListings.status, "active"))
          .orderBy(desc(marketplaceListings.createdAt))
          .limit(input?.limit ?? 20);

        if (input?.category) {
          return rows.filter((r) => r.category === input.category);
        }
        return rows;
      } catch {
        return [];
      }
    }),

  /**
   * Get a single listing by ID (public)
   */
  getListing: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      try {
        const rows = await db
          .select()
          .from(marketplaceListings)
          .where(eq(marketplaceListings.id, input.id))
          .limit(1);
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }),

  /**
   * Create a new listing (authenticated sellers)
   */
  createListing: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(255),
        description: z.string().min(10),
        category: z.string().min(2).max(64),
        priceSek: z.number().min(1).max(100000),
        dataPoints: z.number().min(0).optional().default(0),
        co2Value: z.string().optional(),
        recycledContent: z.string().optional(),
        certifications: z.array(z.string()).optional(),
        dppId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const listing: InsertMarketplaceListing = {
        sellerId: ctx.user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        priceOre: Math.round(input.priceSek * 100),
        sellerSharePct: 70,
        dataPoints: input.dataPoints ?? 0,
        co2Value: input.co2Value,
        recycledContent: input.recycledContent,
        certifications: input.certifications ?? [],
        status: "active",
        dppId: input.dppId,
      };

      const [result] = await db.insert(marketplaceListings).values(listing);
      const insertId = (result as { insertId?: number }).insertId ?? 0;

      // Notify owner of new listing
      await notifyOwner({
        title: "Ny DPP-listning i Marketplace",
        content: `${ctx.user.name ?? ctx.user.email} har listat "${input.title}" fÃ¶r ${input.priceSek} SEK.`,
      }).catch(() => {});

      return { id: insertId, success: true };
    }),

  /**
   * Create a Stripe Checkout Session to purchase a listing
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        listingId: z.number(),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Fetch listing
      const rows = await db
        .select()
        .from(marketplaceListings)
        .where(eq(marketplaceListings.id, input.listingId))
        .limit(1);
      const listing = rows[0];
      if (!listing) throw new TRPCError({ code: "NOT_FOUND", message: "Listning hittades inte" });
      if (listing.status !== "active") throw new TRPCError({ code: "BAD_REQUEST", message: "Listningen Ã¤r inte aktiv" });

      // Create pending purchase record
      const [purchaseResult] = await db.insert(marketplacePurchases).values({
        listingId: input.listingId,
        buyerId: ctx.user.id,
        amountOre: listing.priceOre,
        status: "pending",
      });
      const purchaseId = (purchaseResult as { insertId?: number }).insertId ?? 0;

      // Create Stripe Checkout Session
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "sek",
              unit_amount: listing.priceOre,
              product_data: {
                name: listing.title,
                description: listing.description.slice(0, 500),
                metadata: {
                  dppId: listing.dppId ?? "",
                  category: listing.category,
                },
              },
            },
          },
        ],
        customer_email: ctx.user.email ?? undefined,
        allow_promotion_codes: true,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
          listing_id: input.listingId.toString(),
          purchase_id: purchaseId.toString(),
        },
        success_url: `${input.origin}/marketplace?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/marketplace?purchase=cancelled`,
      });

      // Store session ID on the purchase record
      if (purchaseId) {
        await db
          .update(marketplacePurchases)
          .set({ stripeSessionId: session.id })
          .where(eq(marketplacePurchases.id, purchaseId));
      }

      return { checkoutUrl: session.url, sessionId: session.id };
    }),

  /**
   * Get purchases made by the current user
   */
  getMyPurchases: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    try {
      const rows = await db
        .select({
          purchase: marketplacePurchases,
          listing: marketplaceListings,
        })
        .from(marketplacePurchases)
        .innerJoin(marketplaceListings, eq(marketplacePurchases.listingId, marketplaceListings.id))
        .where(eq(marketplacePurchases.buyerId, ctx.user.id))
        .orderBy(desc(marketplacePurchases.createdAt));
      return rows;
    } catch {
      return [];
    }
  }),

  /**
   * Get listings created by the current user (seller view)
   */
  getMyListings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    try {
      const rows = await db
        .select()
        .from(marketplaceListings)
        .where(eq(marketplaceListings.sellerId, ctx.user.id))
        .orderBy(desc(marketplaceListings.createdAt));
      return rows;
    } catch {
      return [];
    }
  }),

  /**
   * Seed demo listings (admin only)
   */
  seed: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Check if already seeded
    const existing = await db.select().from(marketplaceListings).limit(1);
    if (existing.length > 0) return { seeded: 0, message: "Already seeded" };

    await db.insert(marketplaceListings).values(SEED_LISTINGS);
    return { seeded: SEED_LISTINGS.length, message: `Seeded ${SEED_LISTINGS.length} listings` };
  }),

  /**
   * Contact / request form submission (notifies owner)
   */
  submitRequest: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        org: z.string().optional(),
        purpose: z.string().optional(),
        listingTitle: z.string().optional(),
        planName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const subject = input.listingTitle
        ? `Datapaket-fÃ¶rfrÃ¥gan: ${input.listingTitle}`
        : `Prisplan-fÃ¶rfrÃ¥gan: ${input.planName ?? "OkÃ¤nd plan"}`;

      await notifyOwner({
        title: subject,
        content: `Namn: ${input.name}\nE-post: ${input.email}\nOrg: ${input.org ?? "â€“"}\nSyfte: ${input.purpose ?? "â€“"}`,
      }).catch(() => {});

      return { success: true };
    }),
});

