ALTER TABLE "ambulance_requests" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_chatId_sessions_chatId_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "conversation" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "conversation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "chat_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "health_tracker" ADD COLUMN "user_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "health_tracker" ADD COLUMN "blood_pressure" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "health_tracker" ADD COLUMN "heart_rate" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "health_tracker" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "chat_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "created_on" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "agent_id" integer;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "final_report" json;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sos_alerts" ADD COLUMN "user_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "sos_alerts" ADD COLUMN "emergency_type" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "sos_alerts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "chatId";--> statement-breakpoint
ALTER TABLE "health_tracker" DROP COLUMN "userEmail";--> statement-breakpoint
ALTER TABLE "health_tracker" DROP COLUMN "bloodPressure";--> statement-breakpoint
ALTER TABLE "health_tracker" DROP COLUMN "heartRate";--> statement-breakpoint
ALTER TABLE "health_tracker" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "chatId";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "createdBy";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "createdOn";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "agentId";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "finalReport";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "sos_alerts" DROP COLUMN "userEmail";--> statement-breakpoint
ALTER TABLE "sos_alerts" DROP COLUMN "emergencyType";--> statement-breakpoint
ALTER TABLE "sos_alerts" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_chat_id_unique" UNIQUE("chat_id");