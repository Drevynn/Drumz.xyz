# Drumz.xyz - AI Drum Beat Generator

## Overview
Drumz.xyz is a web application that generates custom AI-powered drum tracks for musicians. Users can select from 9+ genres (rock, punk, jazz, blast beats, reggae, funk, hip hop, latin, trap), set their desired BPM (60-220), and add style prompts to create unique drum patterns.

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React with Vite
- **Routing**: Wouter
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: TanStack Query for server state
- **Theme**: Dark mode by default, with light/dark toggle

### Backend (Express + TypeScript)
- **API**: Express.js REST API
- **Storage**: In-memory storage (MemStorage)
- **External API**: Artificial Studio API for drum generation

### Key Pages
- `/` - Landing page with hero, genre showcase, how it works, social proof
- `/generate` - Drum generator interface with controls and history

## Environment Variables

### Required Secrets
- `ARTIFICIAL_STUDIO_API_KEY` - API key from Artificial Studio (https://app.artificialstudio.ai)
  - If not provided, the app falls back to demo audio samples

## API Endpoints

### POST /api/generate
Generate a new drum track
- **Request**: `{ genre: string, bpm: number, style?: string }`
- **Response**: `DrumGeneration` object with audioUrl

### GET /api/history
Get recent drum generations (last 10)
- **Response**: Array of `DrumGeneration` objects

### GET /api/generation/:id
Get a specific generation by ID

## Data Models

### DrumGeneration
```typescript
{
  id: string;
  genre: string;
  bpm: number;
  style: string | null;
  audioUrl: string | null;
  status: "pending" | "generating" | "completed" | "failed";
  createdAt: Date;
}
```

## Key Features
- 9+ genre presets with default BPMs
- BPM slider (60-220)
- Custom style prompts
- Audio player with waveform visualization
- Download as MP3/WAV
- Generation history (last 10 beats)
- Regenerate previous beats
- Dark/light theme toggle
- Responsive design for mobile and desktop

## Development Notes

### Design System
Following `design_guidelines.md`:
- Font: Inter (UI), Space Grotesk (display/headings)
- Dark theme optimized for musicians
- Card-based UI with subtle elevation

### Fallback Behavior
When ARTIFICIAL_STUDIO_API_KEY is not set or API calls fail, the app returns demo audio from SoundHelix to ensure the UI remains functional for testing.
