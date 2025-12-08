import { type User, type InsertUser, type DrumGeneration, type InsertDrumGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createDrumGeneration(generation: InsertDrumGeneration): Promise<DrumGeneration>;
  updateDrumGeneration(id: string, updates: Partial<DrumGeneration>): Promise<DrumGeneration | undefined>;
  getDrumGeneration(id: string): Promise<DrumGeneration | undefined>;
  getRecentGenerations(limit?: number): Promise<DrumGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private drumGenerations: Map<string, DrumGeneration>;

  constructor() {
    this.users = new Map();
    this.drumGenerations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDrumGeneration(insertGeneration: InsertDrumGeneration): Promise<DrumGeneration> {
    const id = randomUUID();
    const generation: DrumGeneration = {
      id,
      genre: insertGeneration.genre,
      bpm: insertGeneration.bpm,
      style: insertGeneration.style || null,
      audioUrl: insertGeneration.audioUrl || null,
      status: insertGeneration.status || "pending",
      createdAt: new Date(),
    };
    this.drumGenerations.set(id, generation);
    return generation;
  }

  async updateDrumGeneration(id: string, updates: Partial<DrumGeneration>): Promise<DrumGeneration | undefined> {
    const existing = this.drumGenerations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.drumGenerations.set(id, updated);
    return updated;
  }

  async getDrumGeneration(id: string): Promise<DrumGeneration | undefined> {
    return this.drumGenerations.get(id);
  }

  async getRecentGenerations(limit: number = 10): Promise<DrumGeneration[]> {
    const all = Array.from(this.drumGenerations.values());
    return all
      .filter((g) => g.status === "completed" && g.audioUrl)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
