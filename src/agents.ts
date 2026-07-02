/**
 * Nexus-OS Agent Marketplace Router
 * Handles listing, purchasing, building and publishing AI agents via Stripe Checkout.
 */
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { getDb } from "../db";
import { agents, agentPurchases, agentDrafts } from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getStripe } from "../_core/stripe";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "../_core/notification";
import { invokeLLM } from "../_core/llm";

// â”€â”€â”€ Shared Zod schemas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const agentDraftDataSchema = z.object({
  // Step 1 â€“ Basic info
  name: z.string().max(128).optional(),
  slug: z.string().max(64).optional(),
  tagline: z.string().max(256).optional(),
  category: z.enum(["grants", "compliance", "dpp", "symbiosis", "design", "circular"]).optional(),
  iconName: z.string().max(64).optional(),
  accentColor: z.string().max(64).optional(),
  // Step 2 â€“ Capabilities
  description: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
  useCases: z.array(z.string()).optional(),
  systemPrompt: z.string().optional(),
  trainingNotes: z.string().optional(),
  // Step 3 â€“ EU AI Act
  riskClass: z.enum(["minimal", "limited", "high"]).optional(),
  securityLevel: z.enum(["open", "standard", "high_a", "high_b"]).optional(),
  // Step 4 â€“ Pricing
  pricingModel: z.enum(["per_task", "monthly", "both"]).optional(),
  pricePerTaskOre: z.number().int().positive().optional(),
  priceMonthlyOre: z.number().int().positive().optional(),
  benchmarkScore: z.number().int().min(0).max(100).optional(),
  avgResponseTimeSec: z.number().int().positive().optional(),
});

export type AgentDraftData = z.infer<typeof agentDraftDataSchema>;

