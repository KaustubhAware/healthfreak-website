-- Add new columns to sessions table
ALTER TABLE "sessions" ADD COLUMN "chatId" varchar(255) NOT NULL;
ALTER TABLE "sessions" ADD COLUMN "agentId" integer;
ALTER TABLE "sessions" ADD COLUMN "conversation" text;
ALTER TABLE "sessions" ADD COLUMN "finalReport" text;

-- Rename userId to createdBy
ALTER TABLE "sessions" RENAME COLUMN "userId" TO "createdBy";

-- Rename createdAt to createdOn  
ALTER TABLE "sessions" RENAME COLUMN "createdAt" TO "createdOn";

-- Drop the old suggestedDoctors column since we're not using it anymore
ALTER TABLE "sessions" DROP COLUMN "suggestedDoctors";

-- Update the foreign key constraint name
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
