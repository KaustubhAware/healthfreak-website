import { integer, pgTable, varchar, text, timestamp, json } from "drizzle-orm/pg-core";

// 🧠 Users Table
export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  credits: integer("credits"),
});

// 💬 Sessions Table
export const sessionsTable = pgTable("sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  chatId: varchar("chat_id", { length: 255 }).notNull().unique(),
  createdBy: integer("created_by").notNull().references(() => usersTable.id),
  createdOn: timestamp("created_on").notNull().defaultNow(),
  notes: text("notes").notNull(),
  agentId: integer("agent_id"),
  conversation: json("conversation").default([]).notNull(),
  finalReport: json("final_report"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 🩺 Health Tracker Table
export const healthTrackerTable = pgTable("health_tracker", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  bloodPressure: integer("blood_pressure").notNull(),
  sugar: integer("sugar").notNull(),
  heartRate: integer("heart_rate").notNull(),
  weight: integer("weight").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 🚑 Ambulance Requests
export const ambulanceRequestsTable = pgTable("ambulance_requests", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 20 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 100 }).notNull(),
  longitude: varchar("longitude", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 🚨 SOS Alerts
export const sosAlertsTable = pgTable("sos_alerts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  emergencyType: varchar("emergency_type", { length: 100 }).notNull(),
  latitude: varchar("latitude", { length: 100 }).notNull(),
  longitude: varchar("longitude", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("Pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 💬 Conversations Table (fixed)
export const conversationsTable = pgTable("conversations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  chatId: varchar("chat_id", { length: 255 }).notNull(),
  sender: varchar("sender", { length: 50 }).notNull(), // "user" or "ai"
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// 🤖 Chatbot Agents Table
export const chatbotAgentsTable = pgTable("chatbot_agents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }), // e.g. "Cardiology", "Nutrition"
  description: text("description"),
  model: varchar("model", { length: 255 }).notNull().default("gemini-1.5-flash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 💬 Chatbot History Table
export const chatbotHistoryTable = pgTable("chatbot_history", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  agentId: integer("agent_id").references(() => chatbotAgentsTable.id),
  message: text("message").notNull(),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});