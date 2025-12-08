import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { GENRES, type DrumGeneration } from "@shared/schema";
import { AudioPlayer } from "./audio-player";

interface DrumGeneratorProps {
  onGenerationComplete?: (generation: DrumGeneration) => void;
}

export function DrumGenerator({ onGenerationComplete }: DrumGeneratorProps) {
  const { toast } = useToast();
  const [genre, setGenre] = useState<string>("rock");
  const [bpm, setBpm] = useState<number>(120);
  const [style, setStyle] = useState<string>("");
  const [currentGeneration, setCurrentGeneration] = useState<DrumGeneration | null>(null);

  const selectedGenre = GENRES.find((g) => g.id === genre);

  const generateMutation = useMutation({
    mutationFn: async (data: { genre: string; bpm: number; style?: string }) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response as DrumGeneration;
    },
    onSuccess: (data) => {
      setCurrentGeneration(data);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      onGenerationComplete?.(data);
      toast({
        title: "Beat generated!",
        description: `${selectedGenre?.name || genre} drums at ${bpm} BPM ready to play.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenreChange = (value: string) => {
    setGenre(value);
    const genreData = GENRES.find((g) => g.id === value);
    if (genreData) {
      setBpm(genreData.defaultBpm);
    }
  };

  const handleGenerate = () => {
    generateMutation.mutate({
      genre,
      bpm,
      style: style.trim() || undefined,
    });
  };

  const handleRegenerate = () => {
    if (currentGeneration) {
      generateMutation.mutate({
        genre: currentGeneration.genre,
        bpm: currentGeneration.bpm,
        style: currentGeneration.style || undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="genre" className="text-base font-medium">
              Genre
            </Label>
            <Select value={genre} onValueChange={handleGenreChange}>
              <SelectTrigger className="mt-2" data-testid="select-genre">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g.id} value={g.id} data-testid={`option-genre-${g.id}`}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="bpm" className="text-base font-medium">
                BPM (Tempo)
              </Label>
              <span className="font-mono text-lg font-bold text-primary" data-testid="text-bpm-value">
                {bpm}
              </span>
            </div>
            <Slider
              id="bpm"
              value={[bpm]}
              onValueChange={(v) => setBpm(v[0])}
              min={60}
              max={220}
              step={1}
              className="mt-4"
              data-testid="slider-bpm"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>60 (Slow)</span>
              <span>140 (Medium)</span>
              <span>220 (Fast)</span>
            </div>
          </div>

          <div>
            <Label htmlFor="style" className="text-base font-medium">
              Style Prompt (Optional)
            </Label>
            <Textarea
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., with crash fills, double bass, syncopated hi-hats, shuffle feel..."
              className="mt-2 resize-none"
              rows={3}
              data-testid="input-style"
            />
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            data-testid="button-generate"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Drums
              </>
            )}
          </Button>
        </div>
      </Card>

      {generateMutation.isPending && (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
            <p className="mt-4 font-medium">Creating your beat...</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generating {selectedGenre?.name || genre} drums at {bpm} BPM
            </p>
          </div>
        </Card>
      )}

      {currentGeneration && currentGeneration.audioUrl && !generateMutation.isPending && (
        <AudioPlayer
          audioUrl={currentGeneration.audioUrl}
          genre={currentGeneration.genre}
          bpm={currentGeneration.bpm}
          onRegenerate={handleRegenerate}
          isRegenerating={generateMutation.isPending}
        />
      )}
    </div>
  );
}
