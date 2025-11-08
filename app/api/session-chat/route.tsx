import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionsTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Get sessionId from query params
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "No sessionId provided" }, { status: 400 });
    }

    console.log("Fetching sessionId:", sessionId);

    // 2️⃣ Query the session from DB
    const session = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, parseInt(sessionId)));

    if (!session.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    console.log("Session found:", session[0]);

    // 3️⃣ Return session details
    return NextResponse.json(session[0]);
  } catch (err) {
    console.error("Error fetching session:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
