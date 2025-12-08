import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenreIcon } from "./genre-icon";
import type { Genre } from "@shared/schema";

interface GenreCardProps {
  genre: Genre;
  onClick?: () => void;
}

export function GenreCard({ genre, onClick }: GenreCardProps) {
  return (
    <Card
      className="group cursor-pointer p-6 transition-all duration-200 hover-elevate"
      onClick={onClick}
      data-testid={`card-genre-${genre.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <GenreIcon icon={genre.icon} className="h-6 w-6" />
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {genre.defaultBpm} BPM
        </Badge>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">
        {genre.name}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {getGenreDescription(genre.id)}
      </p>
    </Card>
  );
}

function getGenreDescription(genreId: string): string {
  const descriptions: Record<string, string> = {
    rock: "Classic rock patterns with powerful snare hits and driving rhythms",
    punk: "Fast, aggressive beats with relentless energy and attitude",
    jazz: "Sophisticated swing patterns with brush work and syncopation",
    "blast-beats": "Extreme metal drumming at blistering speeds",
    reggae: "Laid-back grooves with emphasis on the off-beat",
    funk: "Tight, syncopated rhythms with ghost notes and pocket",
    "hip-hop": "Hard-hitting boom bap with crisp snares and deep kicks",
    latin: "Infectious rhythms with clave patterns and percussion",
    trap: "808-heavy beats with rapid hi-hats and rolling patterns",
  };
  return descriptions[genreId] || "Custom drum patterns for your music";
}
