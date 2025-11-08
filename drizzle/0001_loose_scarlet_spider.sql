CREATE TABLE "ambulance_requests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ambulance_requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"contact" varchar(20) NOT NULL,
	"reason" varchar(255) NOT NULL,
	"latitude" varchar(100) NOT NULL,
	"longitude" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "conversations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sessionId" integer NOT NULL,
	"sender" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_tracker" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "health_tracker_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userEmail" varchar(255) NOT NULL,
	"bloodPressure" integer NOT NULL,
	"sugar" integer NOT NULL,
	"heartRate" integer NOT NULL,
	"weight" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sos_alerts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sos_alerts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userEmail" varchar(255) NOT NULL,
	"emergencyType" varchar(100) NOT NULL,
	"latitude" varchar(100) NOT NULL,
	"longitude" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'Pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "chatId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "createdBy" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "createdOn" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "agentId" integer;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "conversation" json;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "finalReport" json;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "suggestedDoctors";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "createdAt";