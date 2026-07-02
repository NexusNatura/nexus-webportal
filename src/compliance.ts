/**
 * Compliance Router â€“ EU AI Act Efterlevnad
 * Hanterar riskregister (Art. 9) och misuse-scenarier (Art. 9.2b)
 */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { riskEntries, misuseScenarios } from "../../drizzle/schema";

// â”€â”€â”€ Seed-data: FÃ¶rdefinierade risker frÃ¥n EU AI Act-analysen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SEED_RISKS = [
  {
    riskId: "RISK-001",
    category: "model_accuracy" as const,
    title: "GWD-Alpha falskt positivt â€“ legitimt pÃ¥stÃ¥ende flaggas som greenwashing",
    description:
      "GWD-Alpha kan felaktigt klassificera ett faktabaserat och verifierbart hÃ¥llbarhetspÃ¥stÃ¥ende som greenwashing, vilket skadar fÃ¶retagets rykte och leder till felaktiga NIF-Ã¤renden.",
    affectedModule: "GWD-Alpha",
    likelihood: 3,
    consequence: 4,
    riskLevel: "high" as const,
    existingControls: "HITL-operatÃ¶r (Peter Johansson) granskar alla GWD-beslut. Two-Person Rule fÃ¶r kritiska Ã¤renden.",
    mitigationAction: "Implementera konfidenspoÃ¤ng (0â€“100%) i GWD-analysen. KrÃ¤v manuell granskning om konfidensen Ã¤r <80%. LÃ¤gg till fÃ¶rklaringstext fÃ¶r varje flaggad taktik.",
    euAiActArticle: "Art. 9.2a, Art. 14",
    residualRisk: "medium" as const,
    status: "identified" as const,
  },
  {
    riskId: "RISK-002",
    category: "model_accuracy" as const,
    title: "Grant-Gamma felaktig bidragsmatchning â€“ ineligibelt program rekommenderas",
    description:
      "Grant-Gamma kan rekommendera ett bidragsprogram som leverantÃ¶ren inte Ã¤r kvalificerad fÃ¶r (t.ex. fel bransch, fel storlek, utgÃ¥ngen utlysning), vilket leder till bortkastade resurser och missat fÃ¶rtroende.",
    affectedModule: "Grant-Gamma",
    likelihood: 3,
    consequence: 3,
    riskLevel: "medium" as const,
    existingControls: "AnvÃ¤ndaren uppmanas att verifiera mot aktuella utlysningskrav. AI-transparensbanner informerar om begrÃ¤nsningar.",
    mitigationAction: "LÃ¤gg till datum-validering mot TED/Vinnova API. Visa alltid utlysningens deadline och lÃ¤nk till officiell kÃ¤lla. Implementera eligibilitetschecklista per program.",
    euAiActArticle: "Art. 9.2a, Art. 50",
    residualRisk: "low" as const,
    status: "identified" as const,
  },
  {
    riskId: "RISK-003",
    category: "human_oversight" as const,
    title: "WA-04 Policy Gate felaktig nekad Ã¥tkomst â€“ tidskritiskt Ã¤rende blockeras",
    description:
      "WA-04 Policy Gate kan neka Ã¥tkomst till ett legitimt Ã¤rende baserat pÃ¥ felaktiga sÃ¤kerhetsklassificeringar, vilket blockerar ett tidskritiskt arbetsflÃ¶de och krÃ¤ver manuell eskalering.",
    affectedModule: "WA-04 Policy Gate",
    likelihood: 2,
    consequence: 4,
    riskLevel: "high" as const,
    existingControls: "Unpause Governance-procedur finns. Auto-paus krÃ¤ver manuell Ã¥terstart av operatÃ¶r.",
    mitigationAction: "Implementera 'Emergency Override'-funktion med dubbel autentisering och obligatorisk loggning. Definiera SLA fÃ¶r Unpause-proceduren (max 2 timmar). LÃ¤gg till eskaleringsvÃ¤g till backup-operatÃ¶r.",
    euAiActArticle: "Art. 9.2b, Art. 14",
    residualRisk: "low" as const,
    status: "identified" as const,
  },
  {
    riskId: "RISK-004",
    category: "transparency" as const,
    title: "OtillrÃ¤cklig AI-transparens mot slutanvÃ¤ndare",
    description:
      "AnvÃ¤ndare interagerar med AI-agenter utan tydlig information om att de kommunicerar med ett AI-system, i strid med Artikel 50 EU AI Act.",
    affectedModule: "NexusCore (alla moduler)",
    likelihood: 4,
    consequence: 3,
    riskLevel: "high" as const,
    existingControls: "Ingen befintlig kontroll (gap identifierat).",
    mitigationAction: "Implementera AITransparencyBanner i Operator Dashboard och alla agentinteraktioner. MÃ¤rk alla AI-genererade NIF-intyg. Uppdatera anvÃ¤ndarvillkor.",
    euAiActArticle: "Art. 50",
    residualRisk: "low" as const,
    status: "in_progress" as const,
  },
  {
    riskId: "RISK-005",
    category: "data_quality" as const,
    title: "Gemini-modellens trÃ¤ningsdatums cutoff ger fÃ¶rÃ¥ldrad information",
    description:
      "Gemini-modellen kan ge svar baserade pÃ¥ fÃ¶rÃ¥ldrad information om EU-direktiv, bidragsprogram eller hÃ¥llbarhetsstandarder som har uppdaterats efter modellens trÃ¤ningsdatum.",
    affectedModule: "Alla AI-agenter (Gemini)",
    likelihood: 3,
    consequence: 3,
    riskLevel: "medium" as const,
    existingControls: "AI-transparensbanner informerar om begrÃ¤nsningar. AnvÃ¤ndaren uppmanas att verifiera mot officiella kÃ¤llor.",
    mitigationAction: "Implementera RAG (Retrieval-Augmented Generation) med aktuella EU-dokument. LÃ¤gg till datum-stÃ¤mpel pÃ¥ alla AI-svar. Uppdatera systemprompter med aktuella regelverksdatum.",
    euAiActArticle: "Art. 10, Art. 9.2a",
    residualRisk: "medium" as const,
    status: "identified" as const,
  },
];

