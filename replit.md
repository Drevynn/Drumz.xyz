# Drumz.xyz - Voice-Powered AI Drum Generator

## Overview
Drumz.xyz is a voice-activated web application that generates custom AI-powered drum tracks for musicians. Like Suno, but for drums only - users speak or type natural language descriptions of the drums they need, and the AI generates custom drum patterns in seconds.

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React with Vite
- **Routing**: Wouter
- **Styling**: Tailwind CSS with Shadcn UI components (rich purple theme)
- **State Management**: TanStack Query for server state
- **Voice Input**: Web Speech API for speech-to-text
- **Theme**: Dark mode by default, with light/dark toggle
- **Authentication**: Replit Auth (OIDC) with useAuth hook

### Backend (Express + TypeScript)
- **API**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with Passport.js
- **Payments**: Stripe for subscription management
- **External API**: Artificial Studio API for drum generation

### Key Pages
- `/` - Landing page with voice-first hero, example prompts, how it works
- `/generate` - Voice-powered drum generator with microphone button and text input
- `/pricing` - Tiered subscription pricing with Stripe checkout

## Pricing Tiers

| Tier | Price | Generations/Month | Features |
|------|-------|-------------------|----------|
| Free | $0 | 5 | MP3, 7-day history, ads |
| Basic | $4.99 | 25 | MP3, 30-day history, ad-free |
| Pro | $9.99 | 100 | MP3/WAV, 90-day history, priority |
| Premium | $19.99 | Unlimited | MP3/WAV, unlimited history, priority support |

## Environment Variables

### Required Secrets
- `SESSION_SECRET` - Session encryption key (auto-provided)
- `DATABASE_URL` - PostgreSQL connection string (auto-provided)
- `ARTIFICIAL_STUDIO_API_KEY` - API key from Artificial Studio (https://app.artificialstudio.ai)
  - If not provided, the app falls back to demo audio samples

### Stripe Configuration (for payments)
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PRICE_BASIC` - Stripe price ID for Basic tier
- `STRIPE_PRICE_PRO` - Stripe price ID for Pro tier
- `STRIPE_PRICE_PREMIUM` - Stripe price ID for Premium tier

## API Endpoints

### Authentication
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Log out user
- `GET /api/auth/user` - Get current user (protected)

### Drum Generation
- `POST /api/generate` - Generate a new drum track
- `GET /api/history` - Get recent public generations
- `GET /api/my-generations` - Get user's own generations (protected)
- `GET /api/generation/:id` - Get a specific generation

### Subscriptions
- `GET /api/subscription` - Get user's subscription status (protected)
- `GET /api/pricing` - Get all pricing tiers (public)
- `POST /api/checkout` - Create Stripe checkout session (protected)
- `POST /api/billing-portal` - Create billing portal session (protected)
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Data Models

### User (from Replit Auth)
```typescript
{
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Subscription
```typescript
{
  id: string;
  userId: string;
  tier: "free" | "basic" | "pro" | "premium";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  generationsThisMonth: number;
  lastGenerationReset: Date;
  createdAt: Date;
}
```

### DrumGeneration
```typescript
{
  id: string;
  userId: string | null;
  prompt: string;
  bpm: number | null;
  audioUrl: string | null;
  status: "pending" | "generating" | "completed" | "failed";
  createdAt: Date;
}
```

## Key Features
- **Voice Input**: Speak naturally to describe drums you need
- **Text Input**: Type descriptions for precise control
- **Optional BPM**: Specify tempo (60-220) or let AI decide
- **Audio Player**: Waveform visualization, loop mode, speed control, volume
- **Download**: MP3/WAV formats for DAW import
- **Generation History**: Beats with replay and regenerate
- **User Accounts**: Save preferences and history
- **Tiered Subscriptions**: Free, Basic, Pro, Premium plans
- **Dark/Light Theme**: Toggle between modes
- **Responsive Design**: Works on mobile and desktop

## Development Notes

### Design System
Following `design_guidelines.md`:
- Font: Inter (UI), Space Grotesk (display/headings)
- Rich purple theme for distinctive branding
- Card-based UI with subtle elevation

### Voice Recognition
Uses browser's Web Speech API (SpeechRecognition). Works best in Chrome/Edge. Falls back to text input if voice is unavailable.

### Fallback Behavior
When ARTIFICIAL_STUDIO_API_KEY is not set or API calls fail, the app returns demo audio from SoundHelix to ensure the UI remains functional for testing.

### Stripe Integration
Payments are handled via Stripe Checkout. To enable payments:
1. Create products/prices in Stripe Dashboard
2. Set the price IDs in environment variables
3. Configure webhook endpoint in Stripe (POST /api/webhooks/stripe)
