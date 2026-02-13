# Design System - Team Jukebox

## Visual Aesthetic

**Theme:** Chrome Dreams & Neon Nights  
A harmonious fusion of 1950s diner nostalgia and retro-futuristic aesthetics. Think classic American jukebox meets synthwave. The interface features:
- Chrome-plated metallic surfaces with realistic gradients
- Neon accent lighting (pink, cyan, amber)
- Dark backgrounds to make chrome and neon pop
- Period-appropriate typography evoking mid-century signage
- Smooth animations with 200-400ms durations

## Color Palette

### Chrome Colors (Metallic Grays)

**CSS Custom Properties:**
```css
:root {
/* Chrome - Light to Dark Gradient */
--chrome-light: #E8E8E8;      /* Lightest chrome, highlights */
--chrome-base: #C0C0C0;        /* Base chrome color */
--chrome-dark: #8B8B8B;        /* Shadow areas */
--chrome-darkest: #4A4A4A;     /* Deepest shadows */

/* Chrome Gradients */
--chrome-gradient-1: linear-gradient(135deg, var(--chrome-light) 0%, var(--chrome-base) 50%, var(--chrome-dark) 100%);
--chrome-gradient-2: linear-gradient(180deg, var(--chrome-light) 0%, var(--chrome-base) 30%, var(--chrome-dark) 70%, var(--chrome-darkest) 100%);
--chrome-gradient-3: radial-gradient(circle at 30% 30%, var(--chrome-light), var(--chrome-base) 40%, var(--chrome-dark));
}
```

**Usage:**
- Primary borders and frames
- Button backgrounds (inactive state)
- Component frames (JukeboxFrame, modals)
- Progress bar track
- Queue dividers

### Neon Accent Colors

**CSS Custom Properties:**
```css
:root {
/* Neon Pink (Primary Accent) */
--neon-pink: #FF10F0;
--neon-pink-glow: 0 0 10px #FF10F0, 0 0 20px #FF10F0, 0 0 30px #FF10F0;
--neon-pink-dim: rgba(255, 16, 240, 0.5);

/* Neon Cyan (Secondary Accent) */
--neon-cyan: #00F0FF;
--neon-cyan-glow: 0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF;
--neon-cyan-dim: rgba(0, 240, 255, 0.5);

/* Neon Amber (Tertiary Accent) */
--neon-amber: #FFB000;
--neon-amber-glow: 0 0 10px #FFB000, 0 0 20px #FFB000, 0 0 30px #FFB000;
--neon-amber-dim: rgba(255, 176, 0, 0.5);
}
```

**Usage:**
- **Neon Pink:** Active vote buttons, progress bar fill, "QUEUE EMPTY" text, genre display
- **Neon Cyan:** Now playing song title, currently playing queue border, focus indicators, oscilloscope waveform
- **Neon Amber:** Queue position numbers, admin crown icon, admin display

### Background Colors

**CSS Custom Properties:**
```css
:root {
/* Dark Backgrounds */
--bg-darkest: #0A0A0A;        /* Page background */
--bg-dark: #1A1A1A;           /* Component backgrounds */
--bg-medium: #2D2D2D;         /* Lighter panels */
--bg-light: #3D3D3D;          /* Hover states */

/* With Transparency */
--bg-overlay: rgba(0, 0, 0, 0.8); /* Modal backdrop */
--bg-glass: rgba(45, 45, 45, 0.3); /* Glass effect */
}
```

### Text Colors

**CSS Custom Properties:**
```css
:root {
/* Text Colors */
--text-primary: #FFFFFF;      /* Main text */
--text-secondary: #E0E0E0;    /* Secondary text */
--text-dim: #A0A0A0;          /* Dimmed text */
--text-muted: #707070;        /* Very dim text */

/* Semantic Colors */
--text-error: #FF4444;
--text-warning: #FFB000;
--text-success: #00FF88;
}
```

## Typography

### Font Families

