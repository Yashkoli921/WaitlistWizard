import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  plan: text("plan").notNull(),
  consentToUpdates: boolean("consent_to_updates").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  firstName: true,
  lastName: true,
  email: true,
  plan: true,
  consentToUpdates: true,
});

export const calculationHistory = pgTable("calculation_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  calculationType: text("calculation_type").notNull(),
  input: text("input").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalculationHistorySchema = createInsertSchema(calculationHistory).pick({
  userId: true,
  calculationType: true,
  input: true,
  result: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export type InsertCalculationHistory = z.infer<typeof insertCalculationHistorySchema>;
export type CalculationHistory = typeof calculationHistory.$inferSelect;
