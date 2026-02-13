# Data Models - Team Jukebox

## Core Data Structures

### User Profile

**Interface:**
```typescript
interface UserProfile {
userId: string;          // UUID, generated on first visit
displayName: string;      // Username (3-20 chars, alphanumeric + _-)
isAdmin: boolean;         // True if currently admin
isGenreHolder: boolean;   // Same as isAdmin (person who set genre)
createdAt: number;        // Timestamp
lastActive: number;       // Timestamp of last activity
sessionId: string;        // UUID for current session
}
```

**localStorage Structure:**
```json
{
"username": "cooluser123",
"sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
"createdAt": 1675280400000,
"lastActive": 1675284000000
}
```

**Storage Key:** `teamjukebox_user`

**Database Schema (Optional):**
```sql
CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
username VARCHAR(50) UNIQUE NOT NULL,
session_id UUID NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
last_active TIMESTAMP DEFAULT NOW(),
total_songs_added INTEGER DEFAULT 0,
total_votes_cast INTEGER DEFAULT 0
);
```

### Song

**Interface:**
```typescript
interface Song {
id: string;                 // Spotify ID or composite ID
title: string;              // Song title
artist: string;             // Artist name
album: string;              // Album name
durationMs: number;         // Duration in milliseconds
albumArtUrl: string;        // URL to album artwork
source: 'spotify' | 'apple' | 'youtube';
externalUrl: string;        // Link to song on source platform
spotifyId?: string;         // Spotify ID (if available)
appleMusicId?: string;      // Apple Music ID (if available)
youtubeId?: string;         // YouTube Music ID (if available)
previewUrl?: string;        // 30s preview URL (if available)
addedBy?: string;           // Username who added (for queue items)
queuePosition?: number;     // Position in queue (1-25)
historicalVotes?: VoteData; // Cumulative votes across all plays
}
```

**Database Schema:**
```sql
CREATE TABLE songs (
id VARCHAR(100) PRIMARY KEY,
title VARCHAR(255) NOT NULL,
artist VARCHAR(255) NOT NULL,
album VARCHAR(255),
duration_ms INTEGER NOT NULL,
album_art_url TEXT NOT NULL,
spotify_id VARCHAR(100),
apple_music_id VARCHAR(100),
youtube_id VARCHAR(100),
preview_url TEXT,
external_url TEXT NOT NULL,
source VARCHAR(20) NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
times_played INTEGER DEFAULT 0,
total_thumbs_down INTEGER DEFAULT 0,
total_thumbs_up INTEGER DEFAULT 0,
total_double_thumbs_up INTEGER DEFAULT 0
);

CREATE INDEX idx_songs_spotify_id ON songs(spotify_id);
CREATE INDEX idx_songs_times_played ON songs(times_played DESC);
```

### Queue Item

**Interface:**
```typescript
interface QueueItem {
id: string;              // UUID for queue item
songId: string;          // Reference to Song.id
song: Song;              // Denormalized song data
addedBy: string;         // Username who added
addedAt: number;         // Timestamp when added
position: number;        // Position in queue (1-based)
}
```

**Constraints:**
- Maximum 25 items in queue at once
- Positions are 1-indexed (1 = next to play)
- Currently playing song has position 0 (special case)
- Positions are unique and sequential

**Database Schema:**
```sql
CREATE TABLE queue_items (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
song_id VARCHAR(100) NOT NULL REFERENCES songs(id),
added_by VARCHAR(50) NOT NULL,
added_at TIMESTAMP DEFAULT NOW(),
position INTEGER NOT NULL CHECK (position >= 1 AND position <= 25),
UNIQUE(position)
);

CREATE INDEX idx_queue_position ON queue_items(position);
```

**Zustand State:**
```typescript
interface QueueState {
items: QueueItem[];
currentlyPlaying: QueueItem | null;
count: number;              // Current number in queue (0-25)
maxCapacity: 25;
}
```

### Vote Data

**Interface:**
```typescript
interface VoteData {
thumbsDown: number;       // Count of 👎 votes
thumbsUp: number;         // Count of 👍 votes
doubleThumbsUp: number;   // Count of 👍👍 votes
}

interface Vote {
id: string;               // UUID
songId: string;           // Song being voted on
userId: string;           // User who voted
username: string;         // Display name of voter
voteType: 'thumbsDown' | 'thumbsUp' | 'doubleThumbsUp';
castAt: number;          // Timestamp
playInstance?: string;    // Optional: ID of specific play instance
}

interface UserVote {
songId: string;
voteType: 'thumbsDown' | 'thumbsUp' | 'doubleThumbsUp';
}
```

