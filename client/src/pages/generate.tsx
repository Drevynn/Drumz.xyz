import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DrumGenerator } from "@/components/drum-generator";
import { GenerationHistory } from "@/components/generation-history";
import { AudioPlayer } from "@/components/audio-player";
import type { DrumGeneration } from "@shared/schema";

export default function GeneratePage() {
  const [selectedGeneration, setSelectedGeneration] = useState<DrumGeneration | null>(null);

  const handlePlayGeneration = (generation: DrumGeneration) => {
    setSelectedGeneration(generation);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Generate Drums
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create custom AI-powered drum tracks in seconds
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <DrumGenerator onGenerationComplete={handlePlayGeneration} />
              
              {selectedGeneration && selectedGeneration.audioUrl && (
                <div>
                  <h2 className="font-display text-lg font-semibold mb-4">
                    Now Playing
                  </h2>
                  <AudioPlayer
                    audioUrl={selectedGeneration.audioUrl}
                    genre={selectedGeneration.genre}
                    bpm={selectedGeneration.bpm}
                  />
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <GenerationHistory onPlayGeneration={handlePlayGeneration} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
