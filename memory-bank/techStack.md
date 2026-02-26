# Tech Stack & Architecture - Team Jukebox

## Core Technologies

### Framework
- **Next.js 14+** with App Router
- React Server Components architecture
- TypeScript for type safety
- ES2022+ JavaScript features

### Styling
- **CSS Modules** for component-scoped styles
- **CSS Custom Properties** for design tokens
- No CSS-in-JS or Tailwind (custom chrome/neon aesthetic requires precise control)
- Google Fonts: Righteous, Audiowide, Space Mono, Pacifico

### State Management
- **Zustand** (lightweight alternative to Redux)
- Client-side only (no SSR state complications)
- Simple, hook-based API
- Stores:
  - User session (currentUser, activeUsers)
  - Queue (queue items, reorder logic)
  - Votes (vote counts, user votes)
  - Genre/Admin (currentGenre, adminUser)
  - Audio (currentSong, isPlaying, progress)
  - History (last 40 songs played)

### Audio System
- **Web Audio API** for audio analysis and processing
- **Howler.js** for robust cross-browser audio playback
- Audio Context for VU meters and oscilloscope
- AnalyserNode for frequency/time domain data
- Real-time visualization at 60fps

### Real-Time Communication
**Option A: Socket.io**
- WebSocket connection for bi-directional communication
- Automatic reconnection and fallback
- Room-based event broadcasting
- Handles: queue updates, votes, genre/admin changes

**Option B: Supabase Realtime**
- PostgreSQL change data capture (CDC)
- Presence for active users
- Broadcast for ephemeral events
- Integrated with database

### Database
**PostgreSQL** (via Supabase or Vercel Postgres)

**Schema:**
```sql
-- Users (optional auth, track sessions)
CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
username VARCHAR(50) UNIQUE NOT NULL,
session_id UUID NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
last_active TIMESTAMP DEFAULT NOW()
);

-- Songs (cached metadata from music APIs)
CREATE TABLE songs (
id VARCHAR(100) PRIMARY KEY, -- Spotify ID or composite
title VARCHAR(255) NOT NULL,
artist VARCHAR(255) NOT NULL,
album VARCHAR(255),
duration_ms INTEGER,
album_art_url TEXT,
spotify_id VARCHAR(100),
apple_music_id VARCHAR(100),
youtube_id VARCHAR(100),
created_at TIMESTAMP DEFAULT NOW()
);

-- Queue (current state, max 25 items)
CREATE TABLE queue_items (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
song_id VARCHAR(100) REFERENCES songs(id),
added_by VARCHAR(50) NOT NULL,
added_at TIMESTAMP DEFAULT NOW(),
position INTEGER NOT NULL,
UNIQUE(position)
);

-- Vote History (all votes ever cast)
CREATE TABLE votes (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
song_id VARCHAR(100) REFERENCES songs(id),
user_id UUID REFERENCES users(id),
username VARCHAR(50) NOT NULL,
vote_type VARCHAR(20) NOT NULL, -- 'thumbsDown', 'thumbsUp', 'doubleThumbsUp'
cast_at TIMESTAMP DEFAULT NOW(),
UNIQUE(song_id, user_id) -- One vote per user per song play
);

-- Genres (current genre state)
CREATE TABLE genres (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
set_by VARCHAR(50) NOT NULL,
set_at TIMESTAMP DEFAULT NOW(),
is_active BOOLEAN DEFAULT TRUE
);

-- Admin state (current admin)
CREATE TABLE admin_state (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
granted_at TIMESTAMP DEFAULT NOW()
);

-- Play History (track all plays)
CREATE TABLE play_history (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
song_id VARCHAR(100) REFERENCES songs(id),
added_by VARCHAR(50) NOT NULL,
played_at TIMESTAMP DEFAULT NOW(),
thumbs_down INTEGER DEFAULT 0,
thumbs_up INTEGER DEFAULT 0,
double_thumbs_up INTEGER DEFAULT 0
);
```

**Indexes:**
```sql
CREATE INDEX idx_votes_song_id ON votes(song_id);
CREATE INDEX idx_votes_username ON votes(username);
CREATE INDEX idx_queue_position ON queue_items(position);
CREATE INDEX idx_play_history_played_at ON play_history(played_at DESC);
CREATE INDEX idx_users_last_active ON users(last_active DESC);
```

### Music APIs

**Primary: Spotify Web API**
- Client Credentials OAuth flow (no user auth required)
- Endpoints:
  - `/search` - Search for songs/artists
  - `/tracks/{id}` - Get track details
  - `/tracks` - Get multiple tracks (batch)
- Rate limits: 100 requests per 30 seconds (per client)
- Response caching to minimize API calls

**Local integration note (current)**
- `/api/search?q=...` proxies to Spotify with Client Credentials (server-side only).
- Returns `QueueItem[]` with `title`, `artist`, and `url` (Spotify `preview_url` when available).

**Fallback: Apple Music API**
- MusicKit JS or REST API
- Similar endpoints for search and track details

**Fallback: YouTube Music API**
- Third-party libraries (unofficial)
- Search and metadata retrieval

