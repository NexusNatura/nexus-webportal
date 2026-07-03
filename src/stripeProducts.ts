/**
 * Centralized Stripe product catalogue for Nexus-OS DataMarketplace.
 *
 * Prices are in SEK (öre). Stripe requires integer amounts.
 *   450 SEK = 45000 öre
 *
 * In test mode we create the price dynamically via the API so no
 * pre-configured price IDs are needed.
 */

export interface DppDataPackage {
  /** Unique key used as Stripe price lookup_key */
  key: string;
  name: string;
  description: string;
  /** Price in SEK */
  priceSek: number;
  /** Revenue share kept by seller (0–1) */
  sellerShare: number;
}

export const DPP_PACKAGES: DppDataPackage[] = [
  {
    key: "dpp_starter",
    name: "DPP Startpaket",
    description: "Grundläggande LCA-data: COâ‚‚-fotavtryck, materialsammansättning, certifieringar",
    priceSek: 450,
    sellerShare: 0.7,
  },
  {
    key: "dpp_professional",
    name: "DPP Professionellt paket",
    description: "Fullständig LCA-analys: Scope 1–3, reparerbarhetsindex, end-of-life-data, API-åtkomst",
    priceSek: 1200,
    sellerShare: 0.7,
  },
  {
    key: "dpp_enterprise",
    name: "DPP Enterprise-licens",
    description: "Obegränsad åtkomst till en leverantörs hela DPP-portfölj, inklusive rådata och JSON-LD",
    priceSek: 3500,
    sellerShare: 0.8,
  },
];

/** Subscription tiers (monthly) */
export const SUBSCRIPTION_PLANS = [
  {
    key: "plan_starter",
    name: "Starter",
    priceSek: 299,
    description: "Skapa och förvalta upp till 5 DPP",
  },
  {
    key: "plan_professional",
    name: "Professional",
    priceSek: 999,
    description: "Obegränsade DPP + datamarknadsplats-listning",
  },
];

