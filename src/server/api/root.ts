import { router, publicProcedure } from "./trpc";
import { db } from "../db";
import { agents, opportunities, marketplaceListings, blogPosts } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const agentsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(agents);
  }),
  install: publicProcedure.mutation(async () => {
    return { success: true };
  }),
  createCheckout: publicProcedure.mutation(async () => ({ checkoutUrl: '#' })),
  requestNotify: publicProcedure.mutation(async () => ({})),
  configure: publicProcedure.mutation(async () => ({ success: true })),
  getMyPurchases: publicProcedure.query(async () => [])
});

export const opportunitiesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(opportunities);
  }),
  calculatePWin: publicProcedure.query(async ({ input }) => {
    return { score: 85, factors: ['Relevant bransch (+10%)'] };
  })
});

export const marketplaceRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(marketplaceListings);
  }),
  createListing: publicProcedure.mutation(async () => ({})),
  getMyPurchases: publicProcedure.query(async () => []),
  getMyListings: publicProcedure.query(async () => []),
  createCheckout: publicProcedure.mutation(async () => ({ checkoutUrl: '#' })),
  submitRequest: publicProcedure.mutation(async () => ({}))
});

export const blogRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(blogPosts);
  }),
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.slug, input.slug));
    return results[0] || null;
  }),
  seed: publicProcedure.mutation(async () => {
    // Basic seed if empty
    const current = await db.select().from(blogPosts);
    if (current.length === 0) {
      await db.insert(blogPosts).values([
        {
          slug: "espr-2026-guide",
          title: "ESPR 2026: Så Förbereder du din Verksamhet för Ekodesignförordningen",
          excerpt: "En komplett genomgång av EU:s nya krav på digitala produktpass och cirkulär design som träder i kraft 2026.",
          content: "# ESPR 2026\n\nEU:s förordning om ekodesign för hållbara produkter (ESPR) är en av de mest omfattande lagstiftningarna för cirkulär ekonomi...\n\n## Vad krävs?\n1. Digitala Produktpass\n2. Cirkulär design\n3. Spårbarhet av material",
          author: "Nexus Policy Team",
          readTime: 8,
          publishedAt: new Date().toISOString(),
          category: "Hållbarhet & Reglering",
          imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
          featured: true,
        },
        {
          slug: "ai-act-compliance",
          title: "AI Act: Hur påverkas dina proptech-lösningar?",
          excerpt: "EU:s AI-förordning är här. Detta innebär den för företag som utvecklar eller använder AI i fastighetssektorn.",
          content: "# AI Act & Proptech\n\nDen nya lagstiftningen delar in AI-system i fyra riskkategorier. För fastighetsägare innebär detta...",
          author: "Legal AI Expert",
          readTime: 5,
          publishedAt: new Date().toISOString(),
          category: "AI & Reglering",
          imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop",
          featured: true,
        },
        {
          slug: "cirkular-upphandling",
          title: "Guide: Vinn offentliga upphandlingar med cirkulära affärsmodeller",
          excerpt: "Kraven på cirkularitet i offentlig upphandling ökar dramatiskt. Lär dig hur du strukturerar ditt anbud.",
          content: "# Offentlig upphandling\n\nAllt fler kommuner ställer krav på att möbler och elektronik ska vara rekonditionerade...",
          author: "Tender Specialist",
          readTime: 6,
          publishedAt: new Date().toISOString(),
          category: "Upphandling & Affärsutveckling",
          imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
          featured: false,
        }
      ]);
      return { seeded: 3 };
    }
    return { seeded: 0 };
  })
});

export const salesRouter = router({
  bookMeeting: publicProcedure
    .input(z.object({
      name: z.string(),
      company: z.string(),
      email: z.string(),
      selectedPlan: z.string(),
      meetingDate: z.string(),
      meetingTime: z.string()
    }))
    .mutation(async ({ input }) => {
      // Lazy load the schema just in case, but db is already connected
      const { salesLeads } = await import("../db/schema");
      
      await db.insert(salesLeads).values({
        name: input.name,
        company: input.company,
        email: input.email,
        selectedPlan: input.selectedPlan,
        meetingDate: input.meetingDate,
        meetingTime: input.meetingTime,
        status: "NEW",
        createdAt: new Date().toISOString()
      });

      return { success: true };
    })
});

export const aiRouter = router({
  getMemories: publicProcedure.query(async () => {
    const { agentMemory } = await import("../db/schema");
    return await db.select().from(agentMemory).where(eq(agentMemory.status, 'APPROVED')).orderBy(agentMemory.id);
  }),
  getPendingMemories: publicProcedure.query(async () => {
    const { agentMemory } = await import("../db/schema");
    return await db.select().from(agentMemory).where(eq(agentMemory.status, 'PENDING')).orderBy(agentMemory.id);
  }),
  approveMemory: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const { agentMemory } = await import("../db/schema");
    await db.update(agentMemory).set({ status: 'APPROVED' }).where(eq(agentMemory.id, input.id));
    return { success: true };
  }),
  rejectMemory: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const { agentMemory } = await import("../db/schema");
    await db.delete(agentMemory).where(eq(agentMemory.id, input.id));
    return { success: true };
  }),
  searchMemories: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
    // Dynamiskt importera vår nyskapade VectorService för frontend
    const { VectorService } = await import("../ai/VectorService");
    const service = new VectorService();
    return await service.searchMemory(input.query, 10);
  }),
  getJobs: publicProcedure.query(async () => {
    const { jobs } = await import("../db/schema");
    return await db.select().from(jobs).orderBy(jobs.id);
  }),
  enqueueJob: publicProcedure.mutation(async () => {
    const { JobWorker } = await import("../jobs/JobWorker");
    const worker = new JobWorker();
    const id = await worker.enqueueJob('DEEP_RESEARCH', {
        task: "Analysera solcellsmarknaden i EU via Webb-Sökning",
        priority: "HIGH"
    });
    // Starta background loop asynkront
    worker.processQueue().catch(console.error);
    return { success: true, jobId: id };
  })
});

export const appRouter = router({
  agents: agentsRouter,
  opportunities: opportunitiesRouter,
  marketplace: marketplaceRouter,
  blog: blogRouter,
  sales: salesRouter,
  ai: aiRouter,
  
  // Dummy routes for backwards compatibility until fully migrated
  courses: router({
    useQuery: publicProcedure.query(() => [])
  }),
  lessons: router({
    useQuery: publicProcedure.query(() => [])
  }),
});

export type AppRouter = typeof appRouter;
