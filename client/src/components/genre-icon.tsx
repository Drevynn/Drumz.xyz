import {
  Guitar,
  Zap,
  Music,
  Flame,
  Palmtree,
  Sparkles,
  Headphones,
  Sun,
  Volume2,
} from "lucide-react";

const iconMap = {
  guitar: Guitar,
  zap: Zap,
  music: Music,
  flame: Flame,
  palmtree: Palmtree,
  sparkles: Sparkles,
  headphones: Headphones,
  sun: Sun,
  volume2: Volume2,
} as const;

interface GenreIconProps {
  icon: keyof typeof iconMap;
  className?: string;
}

export function GenreIcon({ icon, className = "h-5 w-5" }: GenreIconProps) {
  const IconComponent = iconMap[icon];
  return <IconComponent className={className} />;
}
