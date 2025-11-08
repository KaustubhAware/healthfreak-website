import { db } from "@/config/db";
import { sosAlertsTable } from "@/config/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userEmail, emergencyType, latitude, longitude } = await req.json();

    if (!userEmail || !latitude || !longitude) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(sosAlertsTable).values({
      userEmail,
      emergencyType: emergencyType || "Unknown",
      latitude,
      longitude,
    });

    return NextResponse.json({ success: true, message: "SOS alert saved successfully" });
  } catch (err) {
    console.error("Error saving SOS alert:", err);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
