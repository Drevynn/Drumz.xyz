import { 
  type DrumGeneration, 
  type InsertDrumGeneration,
  type Subscription,
  type InsertSubscription,
  drumGenerations,
  subscriptions,
  TIER_LIMITS
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";

export interface IStorage {
  // Drum generations
  createDrumGeneration(generation: InsertDrumGeneration): Promise<DrumGeneration>;
  updateDrumGeneration(id: string, updates: Partial<DrumGeneration>): Promise<DrumGeneration | undefined>;
  getDrumGeneration(id: string): Promise<DrumGeneration | undefined>;
  getRecentGenerations(limit?: number): Promise<DrumGeneration[]>;
  getUserGenerations(userId: string, limit?: number): Promise<DrumGeneration[]>;
  
  // Subscriptions
  getSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(userId: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  incrementGenerationCount(userId: string): Promise<void>;
  canUserGenerate(userId: string): Promise<{ allowed: boolean; reason?: string; remaining?: number }>;
}

export class DatabaseStorage implements IStorage {
  // Drum generations
  async createDrumGeneration(insertGeneration: InsertDrumGeneration): Promise<DrumGeneration> {
    const [generation] = await db
      .insert(drumGenerations)
      .values(insertGeneration)
      .returning();
    return generation;
  }

  async updateDrumGeneration(id: string, updates: Partial<DrumGeneration>): Promise<DrumGeneration | undefined> {
    const [generation] = await db
      .update(drumGenerations)
      .set(updates)
      .where(eq(drumGenerations.id, id))
      .returning();
    return generation;
  }

  async getDrumGeneration(id: string): Promise<DrumGeneration | undefined> {
    const [generation] = await db
      .select()
      .from(drumGenerations)
      .where(eq(drumGenerations.id, id));
    return generation;
  }

  async getRecentGenerations(limit: number = 10): Promise<DrumGeneration[]> {
    return db
      .select()
      .from(drumGenerations)
      .where(eq(drumGenerations.status, "completed"))
      .orderBy(desc(drumGenerations.createdAt))
      .limit(limit);
  }

  async getUserGenerations(userId: string, limit: number = 50): Promise<DrumGeneration[]> {
    return db
      .select()
      .from(drumGenerations)
      .where(eq(drumGenerations.userId, userId))
      .orderBy(desc(drumGenerations.createdAt))
      .limit(limit);
  }

  // Subscriptions
  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return subscription;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async updateSubscription(userId: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.userId, userId))
      .returning();
    return subscription;
  }

  async incrementGenerationCount(userId: string): Promise<void> {
    let subscription = await this.getSubscription(userId);
    
    if (!subscription) {
      // Create free tier subscription for new users
      subscription = await this.createSubscription({
        userId,
        tier: "free",
        generationsThisMonth: 1,
        lastGenerationReset: new Date(),
      });
      return;
    }

    // Check if we need to reset monthly count
    const now = new Date();
    const lastReset = subscription.lastGenerationReset || new Date(0);
    const monthsSinceReset = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                             (now.getMonth() - lastReset.getMonth());
    
    if (monthsSinceReset >= 1) {
      await this.updateSubscription(userId, {
        generationsThisMonth: 1,
        lastGenerationReset: now,
      });
    } else {
      await this.updateSubscription(userId, {
        generationsThisMonth: (subscription.generationsThisMonth || 0) + 1,
      });
    }
  }

  async canUserGenerate(userId: string): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
    let subscription = await this.getSubscription(userId);
    
    if (!subscription) {
      // New user gets free tier
      const tierLimits = TIER_LIMITS.free;
      return { 
        allowed: true, 
        remaining: tierLimits.generationsPerMonth 
      };
    }

    const tier = subscription.tier as keyof typeof TIER_LIMITS;
    const tierLimits = TIER_LIMITS[tier] || TIER_LIMITS.free;
    
    // Premium has unlimited generations
    if (tierLimits.generationsPerMonth === -1) {
      return { allowed: true, remaining: -1 };
    }

    // Check if we need to reset monthly count
    const now = new Date();
    const lastReset = subscription.lastGenerationReset || new Date(0);
    const monthsSinceReset = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                             (now.getMonth() - lastReset.getMonth());
    
    const currentCount = monthsSinceReset >= 1 ? 0 : (subscription.generationsThisMonth || 0);
    const remaining = tierLimits.generationsPerMonth - currentCount;
    
    if (remaining <= 0) {
      return { 
        allowed: false, 
        reason: `You've reached your monthly limit of ${tierLimits.generationsPerMonth} generations. Upgrade to get more!`,
        remaining: 0
      };
    }

    return { allowed: true, remaining };
  }
}

export const storage = new DatabaseStorage();