**API Abstraction Layer:**
```typescript
// lib/api/musicService.ts
interface Song {
id: string;
title: string;
artist: string;
album: string;
durationMs: number;
albumArtUrl: string;
source: 'spotify' | 'apple' | 'youtube';
externalUrl: string;
}

interface MusicService {
search(query: string): Promise<Song[]>;
getSong(id: string): Promise<Song>;
getMultipleSongs(ids: string[]): Promise<Song[]>;
}

// Implementations for each service
class SpotifyService implements MusicService { ... }
class AppleMusicService implements MusicService { ... }
class YouTubeMusicService implements MusicService { ... }

// Factory with automatic fallback
export const musicService = createMusicService([
new SpotifyService(),
new AppleMusicService(),
new YouTubeMusicService()
]);
```

### Session Management

**Client-Side Only (localStorage)**
```typescript
interface UserSession {
username: string;
sessionId: string; // UUID generated on first visit
createdAt: number;
lastActive: number;
}

// Storage key: 'teamjukebox_user'
// No expiration, persists until user clears storage
```

**Active User Tracking**
- Users considered "active" if activity within last 30 minutes
- Heartbeat ping every 30 seconds via WebSocket
- Server tracks active sessions in memory
- Used for admin transfer dropdown

## Project Structure

```text
team-jukebox/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with font imports
│   ├── page.tsx               # Main jukebox page
│   ├── globals.css            # CSS tokens and global styles
│   └── api/                   # API routes (proxy to external APIs)
│       ├── songs/
│       │   ├── search/
│       │   │   └── route.ts   # POST /api/songs/search
│       │   └── [id]/
│       │       └── route.ts   # GET /api/songs/:id
│       ├── queue/
│       │   └── route.ts       # GET/POST/PATCH /api/queue
│       ├── votes/
│       │   └── route.ts       # POST /api/votes, GET /api/votes/:songId
│       └── genre/
│           └── route.ts       # GET/POST /api/genre, POST /api/admin/transfer
│
├── components/                 # React components
│   ├── JukeboxFrame/          # Main chrome frame container
│   ├── UsernameEntry/         # First-visit username modal
│   ├── AudioPlayer/           # Top-anchored player with sub-components
│   │   ├── AlbumArt.tsx
│   │   ├── NowPlayingInfo.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── VUMeters.tsx
│   │   ├── Oscilloscope.tsx
│   │   ├── VoteButtons.tsx
│   │   └── VolumeControl.tsx
│   ├── QueuePanel/            # Queue display and management
│   │   ├── QueueItem.tsx
│   │   └── QueueEmpty.tsx
│   ├── SearchPanel/           # Left sidebar search
│   │   ├── SearchInput.tsx
│   │   └── SearchResults.tsx
│   ├── HistoryPanel/          # Last 40 songs played
│   │   └── HistoryItem.tsx
│   ├── GenreAdmin/            # Genre/admin management
│   │   ├── GenreAdminBar.tsx
│   │   ├── SetGenreModal.tsx
│   │   └── TransferAdminModal.tsx
│   ├── Modal/                 # Reusable modal wrapper
│   │   ├── Modal.tsx
│   │   └── SongDetailModal.tsx
│   ├── VoteAnimation/         # Floating vote effects
│   │   └── FloatingVote.tsx
│   └── ui/                    # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── TabNav.tsx
│
├── lib/                        # Business logic and utilities
│   ├── audio/
│   │   ├── AudioContext.tsx   # Web Audio API context provider
│   │   ├── useAudioPlayer.ts  # Audio playback hook
│   │   └── audioAnalyzer.ts   # Audio analysis for visualizations
│   ├── api/
│   │   └── musicService.ts    # Music API abstraction layer
│   ├── session/
│   │   ├── userSession.ts     # localStorage session management
│   │   └── useUserSession.ts  # Session hook
│   ├── store/
│   │   └── jukeboxStore.ts    # Zustand global state
│   └── hooks/
│       ├── useQueue.ts         # Queue management hook
│       ├── useVotes.ts         # Voting logic hook
│       └── useRealtime.ts      # WebSocket connection hook
│
├── styles/
│   ├── tokens.css             # CSS custom properties (colors, typography, spacing)
│   └── animations.css         # Keyframe animations (flicker, float, pulse)
│
└── public/
└── fonts/                 # Self-hosted fonts (if needed)
```

## API Routes

### POST /api/songs/search
**Request:**
```json
{
"query": "string",
"limit": 20
}
```

**Response:**
```json
{
"results": [
{
"id": "string",
"title": "string",
"artist": "string",
"album": "string",
"durationMs": 0,
"albumArtUrl": "string",
"source": "spotify"
}
]
}
```

### GET /api/songs/:id
**Response:** Single Song object

### GET /api/queue
**Response:**
```json
{
"queue": [
{
"id": "string",
"song": { ... },
"addedBy": "string",
"addedAt": 0,
"position": 0
}
],
"count": 0
}
```

### POST /api/queue
**Request:**
```json
{
"songId": "string",
"username": "string"
}
```

**Response:** Updated queue or error if full

