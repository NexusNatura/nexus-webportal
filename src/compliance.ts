/**
 * Compliance Router – EU AI Act Efterlevnad
 * Hanterar riskregister (Art. 9) och misuse-scenarier (Art. 9.2b)
 */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { riskEntries, misuseScenarios } from "../../drizzle/schema";

// â”€â”€â”€ Seed-data: Fördefinierade risker från EU AI Act-analysen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SEED_RISKS = [
  {
    riskId: "RISK-001",
    category: "model_accuracy" as const,
    title: "GWD-Alpha falskt positivt – legitimt påstående flaggas som greenwashing",
    description:
      "GWD-Alpha kan felaktigt klassificera ett faktabaserat och verifierbart hållbarhetspåstående som greenwashing, vilket skadar företagets rykte och leder till felaktiga NIF-ärenden.",
    affectedModule: "GWD-Alpha",
    likelihood: 3,
    consequence: 4,
    riskLevel: "high" as const,
    existingControls: "HITL-operatör (Peter Johansson) granskar alla GWD-beslut. Two-Person Rule för kritiska ärenden.",
    mitigationAction: "Implementera konfidenspoäng (0–100%) i GWD-analysen. Kräv manuell granskning om konfidensen är <80%. Lägg till förklaringstext för varje flaggad taktik.",
    euAiActArticle: "Art. 9.2a, Art. 14",
    residualRisk: "medium" as const,
    status: "identified" as const,
  },
  {
    riskId: "RISK-002",
    category: "model_accuracy" as const,
    title: "Grant-Gamma felaktig bidragsmatchning – ineligibelt program rekommenderas",
    description:
      "Grant-Gamma kan rekommendera ett bidragsprogram som leverantören inte är kvalificerad för (t.ex. fel bransch, fel storlek, utgången utlysning), vilket leder till bortkastade resurser och missat förtroende.",
    affectedModule: "Grant-Gamma",
    likelihood: 3,
    consequence: 3,
    riskLevel: "medium" as const,
    existingControls: "Användaren uppmanas att verifiera mot aktuella utlysningskrav. AI-transparensbanner informerar om begränsningar.",
    mitigationAction: "Lägg till datum-validering mot TED/Vinnova API. Visa alltid utlysningens deadline och länk till officiell källa. Implementera eligibilitetschecklista per program.",
    euAiActArticle: "Art. 9.2a, Art. 50",
    residualRisk: "low" as const,
    status: "identified" as const,
  },
  {
    riskId: "RISK-003",
    category: "human_oversight" as const,
    title: "WA-04 Policy Gate felaktig nekad åtkomst – tidskritiskt ärende blockeras",
    description:
      "WA-04 Policy Gate kan neka åtkomst till ett legitimt ärende baserat på felaktiga säkerhetsklassificeringar, vilket blockerar ett tidskritiskt arbetsflöde och kräver manuell eskalering.",
    affectedModule: "WA-04 Policy Gate",
    likelihood: 2,
    consequence: 4,
    riskLevel: "high" as const,
    existingControls: "Unpause Governance-procedur finns. Auto-paus kräver manuell återstart av operatör.",
    mitigationAction: "Implementera 'Emergency Override'-funktion med dubbel autentisering och obligatorisk loggning. Definiera SLA för Unpause-proceduren (max 2 timmar). Lägg till eskaleringsväg till backup-operatör.",
    euAiActArticle: "Art. 9.2b, Art. 14",
    residualRisk: "low" as const,
    status: "identified" as const,
  },
  {
    riskId: "RISK-004",
    category: "transparency" as const,
    title: "Otillräcklig AI-transparens mot slutanvändare",
    description:
      "Användare interagerar med AI-agenter utan tydlig information om att de kommunicerar med ett AI-system, i strid med Artikel 50 EU AI Act.",
    affectedModule: "NexusCore (alla moduler)",
    likelihood: 4,
    consequence: 3,
    riskLevel: "high" as const,
    existingControls: "Ingen befintlig kontroll (gap identifierat).",
    mitigationAction: "Implementera AITransparencyBanner i Operator Dashboard och alla agentinteraktioner. Märk alla AI-genererade NIF-intyg. Uppdatera användarvillkor.",
    euAiActArticle: "Art. 50",
    residualRisk: "low" as const,
    status: "in_progress" as const,
  },
  {
    riskId: "RISK-005",
    category: "data_quality" as const,
    title: "Gemini-modellens träningsdatums cutoff ger föråldrad information",
    description:
      "Gemini-modellen kan ge svar baserade på föråldrad information om EU-direktiv, bidragsprogram eller hållbarhetsstandarder som har uppdaterats efter modellens träningsdatum.",
    affectedModule: "Alla AI-agenter (Gemini)",
    likelihood: 3,
    consequence: 3,
    riskLevel: "medium" as const,
    existingControls: "AI-transparensbanner informerar om begränsningar. Användaren uppmanas att verifiera mot officiella källor.",
    mitigationAction: "Implementera RAG (Retrieval-Augmented Generation) med aktuella EU-dokument. Lägg till datum-stämpel på alla AI-svar. Uppdatera systemprompter med aktuella regelverksdatum.",
    euAiActArticle: "Art. 10, Art. 9.2a",
    residualRisk: "medium" as const,
    status: "identified" as const,
  },
];

