import { db } from "@/config/db";
import { healthTrackerTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const body = await req.json();
    const { bloodPressure, sugar, heartRate, weight } = body;

    const userEmail = user.primaryEmailAddress?.emailAddress ?? "unknown";

    const result = await db
      .insert(healthTrackerTable)
      .values({
        userEmail,
        bloodPressure,
        sugar,
        heartRate,
        weight,
      })
      .returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await db.select().from(healthTrackerTable);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
