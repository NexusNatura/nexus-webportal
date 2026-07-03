/**
 * Tests for blog tRPC router
 * Tests the list and getBySlug procedures using a mock database context.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module so tests don't need a live DB connection
vi.mock("../drizzle/schema", () => ({
  blogPosts: {
    id: "id",
    slug: "slug",
    title: "title",
    excerpt: "excerpt",
    author: "author",
    authorRole: "authorRole",
    coAuthor: "coAuthor",
    coAuthorRole: "coAuthorRole",
    category: "category",
    tags: "tags",
    readingTime: "readingTime",
    featured: "featured",
    publishedAt: "publishedAt",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
}));

// Mock getDb to return a fake DB
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getDb: vi.fn().mockResolvedValue(null), // null triggers early-return path
  };
});

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("blog.list", () => {
  it("returns an empty array when database is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it("accepts optional limit parameter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.list({ limit: 5 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts optional category filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.list({ category: "EU-reglering" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("blog.getBySlug", () => {
  it("returns null when database is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.getBySlug({ slug: "test-slug" });
    expect(result).toBeNull();
  });

  it("returns null for a non-existent slug (DB unavailable)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // Schema uses z.string() without .min(1); empty slug is valid input but DB returns null
    const result = await caller.blog.getBySlug({ slug: "" });
    expect(result).toBeNull();
  });

  it("rejects when slug field is missing entirely", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      (caller.blog.getBySlug as (input: Record<string, unknown>) => Promise<unknown>)({})
    ).rejects.toThrow();
  });
});

describe("blog.seed", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // seed is a protectedProcedure – unauthenticated calls must throw
    await expect(caller.blog.seed()).rejects.toThrow();
  });

  it("requires admin role", async () => {
    const ctx: TrpcContext = {
      ...createPublicContext(),
      user: {
        id: 1,
        openId: "user-1",
        email: "user@example.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.blog.seed()).rejects.toThrow("Admin only");
  });
});

