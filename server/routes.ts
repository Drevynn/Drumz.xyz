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

      const { genre, bpm, style } = parseResult.data;

      const generation = await storage.createDrumGeneration({
        genre,
        bpm,
        style: style || null,
        audioUrl: null,
        status: "generating",
      });

      try {
        const apiKey = process.env.ARTIFICIAL_STUDIO_API_KEY;
        
        if (!apiKey) {
          const demoGeneration = await storage.updateDrumGeneration(generation.id, {
            status: "completed",
            audioUrl: getDemoAudioUrl(genre),
          });
          return res.json(demoGeneration);
        }

        const prompt = buildPrompt(genre, bpm, style);
        
        const response = await fetch("https://api.artificialstudio.ai/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "drum-generator",
            input: {
              prompt,
              seed: "-1",
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Artificial Studio API error:", errorText);
          
          const demoGeneration = await storage.updateDrumGeneration(generation.id, {
            status: "completed",
            audioUrl: getDemoAudioUrl(genre),
          });
          return res.json(demoGeneration);
        }

        const data = await response.json();
        
        const updatedGeneration = await storage.updateDrumGeneration(generation.id, {
          status: "completed",
          audioUrl: data.output?.audio_url || data.audio_url || getDemoAudioUrl(genre),
        });

        return res.json(updatedGeneration);
      } catch (apiError) {
        console.error("API call failed:", apiError);
        
        const demoGeneration = await storage.updateDrumGeneration(generation.id, {
          status: "completed",
          audioUrl: getDemoAudioUrl(genre),
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

function buildPrompt(genre: string, bpm: number, style?: string): string {
  const genrePrompts: Record<string, string> = {
    rock: "classic rock drum pattern, powerful snare, driving rhythm",
    punk: "fast aggressive punk drums, rapid hi-hats, relentless energy",
    jazz: "jazz swing drums, brush patterns, syncopated rhythms",
    "blast-beats": "extreme metal blast beats, double bass, intense speed",
    reggae: "reggae drums, one drop pattern, off-beat emphasis",
    funk: "funky drums, tight groove, ghost notes, syncopation",
    "hip-hop": "hip hop boom bap drums, hard snare, deep kick",
    latin: "latin percussion, clave rhythm, congas and timbales feel",
    trap: "trap drums, 808 kicks, rapid hi-hats, rolling patterns",
  };

  let prompt = genrePrompts[genre] || `${genre} style drums`;
  prompt += `, ${bpm} BPM`;
  
  if (style) {
    prompt += `, ${style}`;
  }

  return prompt;
}

function getDemoAudioUrl(genre: string): string {
  const demoUrls: Record<string, string> = {
    rock: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    punk: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    jazz: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "blast-beats": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    reggae: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    funk: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "hip-hop": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    latin: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    trap: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  };
  return demoUrls[genre] || demoUrls.rock;
}
