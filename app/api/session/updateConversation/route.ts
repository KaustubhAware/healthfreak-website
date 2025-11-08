import { db } from "@/config/db";
import { sessionsTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { sessionId, newMessage } = await req.json();

    if (!sessionId || !newMessage) {
      return Response.json({ error: "Missing required data" }, { status: 400 });
    }

    // ✅ Find existing session by chatId
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.chatId, sessionId))
      .limit(1);

    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // ✅ Merge the new message
    const oldConversation = Array.isArray(session.conversation)
      ? session.conversation
      : [];
    const updatedConversation = [...oldConversation, newMessage];

    // ✅ Update DB
    await db
      .update(sessionsTable)
      .set({ conversation: updatedConversation })
      .where(eq(sessionsTable.chatId, sessionId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return Response.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}
