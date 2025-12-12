import { Link } from "wouter";
import { ArrowRight, Mic, Zap, Download, Sparkles, Volume2, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdUnit } from "@/components/adsense-script";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <HeroSection />
      <ExamplesSection />
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
          Voice-Powered AI Drums
        </Badge>
        
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Just Say What You Need
          <span className="block text-primary">We'll Create the Beat</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Describe your perfect drum track in natural language. 
          "Give me a funky hip hop beat with ghost notes" - and it's yours in seconds.
        </p>
        
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/generate">
            <Button size="lg" className="text-base px-8" data-testid="button-hero-generate">
              <Mic className="mr-2 h-5 w-5" />
              Start Speaking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          {[
            { icon: Mic, label: "Voice Input", desc: "Speak your request naturally" },
            { icon: Zap, label: "Instant", desc: "Get drums in seconds" },
            { icon: Download, label: "Download", desc: "MP3/WAV ready for your DAW" },
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

function ExamplesSection() {
  const examples = [
    "Funky hip hop beat with heavy snare and ghost notes",
    "Fast punk rock drums with crash fills",
    "Smooth jazz brushes, laid back feel",
    "Hard hitting trap beat with rolling hi-hats",
    "Classic rock groove, steady 4/4 with tom fills",
    "Reggae one-drop pattern, relaxed vibe",
  ];

  return (
    <section id="examples" className="py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Just Say It
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Describe any drum sound you can imagine. Our AI understands natural language.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example, i) => (
            <Link key={i} href="/generate">
              <Card className="p-5 hover-elevate cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Mic className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-relaxed">"{example}"</p>
                </div>
              </Card>
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
      icon: Mic,
      title: "Speak or Type",
      description:
        "Describe the drums you need in plain English. Be as specific or general as you like - 'upbeat funk groove' or 'aggressive metal double bass at 200 BPM'.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Creates Your Beat",
      description:
        "Our AI interprets your request and generates a custom drum track that matches your description. Takes just seconds.",
    },
    {
      number: "03",
      icon: Download,
      title: "Preview & Download",
      description:
        "Listen to your creation, tweak if needed, and download in MP3 or WAV format. Ready for your DAW instantly.",
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
            From voice to drums in three simple steps
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display text-xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl font-semibold">
                    {step.title}
                  </h3>
                </div>
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
    { value: "Unlimited", label: "Voice Requests" },
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
          Just speak and create.
        </p>
        <Link href="/generate">
          <Button size="lg" className="mt-8 text-base px-8" data-testid="button-final-cta">
            <Mic className="mr-2 h-5 w-5" />
            Start Creating Now
          </Button>
        </Link>
        
        <div className="mt-16 py-8 border-t">
          <AdUnit slotId="1234567890" format="auto" />
        </div>
      </div>
    </section>
  );
}
