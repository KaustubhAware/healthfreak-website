import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { chatbotHistoryTable } from "@/config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // ✅ Correct new model format
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    // ✅ Correct API call format for v1
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply = result.response.text();

    await db.insert(chatbotHistoryTable).values({
      userId,
      message,
      response: reply,
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
