ALTER TABLE "conversations" DROP CONSTRAINT "conversations_sessionId_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "chatId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_chatId_sessions_chatId_fk" FOREIGN KEY ("chatId") REFERENCES "public"."sessions"("chatId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "sessionId";