export const agentsRouter = router({
  // â”€â”€â”€ Public: Listing & Discovery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /** List all approved agents, optionally filtered by category */
  list: publicProcedure
    .input(
      z
        .object({
          category: z
            .enum(["grants", "compliance", "dpp", "symbiosis", "design", "circular"])
            .optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select()
        .from(agents)
        .where(eq(agents.reviewStatus, "approved"))
        .orderBy(desc(agents.purchaseCount));
      if (input?.category) {
        return rows.filter((a) => a.category === input.category);
      }
      return rows;
    }),

  /** Get a single agent by slug */
  getListing: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [agent] = await db
        .select()
        .from(agents)
        .where(and(eq(agents.slug, input.slug), eq(agents.reviewStatus, "approved")))
        .limit(1);
      return agent ?? null;
    }),

  // â”€â”€â”€ Protected: Purchasing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /** Create a Stripe Checkout session for purchasing an agent */
  createCheckout: protectedProcedure
    .input(
      z.object({
        agentId: z.number().int().positive(),
        purchaseType: z.enum(["per_task", "monthly"]),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [agent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .limit(1);

      if (!agent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agenten hittades inte." });
      }

      if (agent.status === "coming_soon") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Denna agent Ã¤r inte tillgÃ¤nglig fÃ¶r kÃ¶p Ã¤nnu.",
        });
      }

      const amountOre =
        input.purchaseType === "monthly"
          ? agent.priceMonthlyOre
          : agent.pricePerTaskOre;

      if (!amountOre) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Denna agent stÃ¶djer inte prismodellen "${input.purchaseType}".`,
        });
      }

      const [inserted] = await db
        .insert(agentPurchases)
        .values({
          agentId: agent.id,
          buyerId: ctx.user.id,
          purchaseType: input.purchaseType,
          amountOre,
          status: "pending",
        })
        .$returningId();

      const purchaseId = inserted.id;
      const stripe = getStripe();
      const priceLabel =
        input.purchaseType === "monthly"
          ? `${agent.name} â€“ MÃ¥nadsabonnemang`
          : `${agent.name} â€“ Per uppgift`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: ctx.user.email ?? undefined,
        line_items: [
          {
            price_data: {
              currency: "sek",
              unit_amount: amountOre,
              product_data: {
                name: priceLabel,
                description: agent.tagline,
              },
            },
            quantity: 1,
          },
        ],
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
          agent_id: agent.id.toString(),
          agent_slug: agent.slug,
          purchase_id: purchaseId.toString(),
          purchase_type: input.purchaseType,
        },
        allow_promotion_codes: true,
        success_url: `${input.origin}/agenter?success=1&agent=${agent.slug}`,
        cancel_url: `${input.origin}/agenter?cancelled=1`,
      });

      await db
        .update(agentPurchases)
        .set({ stripeSessionId: session.id })
        .where(eq(agentPurchases.id, purchaseId));

      return { checkoutUrl: session.url, sessionId: session.id };
    }),

  /** Get all paid purchases for the current user */
  getMyPurchases: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const purchases = await db
      .select({
        purchase: agentPurchases,
        agent: agents,
      })
      .from(agentPurchases)
      .innerJoin(agents, eq(agentPurchases.agentId, agents.id))
      .where(
        and(
          eq(agentPurchases.buyerId, ctx.user.id),
          eq(agentPurchases.status, "paid")
        )
      )
      .orderBy(desc(agentPurchases.createdAt));

    return purchases;
  }),

  /** Submit an interest notification for a coming-soon agent */
  requestNotify: protectedProcedure
    .input(
      z.object({
        agentId: z.number().int().positive(),
        message: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [agent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .limit(1);

      if (!agent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agenten hittades inte." });
      }

      await notifyOwner({
        title: `IntresseanmÃ¤lan: ${agent.name}`,
        content: `AnvÃ¤ndare ${ctx.user.name ?? ctx.user.email ?? ctx.user.id} Ã¤r intresserad av agenten "${agent.name}" (${agent.slug}).\n\nMeddelande: ${input.message ?? "(inget meddelande)"}`,
      });

      return { ok: true };
    }),

  // â”€â”€â”€ Protected: AgentBuilder (Draft â†’ Review â†’ Publish) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /** Create a new agent draft (starts wizard) */
  createDraft: protectedProcedure
    .input(agentDraftDataSchema.optional())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [inserted] = await db
        .insert(agentDrafts)
        .values({
          userId: ctx.user.id,
          step: 1,
          data: (input ?? {}) as Record<string, unknown>,
        })
        .$returningId();

      return { draftId: inserted.id };
    }),

  /** Update draft data and advance step */
  updateDraft: protectedProcedure
    .input(
      z.object({
        draftId: z.number().int().positive(),
        step: z.number().int().min(1).max(5),
        data: agentDraftDataSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [draft] = await db
        .select()
        .from(agentDrafts)
        .where(and(eq(agentDrafts.id, input.draftId), eq(agentDrafts.userId, ctx.user.id)))
        .limit(1);

      if (!draft) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Utkastet hittades inte." });
      }

      const merged = { ...(draft.data as Record<string, unknown>), ...input.data };

      await db
        .update(agentDrafts)
        .set({ step: input.step, data: merged })
        .where(eq(agentDrafts.id, input.draftId));

      return { ok: true, data: merged };
    }),

  /** Get a draft by ID (must belong to current user) */
  getDraft: protectedProcedure
    .input(z.object({ draftId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const [draft] = await db
        .select()
        .from(agentDrafts)
        .where(and(eq(agentDrafts.id, input.draftId), eq(agentDrafts.userId, ctx.user.id)))
        .limit(1);

      return draft ?? null;
    }),

  /** Get all drafts for current user */
  getMyDrafts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(agentDrafts)
      .where(eq(agentDrafts.userId, ctx.user.id))
      .orderBy(desc(agentDrafts.updatedAt));
  }),

  /** Use AI to suggest EU AI Act risk classification based on draft data */
  classifyRisk: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        capabilities: z.array(z.string()),
        category: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const prompt = `Du Ã¤r en EU AI Act-expert. Klassificera fÃ¶ljande AI-agent enligt EU AI Act (2024/1689) riskklassificering.

Agent: ${input.name}
Kategori: ${input.category}
Beskrivning: ${input.description}
Kapabiliteter: ${input.capabilities.join(", ")}

Svara ENBART med ett JSON-objekt i detta format:
{
  "riskClass": "minimal" | "limited" | "high",
  "securityLevel": "open" | "standard" | "high_a" | "high_b",
  "justification": "kort motivering pÃ¥ svenska (max 2 meningar)",
  "relevantArticles": ["Artikel X", "Artikel Y"],
  "recommendations": ["rekommendation 1", "rekommendation 2"]
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Du Ã¤r en EU AI Act-expert. Svara alltid med valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "risk_classification",
            strict: true,
            schema: {
              type: "object",
              properties: {
                riskClass: { type: "string", enum: ["minimal", "limited", "high"] },
                securityLevel: { type: "string", enum: ["open", "standard", "high_a", "high_b"] },
                justification: { type: "string" },
                relevantArticles: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
              },
              required: ["riskClass", "securityLevel", "justification", "relevantArticles", "recommendations"],
              additionalProperties: false,
            },
          },
        },
      });

      const rawContent = response.choices[0]?.message?.content;
      const content = typeof rawContent === "string" ? rawContent : null;
      if (!content) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI-klassificering misslyckades." });
      try {
        type ClassifyResult = {
          riskClass: "minimal" | "limited" | "high";
          securityLevel: "open" | "standard" | "high_a" | "high_b";
          justification: string;
          relevantArticles: string[];
          recommendations: string[];
        };
        const parsed: ClassifyResult = JSON.parse(content);
        return parsed;
      } catch (_parseErr) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Kunde inte tolka AI-svaret." });
      }
    }),

  /** Submit draft for review and publish as pending_review agent */
  submitForReview: protectedProcedure
    .input(z.object({ draftId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [draft] = await db
        .select()
        .from(agentDrafts)
        .where(and(eq(agentDrafts.id, input.draftId), eq(agentDrafts.userId, ctx.user.id)))
        .limit(1);

      if (!draft) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Utkastet hittades inte." });
      }

      const d = draft.data as AgentDraftData;

      // Validate required fields
      if (!d.name || !d.slug || !d.tagline || !d.category || !d.description) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fyll i alla obligatoriska fÃ¤lt (namn, slug, tagline, kategori, beskrivning) innan du skickar in.",
        });
      }

      if (!d.pricingModel) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "VÃ¤lj en prismodell." });
      }

      // Check slug uniqueness
      const [existing] = await db
        .select({ id: agents.id })
        .from(agents)
        .where(eq(agents.slug, d.slug))
        .limit(1);

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: `Slug "${d.slug}" Ã¤r redan tagen. VÃ¤lj ett annat.` });
      }

      // Insert as pending_review agent
      const [inserted] = await db
        .insert(agents)
        .values({
          slug: d.slug,
          name: d.name,
          tagline: d.tagline,
          description: d.description,
          category: d.category,
          pricingModel: d.pricingModel,
          pricePerTaskOre: d.pricePerTaskOre ?? null,
          priceMonthlyOre: d.priceMonthlyOre ?? null,
          riskClass: d.riskClass ?? "limited",
          securityLevel: d.securityLevel ?? "standard",
          capabilities: d.capabilities ?? [],
          useCases: d.useCases ?? [],
          benchmarkScore: d.benchmarkScore ?? null,
          avgResponseTimeSec: d.avgResponseTimeSec ?? null,
          status: "coming_soon",
          isOfficial: false,
          iconName: d.iconName ?? "Bot",
          accentColor: d.accentColor ?? "text-blue-400",
          creatorId: ctx.user.id,
          systemPrompt: d.systemPrompt ?? null,
          trainingNotes: d.trainingNotes ?? null,
          reviewStatus: "pending_review",
        })
        .$returningId();

      // Notify owner
      await notifyOwner({
        title: `Ny agent fÃ¶r granskning: ${d.name}`,
        content: `AnvÃ¤ndare ${ctx.user.name ?? ctx.user.email ?? ctx.user.id} har skickat in agenten "${d.name}" (${d.slug}) fÃ¶r granskning.\n\nKategori: ${d.category}\nRiskklass: ${d.riskClass ?? "limited"}\nPrismodell: ${d.pricingModel}`,
      });

      // Delete the draft
      await db.delete(agentDrafts).where(eq(agentDrafts.id, input.draftId));

      return { ok: true, agentId: inserted.id, slug: d.slug };
    }),

  /** Admin: approve and publish an agent */
  publishAgent: protectedProcedure
    .input(z.object({ agentId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Endast administratÃ¶rer kan publicera agenter." });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      await db
        .update(agents)
        .set({ reviewStatus: "approved", status: "active" })
        .where(eq(agents.id, input.agentId));

      return { ok: true };
    }),

  /** Admin: list agents pending review */
  listPending: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Endast administratÃ¶rer kan se granskningskÃ¶n." });
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });
    return db
      .select()
      .from(agents)
      .where(eq(agents.reviewStatus, "pending_review"))
      .orderBy(agents.createdAt);
  }),

  /** Admin: reject an agent */
  rejectAgent: protectedProcedure
    .input(z.object({ agentId: z.number().int().positive(), reason: z.string().max(500).optional() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Endast administratÃ¶rer kan avvisa agenter." });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });
      await db
        .update(agents)
        .set({ reviewStatus: "rejected", status: "coming_soon" })
        .where(eq(agents.id, input.agentId));
      return { ok: true };
    }),
});

