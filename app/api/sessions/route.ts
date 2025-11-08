import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionsTable } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { notes, suggestedDoctors, selectedAgentId } = await req.json();

    if (!notes || !suggestedDoctors) {
      return NextResponse.json(
        { error: "Missing required fields: notes and suggestedDoctors" },
        { status: 400 }
      );
    }

    // Get user ID from database (assuming you have a way to map Clerk userId to your database userId)
    // For now, I'll use a simple approach - you might need to adjust this based on your user management
    // In a real app, you'd query the users table to find the user by their Clerk ID
    const dbUserId = 1; // This should be the actual user ID from your users table
    
    // Generate unique chat ID
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log("Creating session for user:", dbUserId, "with notes:", notes, "chatId:", chatId);

    // Initialize conversation with system message
    const initialConversation = [
      {
        role: "system",
        message: "Medical consultation session started",
        timestamp: new Date().toISOString()
      },
      {
        role: "user", 
        message: notes,
        timestamp: new Date().toISOString()
      }
    ];

    // Save session to database
    const newSession = await db.insert(sessionsTable).values({
      chatId: chatId,
      createdBy: dbUserId,
      notes: notes,
      agentId: selectedAgentId || null,
      conversation: initialConversation, // Store as JSON object, not string
      status: 'active'
    }).returning();

    console.log("Session saved:", newSession);

    return NextResponse.json({ 
      success: true, 
      sessionId: newSession[0].id,
      chatId: chatId,
      message: "Session created successfully" 
    });

  } catch (err) {
    console.error("Error saving session:", err);
    return NextResponse.json(
      { 
        error: "Failed to save session",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get user's sessions
    const dbUserId = 1; // This should be the actual user ID from your users table
    
    const sessions = await db.select().from(sessionsTable)
      .where(eq(sessionsTable.createdBy, dbUserId))
      .orderBy(desc(sessionsTable.createdOn));

    return NextResponse.json({ sessions });

  } catch (err) {
    console.error("Error fetching sessions:", err);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