**Google Fonts Imports:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Righteous&family=Audiowide&family=Space+Mono:wght@400;700&family=Pacifico&display=swap" rel="stylesheet">
```

**CSS Custom Properties:**
```css
:root {
/* Display Font (Big Headlines, Main Title) */
--font-display-primary: 'Righteous', cursive;
--font-display-fallback: 'Bungee Shade', cursive;

/* Secondary Display (Subheadings, Buttons) */
--font-display-secondary: 'Audiowide', sans-serif;
--font-display-secondary-fallback: 'Orbitron', sans-serif;

/* Body Font (Main Content, Paragraphs) */
--font-body: 'Space Mono', monospace;
--font-body-fallback: 'Roboto Mono', monospace;

/* Accent Font (Username displays, playful elements) */
--font-accent: 'Pacifico', cursive;
--font-accent-fallback: 'Satisfy', cursive;
}
```

**Usage Guidelines:**
- **Display Primary:** "TEAM JUKEBOX" title, modal headers
- **Display Secondary:** Button labels, section headers, genre display
- **Body:** Song titles, artist names, queue items, general text
- **Accent:** Usernames ("Added by @username"), decorative elements

### Font Sizes

**CSS Custom Properties:**
```css
:root {
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - Timestamps, metadata */
--text-sm: 0.875rem;     /* 14px - Secondary info */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Artist names */
--text-xl: 1.25rem;      /* 20px - Button text */
--text-2xl: 1.5rem;      /* 24px - Song titles */
--text-3xl: 1.875rem;    /* 30px - Section headers */
--text-4xl: 2.25rem;     /* 36px - Main title */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
}
```

### Font Weights

**CSS Custom Properties:**
```css
:root {
--font-weight-normal: 400;
--font-weight-bold: 700;
}
```

## Spacing System

**CSS Custom Properties:**
```css
:root {
/* Spacing Scale (Based on 8px Grid) */
--spacing-xs: 0.25rem;     /* 4px */
--spacing-sm: 0.5rem;      /* 8px */
--spacing-md: 1rem;        /* 16px */
--spacing-lg: 1.5rem;      /* 24px */
--spacing-xl: 2rem;        /* 32px */
--spacing-2xl: 3rem;       /* 48px */
--spacing-3xl: 4rem;       /* 64px */

/* Specific Component Spacing */
--queue-item-height: 90px;
--search-panel-width: 300px;
--audio-player-height: 250px;
--genre-admin-bar-height: 80px;
}
```

## Border & Frame Styling

**CSS Custom Properties:**
```css
:root {
/* Border Widths */
--border-thin: 1px;
--border-medium: 4px;
--border-thick: 8px;
--border-chrome: 20px;           /* Desktop chrome frame */
--border-chrome-mobile: 12px;    /* Mobile chrome frame */

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-round: 50%;
--radius-jukebox-top: 40px;      /* Rounded top of jukebox */

/* Chrome Frame Effect */
--chrome-frame: var(--border-chrome) solid var(--chrome-base);
--chrome-frame-gradient: var(--border-chrome) solid;
background: var(--chrome-gradient-2);
}
```

**Chrome Border Example:**
```css
.chrome-frame {
border: var(--border-chrome) solid transparent;
border-image: linear-gradient(135deg, var(--chrome-light), var(--chrome-base), var(--chrome-dark)) 1;
border-radius: var(--radius-jukebox-top) var(--radius-jukebox-top) 0 0;
box-shadow: 
inset 0 2px 4px rgba(255, 255, 255, 0.3), /* Inner highlight */
0 4px 12px rgba(0, 0, 0, 0.5);            /* Outer shadow */
}
```

## Shadows & Depth

**CSS Custom Properties:**
```css
:root {
/* Box Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.6);

/* Neon Glow Shadows (for text and components) */
--glow-pink: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-pink);
--glow-cyan: 0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan);
--glow-amber: 0 0 10px var(--neon-amber), 0 0 20px var(--neon-amber);

/* Chrome Highlight (Inner Shine) */
--chrome-highlight: inset 0 2px 4px rgba(255, 255, 255, 0.3);

