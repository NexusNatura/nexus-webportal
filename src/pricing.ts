/**
 * pricing.ts – tRPC router för Nexus-OS prenumerationsplaner
 * Hanterar SMF-plan (995 SEK/mån) via Stripe Checkout
 */
import { TRPCError } from "@trpc/server";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userSubscriptions } from "../../drizzle/schema";
import { getStripe } from "../_core/stripe";
import { notifyOwner } from "../_core/notification";

/** SMF-plan: 995 SEK/mån = 99500 öre */
const SMF_PRICE_ORE = 99500;
/** Enterprise: 1499 SEK/mån = 149900 öre */
const ENTERPRISE_PRICE_ORE = 149900;

export const pricingRouter = router({
  /** Get the current user's active subscription */
  getMySubscription: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

    const [sub] = await db
      .select()
      .from(userSubscriptions)
      .where(
        and(
          eq(userSubscriptions.userId, ctx.user.id),
          eq(userSubscriptions.status, "active")
        )
      )
      .orderBy(desc(userSubscriptions.createdAt))
      .limit(1);

    return sub ?? null;
  }),

  /** Create a Stripe Checkout session for the SMF plan */
  createSubscriptionCheckout: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["smf", "enterprise"]),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      // Check if user already has an active subscription
      const [existing] = await db
        .select()
        .from(userSubscriptions)
        .where(
          and(
            eq(userSubscriptions.userId, ctx.user.id),
            eq(userSubscriptions.status, "active")
          )
        )
        .limit(1);

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Du har redan en aktiv ${existing.plan.toUpperCase()}-prenumeration.`,
        });
      }

      const amountOre = input.plan === "smf" ? SMF_PRICE_ORE : ENTERPRISE_PRICE_ORE;
      const planLabel = input.plan === "smf" ? "SMF-plan" : "Enterprise-plan";
      const planDesc =
        input.plan === "smf"
          ? "Obegränsad bidragsmatchning, 10 DPP/mån, LCA-analys, EU AI Act-rapporter"
          : "Obegränsade DPP, API-åtkomst, Datamarknadsplats, Dedikerad onboarding";

      // Create a pending subscription record
      const [inserted] = await db
        .insert(userSubscriptions)
        .values({
          userId: ctx.user.id,
          plan: input.plan,
          status: "pending",
        })
        .$returningId();

      const subscriptionId = inserted.id;
      const stripe = getStripe();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // one-time payment simulating monthly (no Stripe subscription needed for MVP)
        customer_email: ctx.user.email ?? undefined,
        line_items: [
          {
            price_data: {
              currency: "sek",
              unit_amount: amountOre,
              product_data: {
                name: `Nexus-OS ${planLabel}`,
                description: planDesc,
              },
            },
            quantity: 1,
          },
        ],
        client_reference_id: ctx.user.id.toString(),
        success_url: `${input.origin}/prissattning?subscription_success=1&plan=${input.plan}`,
        cancel_url: `${input.origin}/prissattning?subscription_cancelled=1`,
        metadata: {
          subscription_id: subscriptionId.toString(),
          user_id: ctx.user.id.toString(),
          plan: input.plan,
          type: "subscription",
        },
      });

      // Store session ID
      await db
        .update(userSubscriptions)
        .set({ stripeSessionId: session.id })
        .where(eq(userSubscriptions.id, subscriptionId));

      return { checkoutUrl: session.url };
    }),

  /** Mark subscription as active (called from webhook) */
  activateSubscription: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.number().int().positive(),
        stripePaymentIntentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Endast administratörer kan aktivera prenumerationer manuellt." });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      await db
        .update(userSubscriptions)
        .set({
          status: "active",
          startedAt: now,
          currentPeriodEnd: now + thirtyDays,
          stripePaymentIntentId: input.stripePaymentIntentId ?? null,
        })
        .where(eq(userSubscriptions.id, input.subscriptionId));

      return { ok: true };
    }),
});

