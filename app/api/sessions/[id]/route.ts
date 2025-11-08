import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionsTable } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET - Retrieve a specific session with JSON conversation data
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const sessionId = parseInt(params.id);
    const dbUserId = 1; // This should be the actual user ID from your users table

    // Get session with JSON conversation data
    const session = await db.select().from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // With JSON format, we can easily access conversation data
    const conversationData = session[0].conversation;
    const finalReportData = session[0].finalReport;

    return NextResponse.json({ 
      session: session[0],
      conversationCount: conversationData ? conversationData.length : 0,
      hasFinalReport: !!finalReportData
    });

  } catch (err) {
    console.error("Error fetching session:", err);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PUT - Update session conversation (demonstrates JSON benefits)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const sessionId = parseInt(params.id);
    const { message, role = "user" } = await req.json();

    // Get current session
    const currentSession = await db.select().from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId))
      .limit(1);

    if (currentSession.length === 0) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Add new message to conversation (JSON format makes this easy)
    const currentConversation = currentSession[0].conversation || [];
    const updatedConversation = [
      ...currentConversation,
      {
        role,
        message,
        timestamp: new Date().toISOString()
      }
    ];

    // Update session with new conversation
    const updatedSession = await db.update(sessionsTable)
      .set({ 
        conversation: updatedConversation,
        updatedAt: new Date()
      })
      .where(eq(sessionsTable.id, sessionId))
      .returning();

    return NextResponse.json({ 
      success: true,
      message: "Conversation updated successfully",
      conversationLength: updatedConversation.length
    });

  } catch (err) {
    console.error("Error updating session:", err);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
