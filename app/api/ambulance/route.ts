import { db } from "@/config/db";
import { ambulanceRequestsTable } from "@/config/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, reason, latitude, longitude } = body;

    if (!name || !contact || !reason || !latitude || !longitude) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(ambulanceRequestsTable).values({
      name,
      contact,
      reason,
      latitude,
      longitude,
    });

    return NextResponse.json({ success: true, message: "Ambulance request saved!" });
  } catch (error) {
    console.error("Error saving ambulance request:", error);
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }
}
