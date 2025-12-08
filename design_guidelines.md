# AI Drum Beat Generator - Design Guidelines

## Design Approach

**Reference-Based**: Drawing inspiration from modern music production platforms (Splice, Soundtrap, BandLab) combined with Linear's typography system and Stripe's restraint. This creates a professional, musician-friendly environment that balances creativity with utility.

**Core Principle**: Studio-grade aesthetic that inspires confidence while remaining approachable for bedroom producers and solo musicians.

---

## Typography System

**Font Families** (via Google Fonts CDN):
- **Primary**: Inter (UI elements, body text, controls)
- **Display**: Space Grotesk (headings, hero statements, genre tags)

**Hierarchy**:
- **Hero/H1**: Space Grotesk, 4xl-6xl (font-bold)
- **H2/Section Titles**: Space Grotesk, 2xl-3xl (font-semibold)
- **H3/Card Headers**: Inter, xl-2xl (font-semibold)
- **Body/Controls**: Inter, base-lg (font-normal)
- **Small Labels**: Inter, sm (font-medium)
- **Technical Data** (BPM, duration): Space Grotesk, sm-base (font-mono alternative)

---

## Layout System

**Spacing Primitives** (Tailwind units):
- **Core rhythm**: 4, 6, 8, 12, 16, 24
- **Section padding**: py-16 md:py-24 (landing), py-8 md:py-12 (app interface)
- **Component gaps**: gap-4 (tight), gap-6 (standard), gap-8 (generous)
- **Container**: max-w-7xl for landing, max-w-6xl for app interface

**Grid Strategy**:
- **Landing page**: Single column with centered content (max-w-4xl), 3-column feature grid (lg:grid-cols-3)
- **App interface**: Asymmetric layout - Generator controls (left/top 60%), History sidebar (right/bottom 40%)

---

## Component Library

### Navigation
- **Header**: Sticky top navigation with logo left, "Generate Drums" CTA right
- **Footer**: 3-column grid (Product, Resources, Company) with newsletter signup

### Landing Page Components

**Hero Section** (h-screen, centered):
- Large display heading: "AI-Powered Drum Tracks in 30 Seconds"
- Subtitle explaining the value proposition
- Dual CTAs: "Start Generating (Free)" (primary), "See Examples" (secondary with blur backdrop)
- Background: Subtle waveform visualization or abstract audio pattern (decorative, not dominant)
- **No hero image** - focus on typography and abstract audio-themed graphics

**Genre Showcase** (py-24):
- 3-column grid of genre cards
- Each card: Genre name, BPM indicator, embedded mini audio player
- Icons from Heroicons (musical-note, fire for blast beats, sparkles)

**How It Works** (py-24, single column max-w-3xl):
- 3 numbered steps with generous vertical spacing (gap-12)
- Step indicators: Large numbers in display font
- Supporting text in body font

**Social Proof** (py-16):
- Single row of stats: "10,000+ Tracks Generated", "50+ Genres", "100% Royalty-Free"
- Centered, evenly spaced

### Generator Interface

**Control Panel**:
- Card-based layout with subtle elevation
- **BPM Slider**: Large, prominent range input (60-220) with live value display
- **Genre Dropdown**: Full-width select with icon prefixes
- **Style Prompt**: Textarea for custom instructions ("with crash fills", "double bass")
- **Generate Button**: Large, full-width, prominent CTA

**Audio Player**:
- Full-width waveform visualization (using WaveSurfer.js or similar)
- Standard controls: Play/Pause, Progress bar, Duration, Volume
- Download button positioned prominently next to player controls

**Generation History**:
- Vertical list of cards
- Each card: Timestamp, Genre tag, BPM badge, Mini waveform, Regenerate icon button
- Maximum 10 items, scrollable

---

## Interactive Elements

**Buttons**:
- **Primary CTA**: Solid background, rounded-lg, px-8 py-3, font-semibold
- **Secondary**: Outline style with blur backdrop (for buttons over images/gradients)
- **Icon Buttons**: Square p-2, rounded-md (history items, player controls)
- **States**: Implement hover brightness changes, active scale transforms (scale-95)

**Form Inputs**:
- Consistent height (h-12), rounded-lg borders
- Focus states with ring effect
- Labels above inputs (mb-2)

**Cards**:
- Rounded-xl borders
- Subtle shadow on all cards
- p-6 standard padding
- Hover state: slight elevation increase (shadow-lg)

---

## Animations

**Minimal, purposeful animations only**:
- Waveform visualization during audio playback (library-handled)
- Gentle fade-in for generated audio player (300ms)
- Smooth transitions on hover states (transition-all duration-200)
- Loading spinner during generation (simple circular spinner, no elaborate animations)

---

## Images

**No traditional hero image** - Instead use:
- **Abstract waveform graphics**: SVG-based, animated subtly in hero background
- **Genre card thumbnails**: Simple icons or geometric patterns representing each genre (rock = electric guitar icon, jazz = saxophone icon, etc.)
- **Social proof**: Optional small musician profile photos if adding testimonials (not required for MVP)

**Where to source**:
- Icons: Heroicons (via CDN)
- Abstract graphics: CSS gradients + SVG patterns (no external images needed)

---

## Accessibility & Polish

- **Consistent focus indicators**: All interactive elements have visible focus rings
- **ARIA labels**: Audio players, sliders, and dynamic content properly labeled
- **Keyboard navigation**: Full app navigable via keyboard
- **Form validation**: Inline error messages below inputs
- **Loading states**: Clear feedback during audio generation (loading spinner + "Generating your beat..." text)

---

## Responsive Behavior

**Breakpoints**:
- Mobile (base): Single column, stacked controls, history moves below player
- Tablet (md): 2-column layout begins for feature grids
- Desktop (lg): Full asymmetric layout, 3-column grids, sidebar history

**Mobile-specific**:
- Larger touch targets (min-h-12 for all buttons)
- Simplified waveform visualization
- Collapsible history section (accordion-style)

---

## Critical Landing Page Structure

**Complete 6-section layout**:
1. Hero (full viewport height)
2. Genre Showcase (9 genre cards in 3x3 grid)
3. How It Works (3 steps, vertical flow)
4. Social Proof (stats row)
5. Final CTA (centered, generous spacing)
6. Footer (comprehensive links + newsletter)

**Each section is self-contained and purposeful** - no sparse layouts. Every section adds value and guides users toward generation.