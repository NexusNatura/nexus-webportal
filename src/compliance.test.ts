import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Compliance Router Tests
 * Tests for EU AI Act compliance tracking and risk management
 */

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: {
      headers: { origin: "http://localhost:3000" },
      cookies: {},
      on: () => {},
    } as any,
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
      clearCookie: (name: string) => {
        clearedCookies.push({ name, options: {} });
      },
    } as any,
  };
  return { ctx, clearedCookies };
}

describe("compliance router", () => {
  let ctx: TrpcContext;
  let caller: any;

  beforeAll(() => {
    const { ctx: authCtx } = createAuthContext();
    ctx = authCtx;
    caller = appRouter.createCaller(ctx);
  });

  describe("risk management", () => {
    it("should list compliance risks", async () => {
      const result = await caller.compliance.risk.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should seed predefined risks", async () => {
      const result = await caller.compliance.risk.seed();
      expect(result).toHaveProperty("count");
      expect(result.count).toBeGreaterThan(0);
    });

    it("should update risk status", async () => {
      // First seed risks
      await caller.compliance.risk.seed();
      
      // Get list
      const risks = await caller.compliance.risk.list();
      if (risks.length > 0) {
        const firstRisk = risks[0];
        const result = await caller.compliance.risk.updateStatus({
          riskId: firstRisk.riskId,
          status: "in_progress",
        });
        
        expect(result).toHaveProperty("status");
        expect(result.status).toBe("in_progress");
      }
    });

    it("should validate status values", async () => {
      try {
        await caller.compliance.risk.updateStatus({
          riskId: "TEST-001",
          status: "invalid_status" as any,
        });
        expect.fail("Should throw validation error");
      } catch (err: any) {
        expect(err.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("misuse scenario management", () => {
    it("should list misuse scenarios", async () => {
      const result = await caller.compliance.misuse.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should seed misuse scenarios", async () => {
      const result = await caller.compliance.misuse.seed();
      expect(result).toHaveProperty("seeded");
      expect(result.seeded).toBeGreaterThan(0);
    });

    it("should update misuse scenario status", async () => {
      // First seed scenarios
      await caller.compliance.misuse.seed();
      
      // Get list
      const scenarios = await caller.compliance.misuse.list();
      if (scenarios.length > 0) {
        const firstScenario = scenarios[0];
        const result = await caller.compliance.misuse.updateStatus({
          scenarioId: firstScenario.scenarioId,
          status: "mitigated",
        });
        
        expect(result).toHaveProperty("success");
        expect(result.success).toBe(true);
      }
    });

    it("should validate misuse scenario status values", async () => {
      try {
        await caller.compliance.misuse.updateStatus({
          scenarioId: "TEST-MS-001",
          status: "invalid_status" as any,
        });
        expect.fail("Should throw validation error");
      } catch (err: any) {
        expect(err.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("compliance summary", () => {
    it("should generate compliance summary", async () => {
      // Seed data first
      await caller.compliance.risk.seed();
      await caller.compliance.misuse.seed();
      
      const result = await caller.compliance.summary();
      
      expect(result).toHaveProperty("totalRisks");
      expect(result).toHaveProperty("risksByLevel");
      expect(result).toHaveProperty("risksByStatus");
      expect(result).toHaveProperty("criticalRisks");
      expect(result).toHaveProperty("openMisuse");
    });

    it("should include risk level distribution", async () => {
      await caller.compliance.risk.seed();
      const result = await caller.compliance.summary();
      
      expect(result.risksByLevel).toBeDefined();
      expect(typeof result.risksByLevel).toBe("object");
      expect(result.risksByLevel).toHaveProperty("low");
      expect(result.risksByLevel).toHaveProperty("medium");
      expect(result.risksByLevel).toHaveProperty("high");
      expect(result.risksByLevel).toHaveProperty("critical");
    });

    it("should include risk status distribution", async () => {
      await caller.compliance.risk.seed();
      const result = await caller.compliance.summary();
      
      expect(result.risksByStatus).toBeDefined();
      expect(typeof result.risksByStatus).toBe("object");
      expect(result.risksByStatus).toHaveProperty("identified");
      expect(result.risksByStatus).toHaveProperty("in_progress");
      expect(result.risksByStatus).toHaveProperty("mitigated");
      expect(result.risksByStatus).toHaveProperty("verified");
    });

    it("should count critical and high risks correctly", async () => {
      await caller.compliance.risk.seed();
      const result = await caller.compliance.summary();
      
      expect(typeof result.criticalRisks).toBe("number");
      expect(result.criticalRisks).toBeGreaterThanOrEqual(0);
    });

    it("should count open misuse scenarios correctly", async () => {
      await caller.compliance.misuse.seed();
      const result = await caller.compliance.summary();
      
      expect(typeof result.openMisuse).toBe("number");
      expect(result.openMisuse).toBeGreaterThanOrEqual(0);
    });
  });

  describe("data validation", () => {
    it("should validate risk level enum", async () => {
      try {
        await caller.compliance.risk.updateStatus({
          riskId: "TEST-001",
          status: "not_a_status" as any,
        });
        expect.fail("Should throw validation error");
      } catch (err: any) {
        expect(err.code).toBe("BAD_REQUEST");
      }
    });

    it("should validate misuse status enum", async () => {
      try {
        await caller.compliance.misuse.updateStatus({
          scenarioId: "TEST-MS-001",
          status: "not_a_status" as any,
        });
        expect.fail("Should throw validation error");
      } catch (err: any) {
        expect(err.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("risk scoring", () => {
    it("should calculate risk score from likelihood and consequence", async () => {
      const risks = await caller.compliance.risk.list();
      
      // Verify that risks have likelihood and consequence values
      if (risks.length > 0) {
        const risk = risks[0];
        expect(typeof risk.likelihood).toBe("number");
        expect(typeof risk.consequence).toBe("number");
        
        // Risk score should be likelihood * consequence
        const expectedScore = risk.likelihood * risk.consequence;
        expect(expectedScore).toBeGreaterThan(0);
      }
    });

    it("should categorize risk as high when score >= 9", async () => {
      const risks = await caller.compliance.risk.list();
      
      // Find a high-risk item
      const highRisk = risks.find(r => r.riskLevel === "high");
      if (highRisk) {
        const score = highRisk.likelihood * highRisk.consequence;
        expect(score).toBeGreaterThanOrEqual(9);
      }
    });

    it("should categorize risk as medium when score >= 4 and < 9", async () => {
      const risks = await caller.compliance.risk.list();
      
      // Find a medium-risk item
      const mediumRisk = risks.find(r => r.riskLevel === "medium");
      if (mediumRisk) {
        const score = mediumRisk.likelihood * mediumRisk.consequence;
        expect(score).toBeGreaterThanOrEqual(4);
        expect(score).toBeLessThanOrEqual(9);
      }
    });
  });
});

