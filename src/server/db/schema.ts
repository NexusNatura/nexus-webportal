import { mysqlTable, text, int, float, boolean, json, varchar } from "drizzle-orm/mysql-core";

export const agents = mysqlTable("agents", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  pricingModel: varchar("pricing_model", { length: 255 }).notNull(),
  pricePerTaskOre: int("price_per_task_ore"),
  priceMonthlyOre: int("price_monthly_ore"),
  riskClass: varchar("risk_class", { length: 255 }).notNull(),
  securityLevel: varchar("security_level", { length: 255 }).notNull(),
  capabilities: json("capabilities").$type<string[]>(),
  benchmarkScore: float("benchmark_score"),
  avgResponseTimeSec: float("avg_response_time_sec"),
  status: varchar("status", { length: 255 }).notNull(),
  isOfficial: boolean("is_official").notNull().default(true),
  purchaseCount: int("purchase_count").notNull().default(0),
  iconName: varchar("icon_name", { length: 255 }).notNull(),
  accentColor: varchar("accent_color", { length: 255 }).notNull(),
  isEnterprise: boolean("is_enterprise").notNull().default(false),
  agentType: varchar("agent_type", { length: 255 }).notNull().default("ai-agent"),
});

export const opportunities = mysqlTable("opportunities", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  amount: varchar("amount", { length: 255 }).notNull(),
  deadline: varchar("deadline", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  tags: json("tags").$type<string[]>(),
  status: varchar("status", { length: 255 }).notNull(),
  description: text("description").notNull(),
});

export const marketplaceListings = mysqlTable("marketplace_listings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  industry: varchar("industry", { length: 255 }).notNull(),
  priceOre: int("price_ore").notNull(),
  dataPoints: int("data_points").notNull(),
  seller: varchar("seller", { length: 255 }).notNull(),
  verification: varchar("verification", { length: 255 }).notNull(),
});

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  readTime: int("read_time").notNull(),
  publishedAt: varchar("published_at", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").notNull().default(false),
});

export const ledgerAssets = mysqlTable("ledger_assets", {
  id: varchar("id", { length: 255 }).primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  data: json("data").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
});

export const salesLeads = mysqlTable("sales_leads", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  selectedPlan: varchar("selected_plan", { length: 255 }).notNull(),
  meetingDate: varchar("meeting_date", { length: 255 }).notNull(),
  meetingTime: varchar("meeting_time", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull().default("NEW"),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
});

export const rules = mysqlTable("rules", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  documentSource: varchar("document_source", { length: 255 }).notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
});

export const requirements = mysqlTable("requirements", {
  id: int("id").primaryKey().autoincrement(),
  ruleId: int("rule_id").notNull(),
  description: text("description").notNull(),
  targetEntity: varchar("target_entity", { length: 255 }).notNull(), // t.ex. "DPP", "Material"
});

export const agentMemory = mysqlTable("agent_memory", {
  id: int("id").primaryKey().autoincrement(),
  agentName: varchar("agent_name", { length: 255 }).notNull(),
  content: text("content").notNull(),
  embedding: json("embedding").notNull(), // Vektor array ex. [0.12, 0.45, ...]
  status: varchar("status", { length: 50 }).default('APPROVED'), // PENDING | APPROVED | REJECTED
  createdAt: varchar("created_at", { length: 255 }).notNull(),
});

export const jobs = mysqlTable("jobs", {
  id: int("id").primaryKey().autoincrement(),
  jobType: varchar("job_type", { length: 255 }).notNull(),
  payload: json("payload").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("PENDING"), // PENDING, PROCESSING, COMPLETED, FAILED
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  completedAt: varchar("completed_at", { length: 255 }),
});

export type Agent = typeof agents.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type SalesLead = typeof salesLeads.$inferSelect;
export type Rule = typeof rules.$inferSelect;
export type Requirement = typeof requirements.$inferSelect;
export type AgentMemory = typeof agentMemory.$inferSelect;
export type Job = typeof jobs.$inferSelect;