const SEED_MISUSE = [
  {
    scenarioId: "MS-001",
    title: "GWD-Alpha falskt positivt â€“ legitimt pÃ¥stÃ¥ende felaktigt flaggas",
    description:
      "En leverantÃ¶r med ett faktabaserat och verifierbart hÃ¥llbarhetspÃ¥stÃ¥ende (t.ex. certifierad av tredje part) fÃ¥r sitt pÃ¥stÃ¥ende felaktigt flaggat som greenwashing av GWD-Alpha, vilket leder till ett felaktigt NIF-Ã¤rende och skadat affÃ¤rsrykte.",
    affectedModule: "GWD-Alpha",
    scenarioType: "false_positive" as const,
    likelihood: 3,
    consequence: 4,
    trigger:
      "GWD-Alpha analyserar ett pÃ¥stÃ¥ende med hÃ¶g konfidenspoÃ¤ng men saknar tillgÃ¥ng till tredjepartscertifieringen som verifierar pÃ¥stÃ¥endet.",
    impact:
      "LeverantÃ¶ren nekas ett bidrag eller en upphandling baserat pÃ¥ ett felaktigt NIF-Ã¤rende. Nexus-OS fÃ¶rlorar fÃ¶rtroende. Potentiell juridisk exponering om leverantÃ¶ren bestrider beslutet.",
    mitigationMeasures:
      "1. KrÃ¤v konfidenspoÃ¤ng â‰¥80% fÃ¶r automatisk flaggning. 2. Implementera 'BegÃ¤r verifiering'-funktion dÃ¤r leverantÃ¶ren kan ladda upp certifieringsdokument. 3. HITL-operatÃ¶r granskar alltid Ã¤renden med konfidenspoÃ¤ng 60â€“80%. 4. LÃ¤gg till 'Ã–verklagandeprocess' i NIF-Ã¤rendeflÃ¶det.",
    detectionMethod:
      "LeverantÃ¶ren bestrider Ã¤rendet via plattformens Ã¶verklagandefunktion. Manuell granskning av HITL-operatÃ¶r. Kvartalsvis stickprovsgranskning av avslutade Ã¤renden.",
    testingProtocol:
      "Testa GWD-Alpha med 20 kÃ¤nda legitima hÃ¥llbarhetspÃ¥stÃ¥enden (med tredjepartscertifiering). Acceptanskriterium: <10% falskt positiva.",
    linkedRiskId: "RISK-001",
    euAiActReference: "Art. 9.2b, Art. 14",
    status: "identified" as const,
  },
  {
    scenarioId: "MS-002",
    title: "Grant-Gamma rekommenderar ineligibelt program â€“ resurser slÃ¶sas",
    description:
      "Grant-Gamma rekommenderar ett Vinnova-program fÃ¶r ett fÃ¶retag som inte uppfyller eligibilitetskraven (t.ex. fÃ¶r stor omsÃ¤ttning, fel bransch-SNI-kod, eller utgÃ¥ngen utlysning). FÃ¶retaget investerar tid i en ansÃ¶kan som automatiskt avslÃ¥s.",
    affectedModule: "Grant-Gamma",
    scenarioType: "false_negative" as const,
    likelihood: 3,
    consequence: 3,
    trigger:
      "Grant-Gamma matchar mot ett program baserat pÃ¥ nyckelord i fÃ¶retagets beskrivning utan att verifiera eligibilitetskriterier mot aktuell utlysningstext.",
    impact:
      "FÃ¶retaget lÃ¤gger 20â€“80 timmar pÃ¥ en ansÃ¶kan som avslÃ¥s. Nexus-OS fÃ¶rlorar trovÃ¤rdighet. Potentiell churn av pilotkund.",
    mitigationMeasures:
      "1. Implementera eligibilitetschecklista per program (omsÃ¤ttningsgrÃ¤ns, anstÃ¤llda, bransch, geografi). 2. Visa alltid utlysningens deadline och lÃ¤nk till officiell kÃ¤lla. 3. LÃ¤gg till varning om utlysningen stÃ¤nger inom 30 dagar. 4. KrÃ¤v att operatÃ¶ren bekrÃ¤ftar eligibilitet innan ansÃ¶kningsutkast genereras.",
    detectionMethod:
      "SpÃ¥ra ansÃ¶kningsutfall (godkÃ¤nd/avslagen) per rekommendation. Alert om avslagsfrekvens >20% fÃ¶r ett specifikt program.",
    testingProtocol:
      "Testa Grant-Gamma med 10 fÃ¶retagsprofiler mot 5 program med kÃ¤nda eligibilitetskrav. Acceptanskriterium: 0 rekommendationer till ineligibla fÃ¶retag.",
    linkedRiskId: "RISK-002",
    euAiActReference: "Art. 9.2b",
    status: "identified" as const,
  },
  {
    scenarioId: "MS-003",
    title: "WA-04 felaktig nekad Ã¥tkomst â€“ tidskritiskt Ã¤rende blockeras",
    description:
      "WA-04 Policy Gate nekar Ã¥tkomst till ett legitimt Ã¤rende (t.ex. en EU-bidragsansÃ¶kan med 24 timmars deadline) baserat pÃ¥ en felaktig sÃ¤kerhetsklassificering, och Unpause-proceduren tar lÃ¤ngre tid Ã¤n tillgÃ¤nglig tid.",
    affectedModule: "WA-04 Policy Gate",
    scenarioType: "false_positive" as const,
    likelihood: 2,
    consequence: 5,
    trigger:
      "WA-04 triggas av ett ovanligt anvÃ¤ndningsmÃ¶nster (t.ex. hÃ¶g aktivitet sent pÃ¥ kvÃ¤llen) och klassificerar det som en sÃ¤kerhetsavvikelse, trots att det Ã¤r en legitim operatÃ¶r som arbetar mot en deadline.",
    impact:
      "AnsÃ¶kan missas. BidragsmÃ¶jlighet fÃ¶rloras (potentiellt 50 000â€“400 000 EUR). OperatÃ¶ren fÃ¶rlorar fÃ¶rtroende fÃ¶r systemet. Potentiell juridisk exponering om kunden lider ekonomisk skada.",
    mitigationMeasures:
      "1. Implementera 'Emergency Override' med dubbel autentisering (SMS + lÃ¶senord) och obligatorisk loggning. 2. Definiera SLA: Unpause-procedur max 30 minuter under kontorstid, max 2 timmar utanfÃ¶r. 3. LÃ¤gg till backup-operatÃ¶r med Unpause-behÃ¶righet. 4. Implementera 'Deadline Alert' som flaggar Ã¤renden med <48h deadline och sÃ¤nker WA-04:s kÃ¤nslighet.",
    detectionMethod:
      "OperatÃ¶ren rapporterar via nÃ¶dkontakt (SMS/email till backup-operatÃ¶r). Automatisk alert om WA-04 blockerar ett Ã¤rende med aktiv deadline.",
    testingProtocol:
      "Simulera WA-04-blockering under ett Ã¤rende med 1-timmes deadline. MÃ¤t tid till Unpause. Acceptanskriterium: <30 minuter under kontorstid.",
    linkedRiskId: "RISK-003",
    euAiActReference: "Art. 9.2b, Art. 14",
    status: "identified" as const,
  },
];

