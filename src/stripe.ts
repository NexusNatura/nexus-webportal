/**
 * Stripe singleton â€“ server-side only.
 * Import this file from tRPC procedures and webhook handlers.
 */
import Stripe from "stripe";
import { ENV } from "./env";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!ENV.stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(ENV.stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

