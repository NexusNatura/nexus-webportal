/**
 * Centralized Stripe product catalogue for Nexus-OS DataMarketplace.
 *
 * Prices are in SEK (Ã¶re). Stripe requires integer amounts.
 *   450 SEK = 45000 Ã¶re
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
  /** Revenue share kept by seller (0â€“1) */
  sellerShare: number;
}

export const DPP_PACKAGES: DppDataPackage[] = [
  {
    key: "dpp_starter",
    name: "DPP Startpaket",
    description: "GrundlÃ¤ggande LCA-data: COâ‚‚-fotavtryck, materialsammansÃ¤ttning, certifieringar",
    priceSek: 450,
    sellerShare: 0.7,
  },
  {
    key: "dpp_professional",
    name: "DPP Professionellt paket",
    description: "FullstÃ¤ndig LCA-analys: Scope 1â€“3, reparerbarhetsindex, end-of-life-data, API-Ã¥tkomst",
    priceSek: 1200,
    sellerShare: 0.7,
  },
  {
    key: "dpp_enterprise",
    name: "DPP Enterprise-licens",
    description: "ObegrÃ¤nsad Ã¥tkomst till en leverantÃ¶rs hela DPP-portfÃ¶lj, inklusive rÃ¥data och JSON-LD",
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
    description: "Skapa och fÃ¶rvalta upp till 5 DPP",
  },
  {
    key: "plan_professional",
    name: "Professional",
    priceSek: 999,
    description: "ObegrÃ¤nsade DPP + datamarknadsplats-listning",
  },
];

