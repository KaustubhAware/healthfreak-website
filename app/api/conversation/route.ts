import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { conversationsTable } from "@/config/schema";

export async function POST(req: Request) {
  try {
    const { chatId, sender, message } = await req.json();

    if (!chatId || !sender || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.insert(conversationsTable).values({
      chatId,
      sender,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving conversation:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