const SEED_MISUSE = [
  {
    scenarioId: "MS-001",
    title: "GWD-Alpha falskt positivt – legitimt påstående felaktigt flaggas",
    description:
      "En leverantör med ett faktabaserat och verifierbart hållbarhetspåstående (t.ex. certifierad av tredje part) får sitt påstående felaktigt flaggat som greenwashing av GWD-Alpha, vilket leder till ett felaktigt NIF-ärende och skadat affärsrykte.",
    affectedModule: "GWD-Alpha",
    scenarioType: "false_positive" as const,
    likelihood: 3,
    consequence: 4,
    trigger:
      "GWD-Alpha analyserar ett påstående med hög konfidenspoäng men saknar tillgång till tredjepartscertifieringen som verifierar påståendet.",
    impact:
      "Leverantören nekas ett bidrag eller en upphandling baserat på ett felaktigt NIF-ärende. Nexus-OS förlorar förtroende. Potentiell juridisk exponering om leverantören bestrider beslutet.",
    mitigationMeasures:
      "1. Kräv konfidenspoäng â‰¥80% för automatisk flaggning. 2. Implementera 'Begär verifiering'-funktion där leverantören kan ladda upp certifieringsdokument. 3. HITL-operatör granskar alltid ärenden med konfidenspoäng 60–80%. 4. Lägg till 'Överklagandeprocess' i NIF-ärendeflödet.",
    detectionMethod:
      "Leverantören bestrider ärendet via plattformens överklagandefunktion. Manuell granskning av HITL-operatör. Kvartalsvis stickprovsgranskning av avslutade ärenden.",
    testingProtocol:
      "Testa GWD-Alpha med 20 kända legitima hållbarhetspåståenden (med tredjepartscertifiering). Acceptanskriterium: <10% falskt positiva.",
    linkedRiskId: "RISK-001",
    euAiActReference: "Art. 9.2b, Art. 14",
    status: "identified" as const,
  },
  {
    scenarioId: "MS-002",
    title: "Grant-Gamma rekommenderar ineligibelt program – resurser slösas",
    description:
      "Grant-Gamma rekommenderar ett Vinnova-program för ett företag som inte uppfyller eligibilitetskraven (t.ex. för stor omsättning, fel bransch-SNI-kod, eller utgången utlysning). Företaget investerar tid i en ansökan som automatiskt avslås.",
    affectedModule: "Grant-Gamma",
    scenarioType: "false_negative" as const,
    likelihood: 3,
    consequence: 3,
    trigger:
      "Grant-Gamma matchar mot ett program baserat på nyckelord i företagets beskrivning utan att verifiera eligibilitetskriterier mot aktuell utlysningstext.",
    impact:
      "Företaget lägger 20–80 timmar på en ansökan som avslås. Nexus-OS förlorar trovärdighet. Potentiell churn av pilotkund.",
    mitigationMeasures:
      "1. Implementera eligibilitetschecklista per program (omsättningsgräns, anställda, bransch, geografi). 2. Visa alltid utlysningens deadline och länk till officiell källa. 3. Lägg till varning om utlysningen stänger inom 30 dagar. 4. Kräv att operatören bekräftar eligibilitet innan ansökningsutkast genereras.",
    detectionMethod:
      "Spåra ansökningsutfall (godkänd/avslagen) per rekommendation. Alert om avslagsfrekvens >20% för ett specifikt program.",
    testingProtocol:
      "Testa Grant-Gamma med 10 företagsprofiler mot 5 program med kända eligibilitetskrav. Acceptanskriterium: 0 rekommendationer till ineligibla företag.",
    linkedRiskId: "RISK-002",
    euAiActReference: "Art. 9.2b",
    status: "identified" as const,
  },
  {
    scenarioId: "MS-003",
    title: "WA-04 felaktig nekad åtkomst – tidskritiskt ärende blockeras",
    description:
      "WA-04 Policy Gate nekar åtkomst till ett legitimt ärende (t.ex. en EU-bidragsansökan med 24 timmars deadline) baserat på en felaktig säkerhetsklassificering, och Unpause-proceduren tar längre tid än tillgänglig tid.",
    affectedModule: "WA-04 Policy Gate",
    scenarioType: "false_positive" as const,
    likelihood: 2,
    consequence: 5,
    trigger:
      "WA-04 triggas av ett ovanligt användningsmönster (t.ex. hög aktivitet sent på kvällen) och klassificerar det som en säkerhetsavvikelse, trots att det är en legitim operatör som arbetar mot en deadline.",
    impact:
      "Ansökan missas. Bidragsmöjlighet förloras (potentiellt 50 000–400 000 EUR). Operatören förlorar förtroende för systemet. Potentiell juridisk exponering om kunden lider ekonomisk skada.",
    mitigationMeasures:
      "1. Implementera 'Emergency Override' med dubbel autentisering (SMS + lösenord) och obligatorisk loggning. 2. Definiera SLA: Unpause-procedur max 30 minuter under kontorstid, max 2 timmar utanför. 3. Lägg till backup-operatör med Unpause-behörighet. 4. Implementera 'Deadline Alert' som flaggar ärenden med <48h deadline och sänker WA-04:s känslighet.",
    detectionMethod:
      "Operatören rapporterar via nödkontakt (SMS/email till backup-operatör). Automatisk alert om WA-04 blockerar ett ärende med aktiv deadline.",
    testingProtocol:
      "Simulera WA-04-blockering under ett ärende med 1-timmes deadline. Mät tid till Unpause. Acceptanskriterium: <30 minuter under kontorstid.",
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

  // Sammanfattning för ComplianceDashboard
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

