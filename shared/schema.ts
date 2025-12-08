import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const drumGenerations = pgTable("drum_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  bpm: integer("bpm"),
  audioUrl: text("audio_url"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDrumGenerationSchema = createInsertSchema(drumGenerations).omit({
  id: true,
  createdAt: true,
});

export type InsertDrumGeneration = z.infer<typeof insertDrumGenerationSchema>;
export type DrumGeneration = typeof drumGenerations.$inferSelect;

export const generateDrumRequestSchema = z.object({
  prompt: z.string().min(1, "Please describe what drums you want"),
  bpm: z.number().min(60).max(220).optional(),
});

export type GenerateDrumRequest = z.infer<typeof generateDrumRequestSchema>;
