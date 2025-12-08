import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, Play, RotateCcw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { DrumGeneration } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface GenerationHistoryProps {
  onPlayGeneration: (generation: DrumGeneration) => void;
}

export function GenerationHistory({ onPlayGeneration }: GenerationHistoryProps) {
  const { data: history = [], isLoading } = useQuery<DrumGeneration[]>({
    queryKey: ["/api/history"],
  });

  const regenerateMutation = useMutation({
    mutationFn: async (generation: DrumGeneration) => {
      const response = await apiRequest("POST", "/api/generate", {
        genre: generation.genre,
        bpm: generation.bpm,
        style: generation.style,
      });
      return response as DrumGeneration;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      onPlayGeneration(data);
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-display font-semibold">Recent Generations</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-display font-semibold">Recent Generations</h3>
        </div>
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">
            No generations yet. Create your first beat!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-display font-semibold">Recent Generations</h3>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((generation) => (
            <HistoryItem
              key={generation.id}
              generation={generation}
              onPlay={() => onPlayGeneration(generation)}
              onRegenerate={() => regenerateMutation.mutate(generation)}
              isRegenerating={
                regenerateMutation.isPending &&
                regenerateMutation.variables?.id === generation.id
              }
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

interface HistoryItemProps {
  generation: DrumGeneration;
  onPlay: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

function HistoryItem({
  generation,
  onPlay,
  onRegenerate,
  isRegenerating,
}: HistoryItemProps) {
  const genreName = generation.genre
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 hover-elevate"
      data-testid={`history-item-${generation.id}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{genreName}</span>
          <Badge variant="secondary" className="font-mono text-xs">
            {generation.bpm} BPM
          </Badge>
        </div>
        {generation.style && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {generation.style}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
        </p>
      </div>

      <div className="flex items-center gap-1">
        {generation.audioUrl && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onPlay}
            data-testid={`button-play-${generation.id}`}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={onRegenerate}
          disabled={isRegenerating}
          data-testid={`button-regen-${generation.id}`}
        >
          <RotateCcw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