// â”€â”€â”€ Router â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const complianceRouter = router({
  // Riskregister
  risk: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(riskEntries).orderBy(riskEntries.riskId);
    }),

    upsert: publicProcedure
      .input(
        z.object({
          riskId: z.string(),
          category: z.enum(["data_quality", "model_accuracy", "transparency", "human_oversight", "security", "fundamental_rights", "operational"]),
          title: z.string().min(1).max(255),
          description: z.string().min(1),
          affectedModule: z.string().min(1).max(128),
          likelihood: z.number().int().min(1).max(5),
          consequence: z.number().int().min(1).max(5),
          riskLevel: z.enum(["low", "medium", "high", "critical"]),
          existingControls: z.string().optional(),
          mitigationAction: z.string().optional(),
          mitigationDeadline: z.date().optional(),
          status: z.enum(["identified", "in_progress", "mitigated", "verified", "accepted"]),
          euAiActArticle: z.string().optional(),
          residualRisk: z.enum(["low", "medium", "high", "critical"]).optional(),
          reviewedBy: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db
          .insert(riskEntries)
          .values(input)
          .onDuplicateKeyUpdate({ set: input });
        return { success: true };
      }),

    updateStatus: publicProcedure
      .input(z.object({
        riskId: z.string(),
        status: z.enum(["identified", "in_progress", "mitigated", "verified", "accepted"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db
          .update(riskEntries)
          .set({ status: input.status, reviewedAt: new Date() })
          .where(eq(riskEntries.riskId, input.riskId));
        return { success: true, status: input.status };
      }),

    seed: publicProcedure.mutation(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      for (const risk of SEED_RISKS) {
        await db
          .insert(riskEntries)
          .values(risk)
          .onDuplicateKeyUpdate({ set: risk });
      }
      return { count: SEED_RISKS.length, seeded: SEED_RISKS.length };
    }),
  }),

  // Misuse-scenarier
  misuse: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(misuseScenarios).orderBy(misuseScenarios.scenarioId);
    }),

    updateStatus: publicProcedure
      .input(z.object({
        scenarioId: z.string(),
        status: z.enum(["identified", "under_review", "mitigated", "verified"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db
          .update(misuseScenarios)
          .set({ status: input.status })
          .where(eq(misuseScenarios.scenarioId, input.scenarioId));
        return { success: true };
      }),

    seed: publicProcedure.mutation(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      for (const scenario of SEED_MISUSE) {
        await db
          .insert(misuseScenarios)
          .values(scenario)
          .onDuplicateKeyUpdate({ set: scenario });
      }
      return { seeded: SEED_MISUSE.length };
    }),
  }),

  // Sammanfattning fÃ¶r ComplianceDashboard
  summary: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { risks: [], misuse: [], totalRisks: 0, criticalRisks: 0, openMisuse: 0, risksByLevel: {}, risksByStatus: {} };

    const risks = await db.select().from(riskEntries);
    const misuse = await db.select().from(misuseScenarios);

    const risksByLevel = {
      low: risks.filter(r => r.riskLevel === "low").length,
      medium: risks.filter(r => r.riskLevel === "medium").length,
      high: risks.filter(r => r.riskLevel === "high").length,
      critical: risks.filter(r => r.riskLevel === "critical").length,
    };

    const risksByStatus = {
      identified: risks.filter(r => r.status === "identified").length,
      in_progress: risks.filter(r => r.status === "in_progress").length,
      mitigated: risks.filter(r => r.status === "mitigated").length,
      verified: risks.filter(r => r.status === "verified").length,
      accepted: risks.filter(r => r.status === "accepted").length,
    };

    return {
      risks,
      misuse,
      totalRisks: risks.length,
      criticalRisks: risks.filter(r => r.riskLevel === "critical" || r.riskLevel === "high").length,
      openMisuse: misuse.filter(m => m.status === "identified" || m.status === "under_review").length,
      mitigatedRisks: risks.filter(r => r.status === "mitigated" || r.status === "verified").length,
      risksByLevel,
      risksByStatus,
    };
  }),
});

