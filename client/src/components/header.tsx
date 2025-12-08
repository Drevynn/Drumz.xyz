import { Link } from "wouter";
import { Drum } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Drum className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold" data-testid="text-logo">
            DrumForge AI
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/generate">
            <Button data-testid="button-generate-cta">
              Generate Drums
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
