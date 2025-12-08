import { Link } from "wouter";
import { ArrowRight, Music, Zap, Download, Sparkles, Users, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GenreCard } from "@/components/genre-card";
import { GENRES } from "@shared/schema";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <HeroSection />
      <GenreShowcase />
      <HowItWorks />
      <SocialProof />
      <FinalCTA />
      
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          100% Royalty-Free for Commercial Use
        </Badge>
        
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          AI-Powered Drum Tracks
          <span className="block text-primary">in 30 Seconds</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Generate custom drum beats for any genre. Rock, punk, jazz, blast beats, 
          hip hop and more. Perfect for solo musicians, producers, and cover artists.
        </p>
        
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/generate">
            <Button size="lg" className="text-base px-8" data-testid="button-hero-generate">
              Start Generating (Free)
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#genres">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 backdrop-blur-sm"
              data-testid="button-see-examples"
            >
              See Examples
            </Button>
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          {[
            { icon: Zap, label: "Instant", desc: "30-second generation" },
            { icon: Music, label: "9+ Genres", desc: "From jazz to blast beats" },
            { icon: Download, label: "Download", desc: "MP3/WAV formats" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display font-semibold">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GenreShowcase() {
  return (
    <section id="genres" className="py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Every Genre, Any BPM
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From laid-back reggae grooves to extreme metal blast beats. 
            Our AI handles it all with studio-quality precision.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GENRES.map((genre) => (
            <Link key={genre.id} href="/generate">
              <GenreCard genre={genre} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose Your Genre",
      description:
        "Select from 9+ genres including rock, punk, jazz, funk, hip hop, trap, and even extreme blast beats.",
    },
    {
      number: "02",
      title: "Set the Tempo & Style",
      description:
        "Dial in your exact BPM (60-220) and add style prompts like 'with crash fills' or 'syncopated hi-hats'.",
    },
    {
      number: "03",
      title: "Generate & Download",
      description:
        "Hit generate and get your custom drum track in seconds. Download as MP3 or WAV, ready to use in your DAW.",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            From idea to audio in three simple steps
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display text-xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="pt-2">
                <h3 className="font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { value: "10,000+", label: "Tracks Generated" },
    { value: "9+", label: "Genres Available" },
    { value: "100%", label: "Royalty-Free" },
  ];

  return (
    <section className="py-16 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Ready to Create Your Beat?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join thousands of musicians using Drumz.xyz to power their music.
          No credit card required.
        </p>
        <Link href="/generate">
          <Button size="lg" className="mt-8 text-base px-8" data-testid="button-final-cta">
            Start Generating Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
