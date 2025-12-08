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

// Drum generation schema
export const drumGenerations = pgTable("drum_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  genre: text("genre").notNull(),
  bpm: integer("bpm").notNull(),
  style: text("style"),
  audioUrl: text("audio_url"),
  status: text("status").notNull().default("pending"), // pending, generating, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDrumGenerationSchema = createInsertSchema(drumGenerations).omit({
  id: true,
  createdAt: true,
});

export type InsertDrumGeneration = z.infer<typeof insertDrumGenerationSchema>;
export type DrumGeneration = typeof drumGenerations.$inferSelect;

// Genre definitions with metadata
export const GENRES = [
  { id: "rock", name: "Rock", defaultBpm: 120, icon: "guitar" },
  { id: "punk", name: "Punk", defaultBpm: 180, icon: "zap" },
  { id: "jazz", name: "Jazz", defaultBpm: 140, icon: "music" },
  { id: "blast-beats", name: "Blast Beats", defaultBpm: 220, icon: "flame" },
  { id: "reggae", name: "Reggae", defaultBpm: 90, icon: "palmtree" },
  { id: "funk", name: "Funk", defaultBpm: 100, icon: "sparkles" },
  { id: "hip-hop", name: "Hip Hop", defaultBpm: 85, icon: "headphones" },
  { id: "latin", name: "Latin", defaultBpm: 120, icon: "sun" },
  { id: "trap", name: "Trap", defaultBpm: 140, icon: "volume2" },
] as const;

export type Genre = typeof GENRES[number];

// Request/Response types for API
export const generateDrumRequestSchema = z.object({
  genre: z.string().min(1),
  bpm: z.number().min(60).max(220),
  style: z.string().optional(),
});

export type GenerateDrumRequest = z.infer<typeof generateDrumRequestSchema>;
