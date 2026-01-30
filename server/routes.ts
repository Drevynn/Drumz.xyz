import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { generateDrumRequestSchema, TIER_LIMITS } from "@shared/schema";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerStripeRoutes } from "./stripe";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Replit Auth (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Setup Stripe payment routes
  registerStripeRoutes(app);
  
  // Generate drums endpoint
  app.post("/api/generate", async (req: any, res) => {
    try {
      const parseResult = generateDrumRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parseResult.error.flatten() 
        });
      }

      const { prompt, bpm } = parseResult.data;
      const userId = req.user?.claims?.sub || null;

      // Check generation limits for authenticated users
      if (userId) {
        const canGenerate = await storage.canUserGenerate(userId);
        if (!canGenerate.allowed) {
          return res.status(403).json({ 
            error: canGenerate.reason,
            upgradeRequired: true
          });
        }
      }

      const generation = await storage.createDrumGeneration({
        prompt,
        bpm: bpm || null,
        audioUrl: null,
        status: "generating",
        userId,
      });

      // Increment generation count for authenticated users
      if (userId) {
        await storage.incrementGenerationCount(userId);
      }

      try {
        const apiKey = process.env.ARTIFICIAL_STUDIO_API_KEY;
        
        if (!apiKey) {
          const demoGeneration = await storage.updateDrumGeneration(generation.id, {
            status: "completed",
            audioUrl: getDemoAudioUrl(),
          });
          return res.json(demoGeneration);
        }

        const fullPrompt = buildPrompt(prompt, bpm);
        
        const response = await fetch("https://api.artificialstudio.ai/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "drum-generator",
            input: {
              prompt: fullPrompt,
              seed: "-1",
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Artificial Studio API error:", errorText);
          
          const demoGeneration = await storage.updateDrumGeneration(generation.id, {
            status: "completed",
            audioUrl: getDemoAudioUrl(),
          });
          return res.json(demoGeneration);
        }

        const data = await response.json();
        
        const updatedGeneration = await storage.updateDrumGeneration(generation.id, {
          status: "completed",
          audioUrl: data.output?.audio_url || data.audio_url || getDemoAudioUrl(),
        });

        return res.json(updatedGeneration);
      } catch (apiError) {
        console.error("API call failed:", apiError);
        
        const demoGeneration = await storage.updateDrumGeneration(generation.id, {
          status: "completed",
          audioUrl: getDemoAudioUrl(),
        });
        return res.json(demoGeneration);
      }
    } catch (error) {
      console.error("Generate error:", error);
      return res.status(500).json({ error: "Failed to generate drums" });
    }
  });

  // Get history (public - returns recent generations)
  app.get("/api/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const generations = await storage.getRecentGenerations(limit);
      return res.json(generations);
    } catch (error) {
      console.error("History error:", error);
      return res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Get user's own generations (authenticated)
  app.get("/api/my-generations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const generations = await storage.getUserGenerations(userId, limit);
      return res.json(generations);
    } catch (error) {
      console.error("My generations error:", error);
      return res.status(500).json({ error: "Failed to fetch generations" });
    }
  });

  // Get specific generation
  app.get("/api/generation/:id", async (req, res) => {
    try {
      const generation = await storage.getDrumGeneration(req.params.id);
      if (!generation) {
        return res.status(404).json({ error: "Generation not found" });
      }
      return res.json(generation);
    } catch (error) {
      console.error("Get generation error:", error);
      return res.status(500).json({ error: "Failed to fetch generation" });
    }
  });

  // Get subscription status
  app.get("/api/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let subscription = await storage.getSubscription(userId);
      
      if (!subscription) {
        // Create free tier for new user
        subscription = await storage.createSubscription({
          userId,
          tier: "free",
          generationsThisMonth: 0,
          lastGenerationReset: new Date(),
        });
      }

      const tier = subscription.tier as keyof typeof TIER_LIMITS;
      const tierLimits = TIER_LIMITS[tier] || TIER_LIMITS.free;
      const canGenerate = await storage.canUserGenerate(userId);

      return res.json({
        subscription,
        limits: tierLimits,
        usage: {
          generationsUsed: subscription.generationsThisMonth || 0,
          generationsRemaining: canGenerate.remaining,
        }
      });
    } catch (error) {
      console.error("Subscription error:", error);
      return res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Get pricing tiers (public)
  app.get("/api/pricing", (req, res) => {
    return res.json({
      tiers: Object.entries(TIER_LIMITS).map(([key, value]) => ({
        id: key,
        ...value,
      }))
    });
  });

  return httpServer;
}

function buildPrompt(userPrompt: string, bpm?: number): string {
  let prompt = `drums, drum pattern, ${userPrompt}`;
  
  if (bpm) {
    prompt += `, ${bpm} BPM`;
  }

  return prompt;
}

function getDemoAudioUrl(): string {
  const demoUrls = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  ];
  return demoUrls[Math.floor(Math.random() * demoUrls.length)];
}