/* Neon Underglow (Jukebox bottom edge) */
--neon-underglow: 0 8px 32px var(--neon-pink), 0 0 8px var(--neon-cyan);
}
```

**Usage:**
- **shadow-md:** Default for buttons and cards
- **shadow-lg:** Modals and floating elements
- **glow-pink/cyan/amber:** Active vote buttons, focus states, neon text
- **chrome-highlight:** Inner bevels on chrome borders
- **neon-underglow:** Bottom edge of JukeboxFrame

## Transitions & Animations

### Duration & Easing

**CSS Custom Properties:**
```css
:root {
/* Durations */
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 400ms;
--duration-vote-float: 2500ms;
--duration-spin: 60s;         /* Album art spin on play */

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Keyframe Animations

**Neon Flicker:**
```css
@keyframes neon-flicker {
0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
opacity: 1;
filter: drop-shadow(var(--glow-pink));
}
20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
opacity: 0.7;
filter: none;
}
}
```

**Float Up (Vote Animation):**
```css
@keyframes float-up {
0% {
transform: translateY(100%) scale(0.8) rotate(0deg);
opacity: 0;
}
20% {
opacity: 1;
}
80% {
opacity: 1;
}
100% {
transform: translateY(-10%) scale(1.2) rotate(var(--random-rotation));
opacity: 0;
}
}
```

**Pulse Glow:**
```css
@keyframes pulse-glow {
0%, 100% {
filter: drop-shadow(0 0 8px var(--neon-pink));
}
50% {
filter: drop-shadow(0 0 16px var(--neon-pink)) drop-shadow(0 0 24px var(--neon-pink));
}
}
```

**Spin (Album Art):**
```css
@keyframes spin {
from {
transform: rotate(0deg);
}
to {
transform: rotate(360deg);
}
}
```

### Animation Guidelines

**Principles:**
1. **Purpose-Driven:** Every animation should serve a functional purpose (feedback, state change, attention)
2. **Subtle by Default:** Animations complement, not distract
3. **Smooth Performance:** Use `transform` and `opacity` for 60fps
4. **Respect User Preferences:** Honor `prefers-reduced-motion`

**Common Durations:**
- Button hover: 200ms
- Modal open/close: 300-400ms
- Page transitions: 400ms
- Vote float: 2500ms
- Spinning album art: 60s (linear)

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
*, *::before, *::after {
animation-duration: 0.01ms !important;
animation-iteration-count: 1 !important;
transition-duration: 0.01ms !important;
}
}
```

## Component Style Patterns

### Chrome Button

**Base Styles:**
```css
.chrome-button {
background: var(--chrome-gradient-1);
border: 2px solid var(--chrome-darkest);
border-radius: var(--radius-md);
color: var(--text-primary);
font-family: var(--font-display-secondary);
font-size: var(--text-xl);
padding: var(--spacing-md) var(--spacing-xl);
box-shadow: var(--chrome-highlight), var(--shadow-md);
cursor: pointer;
transition: all var(--duration-fast) var(--ease-out);
}

.chrome-button:hover {
filter: brightness(1.1);
box-shadow: var(--chrome-highlight), var(--shadow-lg);
transform: translateY(-2px);
}

.chrome-button:active {
transform: translateY(0);
box-shadow: var(--chrome-highlight), var(--shadow-sm);
}

.chrome-button:disabled {
opacity: 0.5;
cursor: not-allowed;
filter: grayscale(50%);
}
```

### Neon Text

**Base Styles:**
```css
.neon-text {
color: var(--neon-pink);
font-family: var(--font-display-primary);
text-shadow: var(--glow-pink);
animation: neon-flicker 3s infinite;
}

.neon-text.cyan {
color: var(--neon-cyan);
text-shadow: var(--glow-cyan);
}

.neon-text.amber {
color: var(--neon-amber);
text-shadow: var(--glow-amber);
}
```

### Glass Panel

**Base Styles:**
```css
.glass-panel {
background: var(--bg-glass);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-lg);
}
```

## Responsive Breakpoints

**CSS Custom Properties:**
```css
:root {
--breakpoint-mobile: 320px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1440px;
}
```

**Media Queries:**
```css
/* Mobile First */
@media (min-width: 768px) {
/* Tablet styles */
}

@media (min-width: 1024px) {
/* Desktop styles */
}

@media (min-width: 1440px) {
/* Wide desktop styles */
}
```

**Responsive Spacing:**
- Mobile: Smaller chrome borders (12px), reduced spacing
- Tablet: Medium chrome borders (16px), hybrid layout
- Desktop: Full chrome borders (20px), full jukebox layout

## Accessibility Considerations

### Color Contrast
- All text meets WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
- Neon colors on dark backgrounds: 7:1+ contrast ratio
- Chrome text (white on chrome gradient): 5:1+ contrast

### Focus Indicators
```css
:focus-visible {
outline: 3px solid var(--neon-cyan);
outline-offset: 2px;
box-shadow: var(--glow-cyan);
}
```

### Motion Preferences
- Honor `prefers-reduced-motion`
- Disable or drastically reduce all animations
- Maintain functional feedback without motion

## Design Tokens Summary

All design tokens are defined in `/app/globals.css` as CSS custom properties and imported into every component via CSS Modules. This ensures consistency and makes theme adjustments easy.

**Token Categories:**
1. **Colors:** Chrome, neon, backgrounds, text
2. **Typography:** Fonts, sizes, weights, line heights
3. **Spacing:** Margins, paddings, gaps
4. **Borders:** Widths, radii, frame effects
5. **Shadows:** Box shadows, glows, depth
6. **Animations:** Durations, easings, keyframes
7. **Breakpoints:** Responsive design thresholds

## Future Enhancements

### Theme Variants
- **Classic Jukebox:** Warmer colors, wood grain textures
- **Cyberpunk:** More intense neons, grid patterns
- **Retro Arcade:** Pixel art elements, 8-bit fonts

### Dynamic Themes
- User-selectable color schemes
- Dark/light mode toggle (maintain retro aesthetic)
- Genre-based color shifts (e.g., warm amber for jazz, cool cyan for electronic)
