import { useState } from "react";
import { ArrowLeft, Mic } from "lucide-react";
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
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold md:text-4xl">
                  Voice-Powered Drums
                </h1>
                <p className="text-muted-foreground">
                  Just say what you need - we'll create it
                </p>
              </div>
            </div>
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
                    title={selectedGeneration.prompt}
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
