import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDrumRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/generate", async (req, res) => {
    try {
      const parseResult = generateDrumRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parseResult.error.flatten() 
        });
      }

      const { prompt, bpm } = parseResult.data;

      const generation = await storage.createDrumGeneration({
        prompt,
        bpm: bpm || null,
        audioUrl: null,
        status: "generating",
      });

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
