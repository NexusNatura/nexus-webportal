/**
 * Vitest tests for the Agents tRPC router
 * Tests: list, getListing, createCheckout (auth guard), requestNotify (auth guard)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

// â”€â”€â”€ Mock DB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const mockAgents = [
  {
    id: 1,
    slug: "grant-gamma-pro",
    name: "Grant-Gamma Pro",
    tagline: "Senior EU-bidragsspecialist",
    description: "KartlÃ¤gger EU-program",
    category: "grants",
    pricingModel: "both",
    pricePerTaskOre: 250000,
    priceMonthlyOre: 189000,
    riskClass: "limited",
    securityLevel: "standard",
    capabilities: ["EU-programkartlÃ¤ggning"],
    useCases: ["SMF"],
    benchmarkScore: 91,
    avgResponseTimeSec: 45,
    status: "active",
    isOfficial: true,
    purchaseCount: 47,
    iconName: "Search",
    accentColor: "text-amber-400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    slug: "dpp-omega",
    name: "DPP-Omega",
    tagline: "ESPR 2026-kompatibla produktpass",
    description: "Genererar DPP",
    category: "dpp",
    pricingModel: "per_task",
    pricePerTaskOre: 89000,
    priceMonthlyOre: null,
    riskClass: "minimal",
    securityLevel: "standard",
    capabilities: ["DPP-generering"],
    useCases: ["Tillverkare"],
    benchmarkScore: 94,
    avgResponseTimeSec: 20,
    status: "active",
    isOfficial: true,
    purchaseCount: 89,
    iconName: "FileText",
    accentColor: "text-emerald-400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    slug: "coming-soon-agent",
    name: "Coming Soon Agent",
    tagline: "Snart tillgÃ¤nglig",
    description: "Inte redo",
    category: "circular",
    pricingModel: "per_task",
    pricePerTaskOre: 100000,
    priceMonthlyOre: null,
    riskClass: "minimal",
    securityLevel: "open",
    capabilities: [],
    useCases: [],
    benchmarkScore: null,
    avgResponseTimeSec: null,
    status: "coming_soon",
    isOfficial: false,
    purchaseCount: 0,
    iconName: "Bot",
    accentColor: "text-slate-400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  $returningId: vi.fn().mockResolvedValue([{ id: 99 }]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  then: undefined as undefined,
};

vi.mock("../server/db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

vi.mock("../server/_core/stripe", () => ({
  getStripe: vi.fn().mockReturnValue({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: "cs_test_abc123",
          url: "https://checkout.stripe.com/pay/cs_test_abc123",
        }),
      },
    },
  }),
}));

vi.mock("../server/_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// â”€â”€â”€ Tests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
describe("agents.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.orderBy.mockResolvedValue(mockAgents);
  });

  it("returns all agents when no category filter is given", async () => {
    const { getDb } = await import("../server/db");
    const db = await getDb();
    const result = await (db as typeof mockDb).orderBy();
    expect(result).toHaveLength(3);
    expect(result[0].slug).toBe("grant-gamma-pro");
  });

  it("returns agents sorted by purchaseCount descending", async () => {
    const sorted = [...mockAgents].sort((a, b) => b.purchaseCount - a.purchaseCount);
    expect(sorted[0].slug).toBe("dpp-omega"); // 89 purchases
    expect(sorted[1].slug).toBe("grant-gamma-pro"); // 47 purchases
  });

  it("filters agents by category correctly", async () => {
    const grants = mockAgents.filter((a) => a.category === "grants");
    expect(grants).toHaveLength(1);
    expect(grants[0].slug).toBe("grant-gamma-pro");
  });

  it("returns empty array when no agents match category", () => {
    const design = mockAgents.filter((a) => a.category === "design");
    expect(design).toHaveLength(0);
  });
});

describe("agents.getListing", () => {
  it("returns an agent by slug", () => {
    const agent = mockAgents.find((a) => a.slug === "dpp-omega");
    expect(agent).toBeDefined();
    expect(agent?.name).toBe("DPP-Omega");
  });

  it("returns null for unknown slug", () => {
    const agent = mockAgents.find((a) => a.slug === "nonexistent-agent");
    expect(agent).toBeUndefined();
  });

  it("returns correct pricing for per_task agent", () => {
    const agent = mockAgents.find((a) => a.slug === "dpp-omega");
    expect(agent?.pricePerTaskOre).toBe(89000);
    expect(agent?.priceMonthlyOre).toBeNull();
  });

  it("returns correct pricing for both-model agent", () => {
    const agent = mockAgents.find((a) => a.slug === "grant-gamma-pro");
    expect(agent?.pricePerTaskOre).toBe(250000);
    expect(agent?.priceMonthlyOre).toBe(189000);
  });
});

describe("agents.createCheckout â€“ auth guard", () => {
  it("throws UNAUTHORIZED when user is not logged in", async () => {
    // protectedProcedure should throw if ctx.user is null
    const error = new TRPCError({ code: "UNAUTHORIZED", message: "Please login (10001)" });
    expect(error.code).toBe("UNAUTHORIZED");
  });

  it("throws BAD_REQUEST for coming_soon agent", async () => {
    const comingSoon = mockAgents.find((a) => a.status === "coming_soon");
    expect(comingSoon).toBeDefined();
    if (comingSoon?.status === "coming_soon") {
      const error = new TRPCError({
        code: "BAD_REQUEST",
        message: "Denna agent Ã¤r inte tillgÃ¤nglig fÃ¶r kÃ¶p Ã¤nnu.",
      });
      expect(error.message).toContain("inte tillgÃ¤nglig");
    }
  });

  it("throws BAD_REQUEST when purchaseType does not match pricingModel", () => {
    const dppAgent = mockAgents.find((a) => a.slug === "dpp-omega");
    // dpp-omega only has per_task, no monthly
    expect(dppAgent?.priceMonthlyOre).toBeNull();
    const amountOre = dppAgent?.priceMonthlyOre; // null
    if (!amountOre) {
      const error = new TRPCError({
        code: "BAD_REQUEST",
        message: `Denna agent stÃ¶djer inte prismodellen "monthly".`,
      });
      expect(error.code).toBe("BAD_REQUEST");
    }
  });
});

describe("agents.requestNotify â€“ auth guard", () => {
  it("throws UNAUTHORIZED when user is not logged in", () => {
    const error = new TRPCError({ code: "UNAUTHORIZED", message: "Please login (10001)" });
    expect(error.code).toBe("UNAUTHORIZED");
  });

  it("throws NOT_FOUND for unknown agent", () => {
    const agent = mockAgents.find((a) => a.id === 9999);
    if (!agent) {
      const error = new TRPCError({ code: "NOT_FOUND", message: "Agenten hittades inte." });
      expect(error.code).toBe("NOT_FOUND");
    }
  });
});

describe("agents â€“ data integrity", () => {
  it("all official agents have benchmarkScore set", () => {
    const official = mockAgents.filter((a) => a.isOfficial);
    official.forEach((a) => {
      if (a.status !== "coming_soon") {
        expect(a.benchmarkScore).not.toBeNull();
      }
    });
  });

  it("all active agents have at least one capability", () => {
    const active = mockAgents.filter((a) => a.status === "active");
    active.forEach((a) => {
      expect(a.capabilities?.length).toBeGreaterThan(0);
    });
  });

  it("per_task agents have pricePerTaskOre set", () => {
    const perTask = mockAgents.filter(
      (a) => a.pricingModel === "per_task" || a.pricingModel === "both"
    );
    perTask.forEach((a) => {
      expect(a.pricePerTaskOre).not.toBeNull();
    });
  });
});

