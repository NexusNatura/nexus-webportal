import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // â”€â”€ Stripe webhook MUST be registered before express.json() â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Raw body is required for Stripe signature verification.
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      if (!sig || !ENV.stripeWebhookSecret) {
        res.status(400).json({ error: "Missing signature or webhook secret" });
        return;
      }
      let event: import("stripe").Stripe.Event;
      try {
        const { getStripe } = await import("./stripe");
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.stripeWebhookSecret);
      } catch (err) {
        console.error("[Webhook] Signature verification failed:", err);
        res.status(400).json({ error: "Webhook signature verification failed" });
        return;
      }
      // Test event passthrough (required for Stripe test verification)
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }
      console.log(`[Webhook] Event: ${event.type} | ${event.id}`);
      // Fulfillment: mark purchase as paid
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        const purchaseId = session.metadata?.purchase_id;
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent as { id?: string } | null)?.id;
        if (purchaseId) {
          try {
            const { getDb } = await import("../db");
            const { marketplacePurchases } = await import("../../drizzle/schema");
            const { eq } = await import("drizzle-orm");
            const db = await getDb();
            if (db) {
              await db
                .update(marketplacePurchases)
                .set({ status: "paid", paidAt: new Date(), stripePaymentIntentId: paymentIntentId ?? null })
                .where(eq(marketplacePurchases.id, parseInt(purchaseId, 10)));
              console.log(`[Webhook] Purchase ${purchaseId} marked as paid`);
            }
          } catch (err) {
            console.error("[Webhook] Failed to update purchase:", err);
          }
        }

        // â”€â”€ Subscription fulfillment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const subscriptionId = session.metadata?.subscription_id;
        const metaType = session.metadata?.type;
        if (subscriptionId && metaType === "subscription") {
          try {
            const { getDb: getDbSub } = await import("../db");
            const { userSubscriptions } = await import("../../drizzle/schema");
            const { eq: eqSub } = await import("drizzle-orm");
            const dbSub = await getDbSub();
            if (dbSub) {
              const now = Date.now();
              const thirtyDays = 30 * 24 * 60 * 60 * 1000;
              await dbSub
                .update(userSubscriptions)
                .set({
                  status: "active",
                  startedAt: now,
                  currentPeriodEnd: now + thirtyDays,
                  stripePaymentIntentId: paymentIntentId ?? null,
                })
                .where(eqSub(userSubscriptions.id, parseInt(subscriptionId, 10)));
              console.log(`[Webhook] Subscription ${subscriptionId} activated`);
            }
          } catch (err) {
            console.error("[Webhook] Failed to activate subscription:", err);
          }
        }

        // â”€â”€ DPP fulfillment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const dppId = session.metadata?.dpp_id;
        if (dppId) {
          try {
            const { getDb: getDbDpp } = await import("../db");
            const { dppPassports } = await import("../../drizzle/schema");
            const { eq: eqDpp } = await import("drizzle-orm");
            const dbDpp = await getDbDpp();
            if (dbDpp) {
              const nowSec = Math.floor(Date.now() / 1000);
              await dbDpp
                .update(dppPassports)
                .set({ paid: true, status: "active", stripePaymentIntentId: paymentIntentId ?? null, updatedAt: nowSec })
                .where(eqDpp(dppPassports.dppId, dppId));
              console.log(`[Webhook] DPP ${dppId} marked as paid`);
            }
          } catch (err) {
            console.error("[Webhook] Failed to update DPP:", err);
          }
        }
      }
      res.json({ received: true });
    }
  );

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