### PATCH /api/queue/reorder
**Request:**
```json
{
"fromPosition": 0,
"toPosition": 0
}
```

**Response:** Updated queue

### POST /api/votes
**Request:**
```json
{
"songId": "string",
"username": "string",
"voteType": "thumbsUp"
}
```

**Response:** Updated vote counts

### GET /api/votes/:songId
**Response:**
```json
{
"thumbsDown": 0,
"thumbsUp": 0,
"doubleThumbsUp": 0
}
```

### POST /api/genre
**Request:**
```json
{
"genre": "string",
"username": "string"
}
```

**Response:** Success + new admin status

### POST /api/admin/transfer
**Request:**
```json
{
"fromUsername": "string",
"toUsername": "string"
}
```

**Response:** Success message

## WebSocket Events

### Client → Server
- `join` - User joins room
- `heartbeat` - Keep-alive ping (every 30s)
- `queue:add` - Add song to queue
- `queue:reorder` - Reorder queue item
- `vote:cast` - Cast vote on current song
- `genre:set` - Set genre (becomes admin)
- `admin:transfer` - Transfer admin rights

### Server → Client
- `queue:updated` - Queue changed (broadcast)
- `vote:updated` - Vote counts changed (broadcast)
- `genre:updated` - Genre changed (broadcast)
- `admin:updated` - Admin changed (broadcast)
- `active_users:updated` - Active user list updated

## Performance Optimizations

### Image Optimization
- Next.js `<Image>` component for all album art
- WebP format with fallbacks
- Blur placeholders during load
- Lazy loading for queue and history items

### Audio Performance
- Preload next song in queue
- Audio sprite for UI sounds (optional)
- Efficient canvas rendering (requestAnimationFrame)
- Throttle audio analysis to 60fps

### Bundle Optimization
- Code splitting by route
- Dynamic imports for modals and heavy components
- Tree-shaking unused code
- Font subsetting (only needed characters from Google Fonts)

### Real-Time Optimization
- Debounce search input (300ms)
- Throttle vote animations
- Batch queue updates (coalesce rapid changes)
- WebSocket connection pooling
- Heartbeat at 30s intervals (not every interaction)

### Caching Strategy
- API responses cached for 5 minutes (in-memory or Redis)
- Song metadata cached in database
- localStorage for user session
- Service worker for offline-first (optional)

## Security Considerations

### Input Validation
- Username: 3-20 characters, alphanumeric + underscore/hyphen
- Genre name: Max 100 characters, sanitize HTML
- Song IDs: Validate format before API calls

### Rate Limiting
- Search: Max 10 requests per minute per user
- Vote: Max 100 votes per minute per user
- Queue add: Max 5 additions per minute per user

### CORS Configuration
- Allow only from same origin in production
- WebSocket origin validation

### Data Sanitization
- Escape all user inputs before rendering
- Sanitize vote data
- Validate WebSocket payloads

### No Sensitive Data
- No passwords stored
- No email addresses
- No payment information
- Session ID is ephemeral (not tied to sensitive data)

## Environment Variables

```env
# Required
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Database (choose one)
DATABASE_URL=postgresql://...          # Direct connection
SUPABASE_URL=https://...               # Supabase
SUPABASE_ANON_KEY=...

# Supabase Realtime (client)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Optional
APPLE_MUSIC_API_KEY=...
YOUTUBE_MUSIC_API_KEY=...

# Deployment
NEXT_PUBLIC_APP_URL=https://teamjukebox.app

# Legacy (self-hosted WebSocket)
NEXT_PUBLIC_WS_URL=wss://teamjukebox.app

# Analytics (optional)
SENTRY_DSN=...
```

## Deployment Configuration

### Vercel (Recommended)
- Automatic deployments from GitHub
- Edge Functions for API routes
- CDN for static assets
- Serverless PostgreSQL (Vercel Postgres)
- WebSocket support via Vercel Functions

### Vercel Configuration
```json
{
"buildCommand": "next build",
"outputDirectory": ".next",
"framework": "nextjs",
"installCommand": "npm install",
"env": {
"NEXT_PUBLIC_APP_URL": "@app-url",
"DATABASE_URL": "@database-url"
}
}
```

### Database Migrations
- Use Prisma or raw SQL migrations
- Run migrations in GitHub Actions before deployment
- Store migration history in database

## Testing Strategy

### Unit Tests
- Jest + React Testing Library
- Test components in isolation
- Test utility functions
- Mock external dependencies

### Integration Tests
- Test API routes
- Test WebSocket events
- Test database queries

### E2E Tests (Optional for MVP)
- Playwright or Cypress
- Test critical user flows
- Run on PR before merge

### Performance Testing
- Lighthouse CI
- Core Web Vitals monitoring
- Audio visualization FPS testing

## Monitoring & Logging

### Error Tracking
- Sentry for client and server errors
- Source maps for production
- User context in error reports

### Analytics
- Vercel Analytics for page views
- Custom events for user actions:
  - Songs added
  - Votes cast
  - Queue reorders
  - Genre changes

### Logging
- Server logs to stdout (Vercel logs)
- Client logs to console (dev only)
- Structured logging for debugging
