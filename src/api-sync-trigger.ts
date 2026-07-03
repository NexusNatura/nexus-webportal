/**
 * /api/sync/trigger
 *
 * Skyddat API-endpoint som triggar den nattliga synkroniseringen.
 * Anropas av GitHub Actions (nightly-sync.yml) med en Bearer-token.
 *
 * Placera denna fil i: app/api/sync/trigger/route.ts  (Next.js App Router)
 * ELLER i:             pages/api/sync/trigger.ts      (Pages Router)
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runDailySync } from "@/server/scheduled-sync";

// â”€â”€â”€ Säkerhetskontroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === process.env.SYNC_SECRET_KEY;
}

// â”€â”€â”€ Handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function POST(request: NextRequest) {
  // 1. Kontrollera att anropet är auktoriserat
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Förhindra att Vercel timear ut – streama ett tidigt svar
  //    (Vercel Hobby har 10s timeout, Pro har 60s – sätt maxDuration i vercel.json)
  console.log("[Sync Trigger] Auktoriserad begäran mottagen");

  const startTime = Date.now();

  try {
    // 3. Kör synken
    const results = await runDailySync();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`[Sync Trigger] Slutförd på ${duration}s`, results);

    return NextResponse.json(
      {
        success: true,
        duration: `${duration}s`,
        timestamp: new Date().toISOString(),
        ...results,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Okänt fel";
    console.error("[Sync Trigger] Fel:", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Blockera GET-anrop
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

