import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './src/server/api/root';
import { db } from './src/server/db';
import { ledgerAssets } from './src/server/db/schema';

const app = express();
app.use(cors());
app.use(express.json());

// TRPC Endpoint
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Write to ledger (Serverless DB version)
app.post('/api/ledger', async (req, res) => {
    try {
        const data = req.body;
        const timestamp = new Date().getTime();
        const filename = `web_asset_${timestamp}.json`;
        
        await db.insert(ledgerAssets).values({
            id: String(timestamp),
            filename,
            data: data,
            createdAt: new Date().toISOString()
        });

        console.log(`[Ledger] Web-asset written to DB: ${filename}`);
        res.json({ success: true, message: 'Saved to Serverless Ledger', filename });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Read from ledger (Serverless DB version)
app.get('/api/ledger', async (req, res) => {
    try {
        const assets = await db.select().from(ledgerAssets);
        const entries = assets.map(a => a.data);
        res.json(entries);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// For local development
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL === 'true') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Nexus-OS Backend Server running on port ${PORT}`);
        console.log(`tRPC endpoint at http://localhost:${PORT}/trpc`);
    });
}

// For Vercel Serverless
export default app;
