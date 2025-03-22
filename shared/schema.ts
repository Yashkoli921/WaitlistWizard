import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  profession: text("profession"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  joinedWaitlist: boolean("joined_waitlist").default(true),
});

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profession: text("profession"),
  agreeToUpdates: boolean("agree_to_updates").default(false),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // basic, financial, scientific, graphing
  input: text("input").notNull(),
  result: text("result").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  profession: true,
  firstName: true,
  lastName: true,
  joinedWaitlist: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
  firstName: true,
  lastName: true,
  profession: true,
  agreeToUpdates: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  userId: true,
  type: true,
  input: true,
  result: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
