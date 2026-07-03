/**
 * marketplace.test.ts
 * Vitest tests for the marketplace tRPC router.
 * Uses in-memory mocking – no real DB or Stripe calls.
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";

// â”€â”€ Mock DB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const mockListings = [
  {
    id: 1,
    sellerId: 99,
    title: "LCA-data – Silverring",
    description: "Fullständig LCA-analys",
    category: "Smycken",
    priceOre: 45000,
    sellerSharePct: 70,
    dataPoints: 47,
    co2Value: "0.8 kg COâ‚‚e",
    recycledContent: "94%",
    certifications: ["ESPR 2026"],
    dppId: "DPP-TEST-001",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    sellerId: 99,
    title: "LCA-data – Stålbalk",
    description: "Industriell LCA",
    category: "Metall",
    priceOre: 120000,
    sellerSharePct: 70,
    dataPoints: 112,
    co2Value: "1.2 ton COâ‚‚e",
    recycledContent: "78%",
    certifications: ["EPD", "ISO 14001"],
    dppId: "DPP-TEST-002",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockPurchases = [
  {
    id: 10,
    listingId: 1,
    buyerId: 42,
    amountOre: 45000,
    status: "paid",
    stripeSessionId: "cs_test_abc123",
    stripePaymentIntentId: "pi_test_xyz",
    paidAt: new Date(),
    createdAt: new Date(),
  },
];

// Drizzle-style chainable mock
function makeDbMock() {
  const db = {
    _insertValues: null as unknown,
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockImplementation(function (this: typeof db) {
      return Promise.resolve(mockListings.slice(0, 1));
    }),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockImplementation(function (this: typeof db, vals: unknown) {
      db._insertValues = vals;
      return Promise.resolve([{ insertId: 99 }]);
    }),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  };
  // Make select().from().where().orderBy() resolve to full listings
  db.orderBy.mockImplementation(() => Promise.resolve(mockListings));
  // Make select().from() resolve to full listings (for list procedure)
  db.from.mockImplementation(function (this: typeof db) {
    return db;
  });
  return db;
}

// â”€â”€ Context helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeUser(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    id: 42,
    openId: "test-open-id",
    email: "test@nexus-os.se",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function makeCtx(user: AuthenticatedUser | null = makeUser()): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// â”€â”€ Input validation tests (no DB needed) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("marketplace – input validation", () => {
  it("createListing rejects empty title", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.marketplace.createListing({
        title: "",
        description: "Valid description",
        category: "Metall",
        priceSek: 450,
        dataPoints: 10,
      })
    ).rejects.toThrow();
  });

  it("createListing rejects price below 1 SEK", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.marketplace.createListing({
        title: "Valid Title",
        description: "Valid description",
        category: "Metall",
        priceSek: 0,
        dataPoints: 10,
      })
    ).rejects.toThrow();
  });

  it("createCheckout rejects invalid origin URL", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.marketplace.createCheckout({
        listingId: 1,
        origin: "not-a-url",
      })
    ).rejects.toThrow();
  });

  it("submitRequest rejects invalid email", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.marketplace.submitRequest({
        name: "Test Person",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });

  it("submitRequest rejects name shorter than 2 chars", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.marketplace.submitRequest({
        name: "A",
        email: "valid@email.com",
      })
    ).rejects.toThrow();
  });
});

// â”€â”€ Auth guard tests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("marketplace – auth guards", () => {
  it("createListing requires authentication", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.marketplace.createListing({
        title: "Test",
        description: "Test description",
        category: "Metall",
        priceSek: 450,
        dataPoints: 10,
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("createCheckout requires authentication", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.marketplace.createCheckout({
        listingId: 1,
        origin: "https://example.com",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("getMyPurchases requires authentication", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.marketplace.getMyPurchases()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("getMyListings requires authentication", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.marketplace.getMyListings()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

// â”€â”€ submitRequest (public, uses notifyOwner) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("marketplace.submitRequest", () => {
  beforeEach(() => {
    // Silence notifyOwner in tests
    vi.mock("./_core/notification", () => ({
      notifyOwner: vi.fn().mockResolvedValue(true),
    }));
  });

  it("returns success for valid request", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.marketplace.submitRequest({
      name: "Anna Lindqvist",
      email: "anna@example.se",
      org: "Stena Recycling",
      purpose: "Scope 3-rapportering",
      planName: "Professional",
    });
    expect(result).toEqual({ success: true });
  });

  it("returns success for listing-specific request", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.marketplace.submitRequest({
      name: "Erik Svensson",
      email: "erik@volvo.com",
      listingTitle: "LCA-data – Stålbalk",
    });
    expect(result).toEqual({ success: true });
  });
});

