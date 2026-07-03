import { boolean, decimal, float, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// â”€â”€â”€ EU AI Act Efterlevnad â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const riskEntries = mysqlTable("risk_entries", {
  id: int("id").autoincrement().primaryKey(),
  riskId: varchar("riskId", { length: 32 }).notNull().unique(),
  category: mysqlEnum("category", [
    "data_quality",
    "model_accuracy",
    "transparency",
    "human_oversight",
    "security",
    "fundamental_rights",
    "operational",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  affectedModule: varchar("affectedModule", { length: 128 }).notNull(),
  likelihood: int("likelihood").notNull(),
  consequence: int("consequence").notNull(),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high", "critical"]).notNull(),
  existingControls: text("existingControls"),
  mitigationAction: text("mitigationAction"),
  mitigationDeadline: timestamp("mitigationDeadline"),
  status: mysqlEnum("status", ["identified", "in_progress", "mitigated", "verified", "accepted"]).default("identified").notNull(),
  euAiActArticle: varchar("euAiActArticle", { length: 64 }),
  residualRisk: mysqlEnum("residualRisk", ["low", "medium", "high", "critical"]),
  reviewedBy: varchar("reviewedBy", { length: 128 }),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RiskEntry = typeof riskEntries.$inferSelect;
export type InsertRiskEntry = typeof riskEntries.$inferInsert;

export const misuseScenarios = mysqlTable("misuse_scenarios", {
  id: int("id").autoincrement().primaryKey(),
  scenarioId: varchar("scenarioId", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  affectedModule: varchar("affectedModule", { length: 128 }).notNull(),
  scenarioType: mysqlEnum("scenarioType", [
    "false_positive",
    "false_negative",
    "misuse_by_user",
    "data_poisoning",
    "scope_creep",
    "over_reliance",
  ]).notNull(),
  likelihood: int("likelihood").notNull(),
  consequence: int("consequence").notNull(),
  trigger: text("trigger").notNull(),
  impact: text("impact").notNull(),
  mitigationMeasures: text("mitigationMeasures").notNull(),
  detectionMethod: text("detectionMethod"),
  testingProtocol: text("testingProtocol"),
  status: mysqlEnum("status", ["identified", "under_review", "mitigated", "verified"]).default("identified").notNull(),
  linkedRiskId: varchar("linkedRiskId", { length: 32 }),
  euAiActReference: varchar("euAiActReference", { length: 128 }),
  lastTestedAt: timestamp("lastTestedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MisuseScenario = typeof misuseScenarios.$inferSelect;
export type InsertMisuseScenario = typeof misuseScenarios.$inferInsert;

// â”€â”€â”€ BatteryPassport Builder (BPB) – EU Batteriförordning 2023/1542 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Batteripass – huvudtabell
 * Täcker obligatoriska datapunkter enligt Annex XIII i EU Batteriförordning 2023/1542
 */
export const batteryPassports = mysqlTable("battery_passports", {
  id: int("id").autoincrement().primaryKey(),
  /** Unikt pass-ID, format: BPP-YYYY-XXXXXX */
  passportId: varchar("passportId", { length: 32 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "pending_review", "verified", "published", "archived"])
    .default("draft").notNull(),

  // â”€â”€ Steg 1: Grunddata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  productName: varchar("productName", { length: 255 }).notNull(),
  modelNumber: varchar("modelNumber", { length: 128 }).notNull(),
  manufacturerName: varchar("manufacturerName", { length: 255 }).notNull(),
  manufacturerCountry: varchar("manufacturerCountry", { length: 64 }),
  manufacturerAddress: text("manufacturerAddress"),
  manufacturerContact: varchar("manufacturerContact", { length: 255 }),
  serialNumber: varchar("serialNumber", { length: 128 }),
  batchNumber: varchar("batchNumber", { length: 128 }),
  productionDate: varchar("productionDate", { length: 32 }),
  /** Batterikategori enligt förordningen */
  batteryCategory: mysqlEnum("batteryCategory", [
    "portable",        // Portabla batterier < 5 kg
    "light_means",     // Lätta transportmedel (e-cykel, elscooter)
    "ev",              // Elfordonsbatterier
    "industrial",      // Industriella batterier >= 2 kWh
    "sli",             // Start-, belysnings- och tändningsbatterier
  ]).notNull(),
  /** EU-harmoniserat produktnummer (GTIN/EAN) */
  gtin: varchar("gtin", { length: 64 }),

  // â”€â”€ Steg 2: Batterikemi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  chemistry: mysqlEnum("chemistry", [
    "li_nmc",   // Litium-nickel-mangan-kobolt
    "li_lco",   // Litium-koboltoxid
    "li_lfp",   // Litium-järnfosfat
    "li_nca",   // Litium-nickel-kobolt-aluminium
    "li_lto",   // Litium-titanatoxid
    "nimh",     // Nickel-metallhydrid
    "nicd",     // Nickel-kadmium
    "lead_acid",// Bly-syra
    "sodium",   // Natrium-jon
    "other",
  ]).notNull(),
  nominalCapacityAh: float("nominalCapacityAh"),
  nominalVoltageV: float("nominalVoltageV"),
  energyCapacityKwh: float("energyCapacityKwh"),
  energyDensityWhKg: float("energyDensityWhKg"),
  powerDensityWKg: float("powerDensityWKg"),
  temperatureRangeMin: float("temperatureRangeMin"),
  temperatureRangeMax: float("temperatureRangeMax"),
  expectedLifecycleCycles: int("expectedLifecycleCycles"),
  expectedLifetimeYears: int("expectedLifetimeYears"),

  // â”€â”€ Steg 3: Karbonfotavtryck (Artikel 7) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** kg COâ‚‚e per kWh – obligatoriskt från 2025 för EV/industriella batterier */
  carbonFootprintKgCo2eKwh: float("carbonFootprintKgCo2eKwh"),
  carbonFootprintSystemBoundary: mysqlEnum("carbonFootprintSystemBoundary", [
    "cradle_to_gate",
    "cradle_to_grave",
    "gate_to_gate",
  ]),
  carbonFootprintVerificationMethod: varchar("carbonFootprintVerificationMethod", { length: 255 }),
  carbonFootprintThirdPartyVerifier: varchar("carbonFootprintThirdPartyVerifier", { length: 255 }),
  /** Uppdelning per livscykelfas (JSON) */
  carbonFootprintBreakdown: json("carbonFootprintBreakdown"),

  // â”€â”€ Steg 4: Återvunnet innehåll (Artikel 8) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** % återvunnet kobolt */
  recycledCobaltPct: float("recycledCobaltPct"),
  /** % återvunnet litium */
  recycledLithiumPct: float("recycledLithiumPct"),
  /** % återvunnet nickel */
  recycledNickelPct: float("recycledNickelPct"),
  /** % återvunnet bly */
  recycledLeadPct: float("recycledLeadPct"),
  /** % återvunnet mangan */
  recycledManganesePct: float("recycledManganesePct"),
  recycledContentVerifier: varchar("recycledContentVerifier", { length: 255 }),
  recycledContentVerificationDate: varchar("recycledContentVerificationDate", { length: 32 }),

  // â”€â”€ Steg 5: Demonteringsanvisningar (Artikel 11) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** Steg-för-steg demonteringsanvisningar (JSON-array) */
  dismantlingInstructions: json("dismantlingInstructions"),
  /** Erforderliga verktyg */
  requiredTools: text("requiredTools"),
  /** Säkerhetsvarningar */
  safetyWarnings: text("safetyWarnings"),
  /** Länk till fullständig servicedokumentation */
  serviceDocumentationUrl: varchar("serviceDocumentationUrl", { length: 512 }),

  // â”€â”€ Steg 6: End-of-Life & Insamling (Artikel 60-61) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** Insamlingsansvarig PRO (t.ex. Batterikretsen) */
  collectionScheme: varchar("collectionScheme", { length: 255 }),
  /** Närmaste insamlingspunkt (adress/URL) */
  collectionPointUrl: varchar("collectionPointUrl", { length: 512 }),
  /** Godkänd återvinnare (t.ex. Revac Sverige AB) */
  approvedRecycler: varchar("approvedRecycler", { length: 255 }),
  approvedRecyclerCertification: varchar("approvedRecyclerCertification", { length: 128 }),
  /** Återvinningsmål (%) per material */
  recyclingTargets: json("recyclingTargets"),
  /** Revac-specifik integration: anläggningskod */
  revacFacilityCode: varchar("revacFacilityCode", { length: 64 }),

  // â”€â”€ Metadata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** Genererat JSON-LD-dokument (cachelagrat) */
  jsonLdDocument: json("jsonLdDocument"),
  /** NIF-verifieringsintyg (PDF-URL) */
  nifCertificateUrl: varchar("nifCertificateUrl", { length: 512 }),
  /** QR-kod URL */
  qrCodeUrl: varchar("qrCodeUrl", { length: 512 }),
  createdBy: varchar("createdBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type BatteryPassport = typeof batteryPassports.$inferSelect;
export type InsertBatteryPassport = typeof batteryPassports.$inferInsert;

// â”€â”€â”€ Blog Posts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 128 }).notNull(),
  authorRole: varchar("authorRole", { length: 128 }),
  coAuthor: varchar("coAuthor", { length: 128 }),
  coAuthorRole: varchar("coAuthorRole", { length: 128 }),
  category: varchar("category", { length: 64 }).notNull(),
  tags: json("tags").$type<string[]>(),
  readingTime: int("readingTime").notNull().default(5),
  featured: int("featured").notNull().default(0),
  publishedAt: timestamp("publishedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// â”€â”€â”€ Marketplace Listings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const marketplaceListings = mysqlTable("marketplace_listings", {
  id: int("id").autoincrement().primaryKey(),
  /** FK to users.id – the seller */
  sellerId: int("sellerId").notNull(),
  /** Display title, e.g. "LCA-data – Silverring 925" */
  title: varchar("title", { length: 255 }).notNull(),
  /** Short description shown in the listing card */
  description: text("description").notNull(),
  /** Product category, e.g. "Metall & Stål" */
  category: varchar("category", { length: 64 }).notNull(),
  /** Price in SEK öre (integer) – 45000 = 450 SEK */
  priceOre: int("priceOre").notNull(),
  /** Revenue share kept by seller (integer percent, e.g. 70) */
  sellerSharePct: int("sellerSharePct").notNull().default(70),
  /** Number of sustainability data points included */
  dataPoints: int("dataPoints").notNull().default(0),
  /** COâ‚‚ value string, e.g. "0.8 kg COâ‚‚e/enhet" */
  co2Value: varchar("co2Value", { length: 64 }),
  /** Recycled content string, e.g. "94%" */
  recycledContent: varchar("recycledContent", { length: 32 }),
  /** JSON array of certification strings */
  certifications: json("certifications").$type<string[]>(),
  /** "active" | "paused" | "sold_out" */
  status: mysqlEnum("status", ["active", "paused", "sold_out"]).notNull().default("active"),
  /** DPP ID reference, e.g. "DPP-2024-SE-0142" */
  dppId: varchar("dppId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = typeof marketplaceListings.$inferInsert;

// â”€â”€â”€ Marketplace Purchases â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const marketplacePurchases = mysqlTable("marketplace_purchases", {
  id: int("id").autoincrement().primaryKey(),
  /** FK to marketplace_listings.id */
  listingId: int("listingId").notNull(),
  /** FK to users.id – the buyer */
  buyerId: int("buyerId").notNull(),
  /** Stripe PaymentIntent ID for audit trail */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  /** Stripe Checkout Session ID */
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  /** Amount paid in SEK öre */
  amountOre: int("amountOre").notNull(),
  /** "pending" | "paid" | "failed" | "refunded" */
  status: mysqlEnum("status", ["pending", "paid", "failed", "refunded"]).notNull().default("pending"),
  /** Timestamp of payment confirmation */
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type MarketplacePurchase = typeof marketplacePurchases.$inferSelect;
export type InsertMarketplacePurchase = typeof marketplacePurchases.$inferInsert;

// â”€â”€â”€ Agents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  /** Internal slug, e.g. "grant-gamma-pro" */
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  tagline: varchar("tagline", { length: 256 }).notNull(),
  description: text("description").notNull(),
  /** "grants" | "compliance" | "dpp" | "symbiosis" | "design" | "circular" */
  category: mysqlEnum("category", ["grants", "compliance", "dpp", "symbiosis", "design", "circular"]).notNull(),
  /** "per_task" | "monthly" | "both" */
  pricingModel: mysqlEnum("pricingModel", ["per_task", "monthly", "both"]).notNull().default("per_task"),
  /** Price per task in SEK öre (e.g. 250000 = 2 500 SEK) */
  pricePerTaskOre: int("pricePerTaskOre"),
  /** Monthly subscription price in SEK öre */
  priceMonthlyOre: int("priceMonthlyOre"),
  /** EU AI Act risk class */
  riskClass: mysqlEnum("riskClass", ["minimal", "limited", "high"]).notNull().default("limited"),
  /** WA-04 security level */
  securityLevel: mysqlEnum("securityLevel", ["open", "standard", "high_a", "high_b"]).notNull().default("standard"),
  /** JSON array of capability strings */
  capabilities: json("capabilities").$type<string[]>(),
  /** JSON array of use-case strings */
  useCases: json("useCases").$type<string[]>(),
  /** Benchmark accuracy 0-100 */
  benchmarkScore: int("benchmarkScore"),
  /** Average response time in seconds */
  avgResponseTimeSec: int("avgResponseTimeSec"),
  /** "active" | "beta" | "coming_soon" */
  status: mysqlEnum("status", ["active", "beta", "coming_soon"]).notNull().default("active"),
  /** Whether this is an official Nexus-OS agent */
  isOfficial: boolean("isOfficial").notNull().default(true),
  /** Number of purchases/activations */
  purchaseCount: int("purchaseCount").notNull().default(0),
  /** Lucide icon name for display */
  iconName: varchar("iconName", { length: 64 }).notNull().default("Bot"),
  /** Accent color class for card theming */
  accentColor: varchar("accentColor", { length: 64 }).notNull().default("text-emerald-400"),
  /** FK to users.id – creator (null for official Nexus-OS agents) */
  creatorId: int("creatorId"),
  /** System prompt used by the agent */
  systemPrompt: text("systemPrompt"),
  /** Training notes / context for the agent */
  trainingNotes: text("trainingNotes"),
  /** Review status for third-party agents */
  reviewStatus: mysqlEnum("reviewStatus", ["draft", "pending_review", "approved", "rejected"]).notNull().default("approved"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// â”€â”€â”€ Agent Purchases â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const agentPurchases = mysqlTable("agent_purchases", {
  id: int("id").autoincrement().primaryKey(),
  /** FK to agents.id */
  agentId: int("agentId").notNull(),
  /** FK to users.id – the buyer */
  buyerId: int("buyerId").notNull(),
  /** "per_task" | "monthly" */
  purchaseType: mysqlEnum("purchaseType", ["per_task", "monthly"]).notNull(),
  /** Stripe Checkout Session ID */
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  /** Stripe PaymentIntent ID */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  /** Amount paid in SEK öre */
  amountOre: int("amountOre").notNull(),
  /** "pending" | "paid" | "failed" | "refunded" */
  status: mysqlEnum("status", ["pending", "paid", "failed", "refunded"]).notNull().default("pending"),
  /** For monthly: subscription expiry */
  expiresAt: timestamp("expiresAt"),
  /** Timestamp of payment confirmation */
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AgentPurchase = typeof agentPurchases.$inferSelect;
export type InsertAgentPurchase = typeof agentPurchases.$inferInsert;

// â”€â”€â”€ DPP Passports â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const dppPassports = mysqlTable("dpp_passports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dppId: varchar("dppId", { length: 64 }).notNull().unique(),
  productName: varchar("productName", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  materials: text("materials"),
  co2Footprint: varchar("co2Footprint", { length: 50 }),
  recycledContent: varchar("recycledContent", { length: 50 }),
  jsonLd: text("jsonLd").notNull(),
  aiAnalysis: text("aiAnalysis"),
  status: mysqlEnum("status", ["draft", "active", "published"]).notNull().default("draft"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  paid: boolean("paid").notNull().default(false),
  createdAt: int("createdAt").notNull(),
  updatedAt: int("updatedAt").notNull(),
});
export type DppPassport = typeof dppPassports.$inferSelect;
export type InsertDppPassport = typeof dppPassports.$inferInsert;

// â”€â”€â”€ Agent Drafts (AgentBuilder wizard sessions) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const agentDrafts = mysqlTable("agent_drafts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  step: int("step").notNull().default(1),
  data: json("data").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AgentDraft = typeof agentDrafts.$inferSelect;
export type InsertAgentDraft = typeof agentDrafts.$inferInsert;

// â”€â”€â”€ User Subscriptions (SMF / Enterprise plans) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const userSubscriptions = mysqlTable("user_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["smf", "enterprise"]).notNull().default("smf"),
  status: mysqlEnum("status", ["pending", "active", "cancelled", "expired"]).notNull().default("pending"),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  /** Unix timestamp (ms) when subscription started */
  startedAt: int("startedAt"),
  /** Unix timestamp (ms) when current period ends (30 days after start) */
  currentPeriodEnd: int("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;


// â”€â”€â”€ AgentCommunity: Educational Platform for Agent Creators â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Courses: Main learning paths for agent creators
 * Covers topics like Prompt Engineering, Multi-Agent Systems, Ethics, etc.
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["beginner", "intermediate", "advanced", "specialized"]).notNull(),
  level: int("level").notNull(), // 1-5 difficulty scale
  duration: int("duration").notNull(), // estimated minutes
  instructor: varchar("instructor", { length: 255 }).notNull(),
  instructorBio: text("instructorBio"),
  thumbnailUrl: varchar("thumbnailUrl", { length: 512 }),
  learningOutcomes: text("learningOutcomes"), // JSON array of strings
  prerequisites: text("prerequisites"), // JSON array of course slugs
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  enrollmentCount: int("enrollmentCount").default(0).notNull(),
  averageRating: float("averageRating").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Lessons: Individual learning modules within a course
 * Each lesson contains content and a quiz
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  slug: varchar("slug", { length: 128 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content").notNull(), // Markdown content
  videoUrl: varchar("videoUrl", { length: 512 }), // Optional video URL
  order: int("order").notNull(), // Lesson sequence in course
  estimatedDuration: int("estimatedDuration").notNull(), // minutes
  keyTakeaways: text("keyTakeaways"), // JSON array of strings
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Quiz Questions: Assessment questions for lessons
 * Supports multiple choice, true/false, and short answer formats
 */
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  question: varchar("question", { length: 512 }).notNull(),
  type: mysqlEnum("type", ["multiple_choice", "true_false", "short_answer"]).notNull(),
  options: text("options"), // JSON array for multiple choice
  correctAnswer: text("correctAnswer").notNull(),
  explanation: text("explanation"),
  order: int("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/**
 * Logic Puzzles: Interactive challenges for advanced learning
 * Includes difficulty levels and leaderboard tracking
 */
export const logicPuzzles = mysqlTable("logic_puzzles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced", "expert"]).notNull(),
  category: varchar("category", { length: 128 }).notNull(), // e.g., "prompt_engineering", "multi_agent"
  problemStatement: text("problemStatement").notNull(),
  expectedOutput: text("expectedOutput").notNull(),
  hints: text("hints"), // JSON array of hints
  solution: text("solution").notNull(),
  timeLimit: int("timeLimit"), // seconds, null = no limit
  points: int("points").default(100).notNull(),
  testCases: text("testCases"), // JSON array of test cases
  successCriteria: text("successCriteria"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type LogicPuzzle = typeof logicPuzzles.$inferSelect;
export type InsertLogicPuzzle = typeof logicPuzzles.$inferInsert;

/**
 * User Course Enrollment & Progress
 * Tracks which courses users are taking and their completion status
 */
export const userCourseProgress = mysqlTable("user_course_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  status: mysqlEnum("status", ["enrolled", "in_progress", "completed", "abandoned"]).default("enrolled").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  progressPercentage: int("progressPercentage").default(0).notNull(),
  lessonsCompleted: int("lessonsCompleted").default(0).notNull(),
  totalLessons: int("totalLessons").notNull(),
  quizScore: int("quizScore"), // Average quiz score (0-100)
  certificateId: int("certificateId"), // FK to certificates table
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type InsertUserCourseProgress = typeof userCourseProgress.$inferInsert;

/**
 * User Lesson Progress
 * Tracks completion and quiz scores for individual lessons
 */
export const userLessonProgress = mysqlTable("user_lesson_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  quizScore: int("quizScore"), // 0-100
  quizAttempts: int("quizAttempts").default(0).notNull(),
  timeSpent: int("timeSpent").default(0).notNull(), // seconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserLessonProgress = typeof userLessonProgress.$inferInsert;

/**
 * User Puzzle Attempts
 * Tracks attempts and scores for logic puzzles
 */
export const userPuzzleAttempts = mysqlTable("user_puzzle_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  puzzleId: int("puzzleId").notNull(),
  status: mysqlEnum("status", ["attempted", "solved", "abandoned"]).notNull(),
  userSolution: text("userSolution"),
  isCorrect: boolean("isCorrect").default(false).notNull(),
  score: int("score").default(0).notNull(),
  timeSpent: int("timeSpent"), // seconds
  hintsUsed: int("hintsUsed").default(0).notNull(),
  attemptNumber: int("attemptNumber").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserPuzzleAttempt = typeof userPuzzleAttempts.$inferSelect;
export type InsertUserPuzzleAttempt = typeof userPuzzleAttempts.$inferInsert;

/**
 * Certifications: Proof of course completion
 * Includes certificate metadata and verification tokens
 */
export const certifications = mysqlTable("certifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  certificateNumber: varchar("certificateNumber", { length: 64 }).notNull().unique(),
  verificationToken: varchar("verificationToken", { length: 128 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // null = no expiration
  pdfUrl: varchar("pdfUrl", { length: 512 }),
  status: mysqlEnum("status", ["active", "revoked", "expired"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;

/**
 * User Achievements & Badges
 * Gamification: badges for milestones and achievements
 */
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeType: mysqlEnum("badgeType", [
    "first_course",
    "three_courses",
    "five_courses",
    "puzzle_master",
    "perfect_score",
    "speed_learner",
    "community_contributor",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  iconUrl: varchar("iconUrl", { length: 512 }),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * Course Reviews & Ratings
 * User feedback on courses
 */
export const courseReviews = mysqlTable("course_reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  review: text("review"),
  isVerified: boolean("isVerified").default(false).notNull(), // User completed course
  helpfulCount: int("helpfulCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CourseReview = typeof courseReviews.$inferSelect;
export type InsertCourseReview = typeof courseReviews.$inferInsert;

