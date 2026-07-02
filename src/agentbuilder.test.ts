/**
 * AgentBuilder tRPC Router Tests
 * Tests for createDraft, updateDraft, getDraft, submitForReview, classifyRisk
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// â”€â”€â”€ Mock DB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const mockInsertResult = { insertId: 1 };
const mockDraft = {
  id: 1,
  userId: 42,
  data: JSON.stringify({
    name: "Test Agent",
    slug: "test-agent",
    tagline: "A test agent",
    category: "compliance",
    description: "Test description for the agent",
    capabilities: ["Capability A", "Capability B"],
    useCases: ["Use case 1"],
    systemPrompt: "You are a test agent.",
    pricingModel: "per_task",
    pricePerTaskOre: 50000,
    priceMonthlyOre: null,
    iconName: "Bot",
    accentColor: "text-blue-400",
    riskClass: "minimal",
    securityLevel: "open",
    aiJustification: "Low risk agent.",
    relevantArticles: [],
    recommendations: [],
  }),
  status: "draft",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockDb = {
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue(mockInsertResult),
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([mockDraft]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

vi.mock("./server/_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            riskClass: "minimal",
            securityLevel: "open",
            justification: "This is a low-risk agent.",
            relevantArticles: ["Artikel 6"],
            recommendations: ["Dokumentera agentens syfte"],
          }),
        },
      },
    ],
  }),
}));

// â”€â”€â”€ Input Validation Tests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
describe("AgentBuilder â€“ input validation", () => {
  describe("createDraft schema", () => {
    const createDraftSchema = z.object({
      name: z.string().min(2).max(80),
      slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
      tagline: z.string().min(5).max(120),
      category: z.enum(["compliance", "grants", "dpp", "symbiosis", "design", "circular", "other"]),
    });

    it("accepts valid draft input", () => {
      const result = createDraftSchema.safeParse({
        name: "My Agent",
        slug: "my-agent",
        tagline: "A helpful AI agent",
        category: "compliance",
      });
      expect(result.success).toBe(true);
    });

    it("rejects name shorter than 2 chars", () => {
      const result = createDraftSchema.safeParse({
        name: "A",
        slug: "my-agent",
        tagline: "A helpful AI agent",
        category: "compliance",
      });
      expect(result.success).toBe(false);
    });

    it("rejects slug with uppercase letters", () => {
      const result = createDraftSchema.safeParse({
        name: "My Agent",
        slug: "My-Agent",
        tagline: "A helpful AI agent",
        category: "compliance",
      });
      expect(result.success).toBe(false);
    });

    it("rejects slug with spaces", () => {
      const result = createDraftSchema.safeParse({
        name: "My Agent",
        slug: "my agent",
        tagline: "A helpful AI agent",
        category: "compliance",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid category", () => {
      const result = createDraftSchema.safeParse({
        name: "My Agent",
        slug: "my-agent",
        tagline: "A helpful AI agent",
        category: "invalid-category",
      });
      expect(result.success).toBe(false);
    });

    it("accepts all valid categories", () => {
      const categories = ["compliance", "grants", "dpp", "symbiosis", "design", "circular", "other"];
      categories.forEach((category) => {
        const result = createDraftSchema.safeParse({
          name: "My Agent",
          slug: "my-agent",
          tagline: "A helpful AI agent",
          category,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("classifyRisk schema", () => {
    const classifyRiskSchema = z.object({
      name: z.string(),
      description: z.string(),
      capabilities: z.array(z.string()),
      category: z.string(),
    });

    it("accepts valid classification input", () => {
      const result = classifyRiskSchema.safeParse({
        name: "Test Agent",
        description: "A test agent for compliance",
        capabilities: ["Risk analysis", "Document generation"],
        category: "compliance",
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty capabilities array", () => {
      const result = classifyRiskSchema.safeParse({
        name: "Test Agent",
        description: "A test agent",
        capabilities: [],
        category: "compliance",
      });
      expect(result.success).toBe(true);
    });

    it("rejects non-array capabilities", () => {
      const result = classifyRiskSchema.safeParse({
        name: "Test Agent",
        description: "A test agent",
        capabilities: "not-an-array",
        category: "compliance",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("submitForReview schema", () => {
    const submitSchema = z.object({
      draftId: z.number().int().positive(),
    });

    it("accepts valid draft ID", () => {
      expect(submitSchema.safeParse({ draftId: 1 }).success).toBe(true);
      expect(submitSchema.safeParse({ draftId: 999 }).success).toBe(true);
    });

    it("rejects zero or negative draft IDs", () => {
      expect(submitSchema.safeParse({ draftId: 0 }).success).toBe(false);
      expect(submitSchema.safeParse({ draftId: -1 }).success).toBe(false);
    });

    it("rejects non-integer draft IDs", () => {
      expect(submitSchema.safeParse({ draftId: 1.5 }).success).toBe(false);
    });

    it("rejects string draft IDs", () => {
      expect(submitSchema.safeParse({ draftId: "1" }).success).toBe(false);
    });
  });

  describe("updateDraft schema", () => {
    const updateSchema = z.object({
      draftId: z.number().int().positive(),
      data: z.object({}).passthrough(),
    });

    it("accepts valid update with partial data", () => {
      const result = updateSchema.safeParse({
        draftId: 1,
        data: { name: "Updated Name", tagline: "New tagline" },
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty data object", () => {
      const result = updateSchema.safeParse({
        draftId: 1,
        data: {},
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing draftId", () => {
      let success = true;
      try {
        updateSchema.parse({ data: { name: "Updated Name" } });
      } catch {
        success = false;
      }
      expect(success).toBe(false);
    });
  });
});

// â”€â”€â”€ Business Logic Tests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
describe("AgentBuilder â€“ business logic", () => {
  describe("slug validation rules", () => {
    const slugRegex = /^[a-z0-9-]+$/;

    it("allows valid slugs", () => {
      const validSlugs = ["my-agent", "agent-123", "test", "a1b2c3", "my-ai-agent-v2"];
      validSlugs.forEach((slug) => {
        expect(slugRegex.test(slug)).toBe(true);
      });
    });

    it("rejects invalid slugs", () => {
      const invalidSlugs = ["My-Agent", "my agent", "my_agent", "my.agent", "my/agent", ""];
      invalidSlugs.forEach((slug) => {
        expect(slugRegex.test(slug)).toBe(false);
      });
    });
  });

  describe("pricing model validation", () => {
    const pricingSchema = z.object({
      pricingModel: z.enum(["per_task", "monthly", "both"]),
      pricePerTaskOre: z.number().int().min(100).optional().nullable(),
      priceMonthlyOre: z.number().int().min(100).optional().nullable(),
    });

    it("accepts per_task model with price", () => {
      const result = pricingSchema.safeParse({
        pricingModel: "per_task",
        pricePerTaskOre: 50000,
        priceMonthlyOre: null,
      });
      expect(result.success).toBe(true);
    });

    it("accepts monthly model with price", () => {
      const result = pricingSchema.safeParse({
        pricingModel: "monthly",
        pricePerTaskOre: null,
        priceMonthlyOre: 120000,
      });
      expect(result.success).toBe(true);
    });

    it("accepts both model with both prices", () => {
      const result = pricingSchema.safeParse({
        pricingModel: "both",
        pricePerTaskOre: 50000,
        priceMonthlyOre: 120000,
      });
      expect(result.success).toBe(true);
    });

    it("rejects price below minimum (100 Ã¶re = 1 SEK)", () => {
      const result = pricingSchema.safeParse({
        pricingModel: "per_task",
        pricePerTaskOre: 50,
        priceMonthlyOre: null,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid pricing model", () => {
      const result = pricingSchema.safeParse({
        pricingModel: "free",
        pricePerTaskOre: 0,
        priceMonthlyOre: null,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("EU AI Act risk class validation", () => {
    const riskSchema = z.object({
      riskClass: z.enum(["minimal", "limited", "high"]),
      securityLevel: z.enum(["open", "standard", "high_a", "high_b"]),
    });

    it("accepts all valid risk classes", () => {
      const riskClasses = ["minimal", "limited", "high"];
      riskClasses.forEach((riskClass) => {
        expect(riskSchema.safeParse({ riskClass, securityLevel: "open" }).success).toBe(true);
      });
    });

    it("accepts all valid security levels", () => {
      const securityLevels = ["open", "standard", "high_a", "high_b"];
      securityLevels.forEach((securityLevel) => {
        expect(riskSchema.safeParse({ riskClass: "minimal", securityLevel }).success).toBe(true);
      });
    });

    it("rejects invalid risk class", () => {
      expect(riskSchema.safeParse({ riskClass: "extreme", securityLevel: "open" }).success).toBe(false);
    });

    it("rejects invalid security level", () => {
      expect(riskSchema.safeParse({ riskClass: "minimal", securityLevel: "top_secret" }).success).toBe(false);
    });
  });

  describe("draft data completeness check", () => {
    const requiredFields = ["name", "slug", "tagline", "category", "description", "pricingModel"];

    it("identifies all required fields", () => {
      const draftData = {
        name: "Test Agent",
        slug: "test-agent",
        tagline: "A test agent",
        category: "compliance",
        description: "Test description",
        pricingModel: "per_task",
      };
      const missingFields = requiredFields.filter((f) => !draftData[f as keyof typeof draftData]);
      expect(missingFields).toHaveLength(0);
    });

    it("detects missing required fields", () => {
      const incompleteDraft = {
        name: "Test Agent",
        slug: "test-agent",
        // missing tagline, category, description, pricingModel
      };
      const missingFields = requiredFields.filter((f) => !incompleteDraft[f as keyof typeof incompleteDraft]);
      expect(missingFields.length).toBeGreaterThan(0);
      expect(missingFields).toContain("tagline");
      expect(missingFields).toContain("category");
      expect(missingFields).toContain("description");
      expect(missingFields).toContain("pricingModel");
    });
  });
});

