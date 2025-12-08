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

### Backend (Express + TypeScript)
- **API**: Express.js REST API
- **Storage**: In-memory storage (MemStorage)
- **External API**: Artificial Studio API for drum generation

### Key Pages
- `/` - Landing page with voice-first hero, example prompts, how it works
- `/generate` - Voice-powered drum generator with microphone button and text input

## Environment Variables

### Required Secrets
- `ARTIFICIAL_STUDIO_API_KEY` - API key from Artificial Studio (https://app.artificialstudio.ai)
  - If not provided, the app falls back to demo audio samples

## API Endpoints

### POST /api/generate
Generate a new drum track from natural language prompt
- **Request**: `{ prompt: string, bpm?: number }`
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
- **Audio Player**: Waveform visualization, play/pause, volume control
- **Download**: MP3/WAV formats for DAW import
- **Generation History**: Last 10 beats with replay and regenerate
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
