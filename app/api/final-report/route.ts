import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionsTable, conversationsTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    // 1️⃣ Fetch all conversation messages for the session
    const messages = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.chatId, chatId));

    if (!messages.length) {
      return NextResponse.json({ error: "No conversation found" }, { status: 404 });
    }

    // 2️⃣ Format conversation text for the AI
    const conversationText = messages
      .map((msg) => `${msg.sender.toUpperCase()}: ${msg.message}`)
      .join("\n");

    // 3️⃣ Ask GPT to summarize the consultation
    const prompt = `
    You are a medical assistant AI.
    Analyze this consultation conversation and create a structured medical summary.
    
    Conversation:
    ${conversationText}

    Return JSON with:
    {
      "summary": "Brief overview of the patient's condition",
      "symptoms": ["list of detected symptoms"],
      "possibleCauses": ["list of likely causes"],
      "recommendations": ["list of suggestions or next steps"]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.3,
    });

    const rawOutput = completion.choices[0]?.message?.content || "{}";

    let report;
    try {
      report = JSON.parse(rawOutput);
    } catch {
      report = { summary: rawOutput };
    }

    // 4️⃣ Save to the session table
    await db
      .update(sessionsTable)
      .set({ finalReport: report })
      .where(eq(sessionsTable.chatId, chatId));

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Error generating final report:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