**Database Schema:**
```sql
CREATE TABLE votes (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
song_id VARCHAR(100) NOT NULL REFERENCES songs(id),
user_id UUID NOT NULL,
username VARCHAR(50) NOT NULL,
vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('thumbsDown', 'thumbsUp', 'doubleThumbsUp')),
cast_at TIMESTAMP DEFAULT NOW(),
play_instance_id UUID, -- Link to specific play_history entry
UNIQUE(song_id, user_id, play_instance_id)
);

CREATE INDEX idx_votes_song_id ON votes(song_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_username ON votes(username);
CREATE INDEX idx_votes_cast_at ON votes(cast_at DESC);
```

**Zustand State:**
```typescript
interface VoteState {
currentSongVotes: VoteData;          // Votes for currently playing song
userVote: UserVote | null;           // Current user's vote on playing song
historicalVotes: Map<string, VoteData>; // All-time votes by songId
}
```

### Genre State

**Interface:**
```typescript
interface GenreState {
currentGenre: string | null;  // e.g., "Synthwave", "90s Hip Hop"
setBy: string | null;         // Username who set it
setAt: number | null;         // Timestamp
}
```

**Database Schema:**
```sql
CREATE TABLE genres (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
set_by VARCHAR(50) NOT NULL,
set_at TIMESTAMP DEFAULT NOW(),
is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_genres_active ON genres(is_active);
```

### Admin State

**Interface:**
```typescript
interface AdminState {
currentAdmin: string | null;  // Username of current admin
grantedAt: number | null;     // Timestamp when admin status granted
}
```

**Database Schema:**
```sql
CREATE TABLE admin_state (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
granted_at TIMESTAMP DEFAULT NOW(),
is_active BOOLEAN DEFAULT TRUE
);
```

**Note:** Admin state is tightly coupled with genre state. Setting genre = becoming admin.

### Play History

**Interface:**
```typescript
interface HistoryItem {
id: string;              // UUID
songId: string;
song: Song;              // Denormalized song data
addedBy: string;         // Username who added
playedAt: number;        // Timestamp when played
voteData: VoteData;      // Final vote counts from that play
}
```

**Database Schema:**
```sql
CREATE TABLE play_history (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
song_id VARCHAR(100) NOT NULL REFERENCES songs(id),
added_by VARCHAR(50) NOT NULL,
played_at TIMESTAMP DEFAULT NOW(),
thumbs_down INTEGER DEFAULT 0,
thumbs_up INTEGER DEFAULT 0,
double_thumbs_up INTEGER DEFAULT 0,
duration_played_ms INTEGER -- How long was it actually played (for skip tracking)
);

CREATE INDEX idx_play_history_played_at ON play_history(played_at DESC);
CREATE INDEX idx_play_history_song_id ON play_history(song_id);
```

**Zustand State:**
```typescript
interface HistoryState {
items: HistoryItem[];     // Last 40 songs
maxSize: 40;
}
```

### Active Users

**Interface:**
```typescript
interface ActiveUser {
username: string;
lastSeen: number;         // Timestamp of last activity
isAdmin: boolean;
sessionId: string;
}
```

**In-Memory State:**
- Stored in server memory (not database)
- TTL: 30 minutes from last activity
- Updated via WebSocket heartbeat every 30 seconds
- Used for:
  - Admin transfer dropdown
  - Active user count display
  - Presence indicators (optional)

**Zustand State:**
```typescript
interface ActiveUsersState {
users: ActiveUser[];
count: number;
lastUpdated: number;
}
```

## Data Flow Diagrams

### Adding a Song to Queue

```text
[User clicks "ADD TO QUEUE"]
|
v
[Client validates: queue not full, user has username]
|
v
[POST /api/queue with songId, username]
|
v
[Server validates: queue count < 25, song exists]
|
v
[Insert into queue_items table at next position]
|
v
[Broadcast WebSocket event: queue:updated]
|
v
[All clients update their queue state]
|
v
[UI animates new item into queue list]
```

### Casting a Vote

```text
[User clicks vote button (👎/👍/👍👍)]
|
v
[Client validates: user has username, song is playing]
|
v
[POST /api/votes with songId, username, voteType]
|
v
[Server: upsert into votes table (replace previous vote)]
|
v
[Calculate new vote counts]
|
v
[Broadcast WebSocket event: vote:updated]
|
v
[All clients update vote counts]
|
v
[FloatingVote animation plays on all screens]
```

### Setting Genre (Becoming Admin)

```text
[User clicks "Set Genre"]
|
v
[Modal opens with genre input/quick select]
|
v
[User enters genre name, clicks "SET GENRE"]
|
v
[POST /api/genre with genre, username]
|
v
[Server: deactivate previous admin, insert new genre/admin]
|
v
[Broadcast WebSocket: genre:updated, admin:updated]
|
v
[All clients update genre display and admin status]
|
v
[Previous admin sees toast: "You are no longer admin"]
|
v
[New admin sees toast: "You are now admin"]
```

### Reordering Queue

```text
[User clicks up/down on queue item at position N]
|
v
[PATCH /api/queue/reorder with fromPosition, toPosition]
|
v
[Server: swap positions in database]
|
v
[Broadcast WebSocket: queue:updated]
|
v
[All clients update queue order]
|
v
[Smooth animation of items swapping positions]
```

### Song Playback Lifecycle

```text
[Song finishes playing OR user adds first song to empty queue]
|
v
[Auto-advance to next song in queue (position 1)]
|
v
[Remove played song from queue, shift all positions down]
|
v
[Insert into play_history with final vote counts]
|
v
[Start playing new song]
|
v
[Update currentSong state]
|
v
[Broadcast WebSocket: queue:updated]
|
v
[All clients see new song playing, updated queue]
|
v
[Reset vote UI for new song]
```

## Data Validation Rules

### Username
- **Length:** 3-20 characters
- **Allowed characters:** Alphanumeric (a-z, A-Z, 0-9), underscore (_), hyphen (-)
- **Regex:** `/^[a-zA-Z0-9_-]{3,20}$/`
- **Sanitization:** Trim whitespace, escape HTML

### Genre Name
- **Length:** 1-100 characters
- **Sanitization:** Trim whitespace, escape HTML
- **Examples:** "Rock", "90s Hip Hop", "Chill Vibes", "Synthwave"

### Queue Position
- **Range:** 1-25 (integers only)
- **Constraint:** Must be unique within queue
- **Validation:** Check constraint in database

### Vote Type
- **Enum:** `'thumbsDown' | 'thumbsUp' | 'doubleThumbsUp'`
- **Validation:** Must be one of the three allowed values

### Song ID
- **Format:** Depends on source
  - Spotify: 22-character alphanumeric (e.g., `4cOdK2wGLETKBW3PvgPWqT`)
  - Composite: `spotify:4cOdK2wGLETKBW3PvgPWqT`
- **Validation:** Regex pattern per source

## Caching Strategy

### Song Metadata
- **Cache duration:** Permanent (or until manual refresh)
- **Location:** Database (songs table)
- **Invalidation:** Only when re-fetching from API

### Vote Counts
- **Cache duration:** 5 minutes
- **Location:** In-memory (server) or Redis
- **Invalidation:** On new vote cast

### Active Users
- **Cache duration:** 30 seconds
- **Location:** In-memory (server)
- **Invalidation:** On heartbeat or disconnect

### Queue State
- **Cache duration:** Real-time (no caching)
- **Location:** Database authoritative, clients subscribe
- **Sync:** WebSocket broadcasts on every change

## Future Data Model Extensions

### User Statistics
```typescript
interface UserStats {
userId: string;
totalSongsAdded: number;
totalVotesCast: number;
favoriteGenre: string;
mostPlayedArtist: string;
memberSince: number;
}
```

### Room/Space Support
```typescript
interface Room {
id: string;
name: string;
createdBy: string;
createdAt: number;
isPrivate: boolean;
joinCode?: string;
currentQueue: QueueItem[];
currentGenre: string;
adminUser: string;
}
```

### Playlists
```typescript
interface Playlist {
id: string;
name: string;
createdBy: string;
songs: string[];  // Array of song IDs
isPublic: boolean;
createdAt: number;
}
```
