# Product Context - Team Jukebox

## Product Overview

**Team Jukebox** is a collaborative playlist application designed for groups of people in a shared physical space (e.g., office, co-working space, party) to collectively control music playback. Think of it as a communal jukebox where everyone can contribute songs, vote on what's playing, and influence the musical atmosphere together.

### Core Concept
A single-page web application that allows multiple users to:
- Search and add songs from various music streaming services (Spotify, Apple Music, YouTube Music)
- Vote on currently playing songs with three levels: 👎 (thumbs down), 👍 (thumbs up), 👍👍 (double thumbs up)
- Reorder songs in a collaborative queue (max 25 songs)
- Set and manage the current genre/mood with an admin system
- View historical votes to understand the room's musical preferences

### Key Differentiators

1. **No Traditional Authentication**: Simple username entry on first visit, stored locally. No passwords, no social login complexity.

2. **Permanent Queue**: Once a song is added to the queue, it can't be removed (only reordered). This prevents conflicts and encourages thoughtful additions.

3. **Genre Holder = Admin**: The person who sets the genre automatically becomes the room admin. They can transfer admin rights to others, creating a fluid leadership model.

4. **Visual Vote Feedback**: Floating neon sign animations show votes in real-time with the voter's username, creating a sense of shared experience.

5. **Historical Vote Tracking**: Every song tracks votes from all previous plays, building a collective memory of the group's preferences.

## Project Goals

### Primary Goals
1. **Facilitate Musical Collaboration**: Make it easy for groups to discover common musical tastes
2. **Minimize Conflict**: Design mechanics that reduce arguments about music (permanent queue, emoji-based voting)
3. **Create Shared Experience**: Visual feedback and retro aesthetic enhance the feeling of collective music enjoyment
4. **Low Barrier to Entry**: No sign-up required - just enter a username and start
5. **Room Memory**: Track historical preferences to help inform future song selection

### Success Metrics
- Average session duration > 2 hours
- Songs added per user per session > 3
- Vote participation rate > 60%
- Queue utilization > 80% full during active sessions
- User return rate > 40% (same username returning within 7 days)

## User Stories by Epic

### Epic 1: Music Playback Control

**User Story 1.1**: As a user, I want to see what song is currently playing with album art, song title, artist name, and who added it, so I know what I'm listening to.

**Acceptance Criteria:**
- Album art displays prominently (180x180px with chrome frame)
- Song title is largest text (neon-cyan, --text-2xl)
- Artist and album names are visible but secondary (text-dim)
- "Added by @username" displays in accent font below other info

**User Story 1.2**: As a user, I want to see the playback progress and time remaining, so I know when the next song will play.

**Acceptance Criteria:**
- Progress bar with chrome track and neon-pink fill
- Current time and total duration displayed in MM:SS format
- Progress bar updates smoothly in real-time
- Glow effect on the progress fill

**User Story 1.3**: As a user, I want to adjust the volume, so I can control how loud the music plays.

**Acceptance Criteria:**
- Horizontal slider with chrome track (150px wide)
- Volume icon changes based on level (🔇/🔉/🔊)
- Real-time volume adjustment
- Volume level persists across sessions (localStorage)

**User Story 1.4**: As a user, I want to see retro audio visualizations (VU meters and oscilloscope), so the interface feels more engaging and alive.

**Acceptance Criteria:**
- Two VU meters (L/R channels) with neon-pink bars
- Oscilloscope shows neon-cyan waveform with glow
- Updates at 60fps during playback
- Subtle CRT scanline overlay for retro feel

### Epic 2: Song Search & Discovery

**User Story 2.1**: As a user, I want to search for songs by title or artist name, so I can find music I want to add to the queue.

**Acceptance Criteria:**
- Search input field with chrome styling at top of search panel
- Debounced search (300ms) to reduce API calls
- Displays top 20 results with mini album art, song title, artist, duration
- Results appear below search input in scrollable list

**User Story 2.2**: As a user, I want to see autocomplete suggestions as I type, so I can discover songs more quickly.

**Acceptance Criteria:**
- Suggestions appear after 2+ characters typed
- Max 5 autocomplete suggestions
- Click or arrow keys + Enter to select suggestion
- Matches are highlighted in results

**User Story 2.3**: As a user, I want to click a search result to see more details before adding to the queue, so I can make informed choices.

**Acceptance Criteria:**
- Click result opens modal with 200x200px album art
- Modal shows song title, artist, album, duration
- Displays historical vote counts (👎 👍 👍👍)
- "ADD TO QUEUE" button adds to queue and closes modal
- "CANCEL" or X button closes modal without action

**User Story 2.4**: As a user, I want to be prevented from adding songs when the queue is full, so I understand the constraint.

**Acceptance Criteria:**
- "ADD TO QUEUE" button is disabled when queue at 25 songs
- Tooltip or message explains "Queue is full (25/25)"
- Modal still allows viewing song details

### Epic 3: Queue Management

**User Story 3.1**: As a user, I want to see the current queue with all songs, their position numbers, who added them, album art, and vote counts, so I know what's coming up.

**Acceptance Criteria:**
- Queue displays in main content area (right side)
- Header shows "QUEUE (X/25)" with current count
- Each item shows: position number (neon-amber), album art (50x50px), song title, artist, duration, "Added by @username", vote counts
- Currently playing song has neon-cyan left border (4px)
- Items have chrome bottom borders

**User Story 3.2**: As a user, I want to reorder songs in the queue by moving them up or down, so I can influence what plays next.

**Acceptance Criteria:**
- Each queue item has up (↑) and down (↓) chrome circular buttons
- Up button disabled for song in position 1
- Down button disabled for last song in queue
- Both buttons disabled for currently playing song
- Clicking moves song one position in that direction
- Smooth animation when reordering (400ms)

**User Story 3.3**: As a user, I want the queue to update in real-time when others add or reorder songs, so I always see the current state.

**Acceptance Criteria:**
- Queue changes sync via WebSocket (< 1 second latency)
- Smooth transitions when items are added/reordered
- No flickering or UI jumps
- Conflict resolution (last write wins for reordering)

**User Story 3.4**: As a user, I want to see an encouraging message when the queue is empty, so I'm motivated to add songs.

**Acceptance Criteria:**
- Large "QUEUE EMPTY" text in neon-pink
- Subtitle: "Search and add songs to get started"
- Pulsing glow effect
- Message disappears when first song added

### Epic 4: Voting System

**User Story 4.1**: As a user, I want to vote on the currently playing song with three options (👎 👍 👍👍), so I can express my opinion.

**Acceptance Criteria:**
- Three circular chrome vote buttons (60px diameter) in audio player
- Icons clearly represent vote types: 👎 👍 👍👍
- User can vote once per song (can change vote)
- Selected vote button has neon-pink glow
- Hover effect: subtle neon pulse
- Buttons disabled if user hasn't entered username

**User Story 4.2**: As a user, I want to see my vote trigger a floating neon sign animation with my username, so I get immediate satisfying feedback.

**Acceptance Criteria:**
- Vote triggers floating emoji (3rem font size) with neon glow
- Animation: float from bottom (y: 100%) to top (y: -10%) in 2.5s
- Includes voter's username in accent font below emoji
- Slight flicker effect (neon sign style)
- Slight rotation (-15° to 15°) and scale variation (0.8 → 1.2 → 1)
- Multiple simultaneous votes have staggered start times

**User Story 4.3**: As a user, I want to see the current vote counts for the playing song update in real-time, so I know how others feel about it.

**Acceptance Criteria:**
- Vote counts display below vote buttons
- Numbers update immediately when anyone votes
- Count increment animates (number flip effect)
- Visible for currently playing song only

**User Story 4.4**: As a user, I want to see vote counts for songs in the queue and history, so I can gauge the room's preferences.

**Acceptance Criteria:**
- Each queue item shows vote counts in small format
- History items show final vote counts from when played
- Vote icons and counts styled with neon colors
- No interactive voting on queue/history items (only current song)

**User Story 4.5**: As a user, I want votes to be saved permanently for each song, so historical preferences inform future additions.

**Acceptance Criteria:**
- All votes stored in database with songId, userId, voteType, timestamp
- Song detail modal shows cumulative votes across all plays
- Historical data helps users make informed decisions

### Epic 5: User Management

**User Story 5.1**: As a first-time user, I want to enter a username when I arrive, so I can participate in the jukebox.

**Acceptance Criteria:**
- Modal appears on page load if no username in localStorage
- Modal has chrome frame on dark backdrop (non-dismissible)
- Input field for username (3-20 characters, alphanumeric + _ -)
- "JOIN THE JUKEBOX" button submits form
- Real-time validation with error messages
- Input auto-focuses on modal open
- Enter key submits form

**User Story 5.2**: As a returning user, I want my username to be remembered automatically, so I don't have to re-enter it every visit.

**Acceptance Criteria:**
- Username stored in localStorage with unique sessionId
- No expiration (persists until user clears storage)
- Auto-login on page load if valid session exists
- Last activity timestamp updates on each interaction

**User Story 5.3**: As a user, I want to see my current username in the status bar, so I know which account I'm using.

**Acceptance Criteria:**
- "👤 Logged in as: @yourusername" displayed at bottom of jukebox
- Small, unobtrusive text (--text-xs, text-dim)
- Accent font for username
- Always visible in status bar

**User Story 5.4**: As a user, I want every action I take (adding songs, voting, reordering) to be attributed to my username, so there's accountability and recognition.

**Acceptance Criteria:**
- "Added by @username" shows on every queue item
- Username appears in floating vote animations
- History shows who added each song
- Admin status shows current admin's username

### Epic 6: Genre Management & Admin System

**User Story 6.1**: As a user, I want to see the current genre/mood at the bottom of the jukebox, so I understand the intended musical direction.

**Acceptance Criteria:**
- "🎵 Genre: [name]" displayed in genre/admin bar
- Neon-pink color and secondary display font
- "No genre set" message if none
- Genre name is descriptive (e.g., "Synthwave", "90s Hip Hop", "Chill Vibes")

**User Story 6.2**: As any user, I want to set the genre by clicking "Set Genre" and choosing from common options or entering a custom one, so I can guide the musical direction.

**Acceptance Criteria:**
- "Set Genre" button visible to all users in genre bar
- Clicking opens modal with chrome frame
- Custom text input for genre name + quick select buttons (Rock, Pop, Jazz, Hip Hop, Electronic, Classical)
- Warning: "Note: Setting genre makes you the admin"
- "SET GENRE" button updates genre and grants admin status
- Previous admin loses admin status

**User Story 6.3**: As the current admin, I want to see a crown icon next to my username and have admin privileges, so my role is clear.

**Acceptance Criteria:**
- "👑 Admin: @username" displayed in neon-amber in admin bar
- Crown icon appears next to admin username in status bar
- Crown icon appears next to admin's queue items
- Admin sees "Transfer Rights" button

**User Story 6.4**: As the current admin, I want to transfer admin rights to another active user, so leadership can change hands.

**Acceptance Criteria:**
- "Transfer Rights" button only visible to current admin
- Clicking opens modal with list of active users (last 30 min)
- Select user from list
- Warning: "Note: You will lose admin privileges"
- "TRANSFER" button executes transfer
- All clients notify new admin and update UI

**User Story 6.5**: As a user, I want admin changes to sync immediately across all connected clients, so everyone sees the current state.

**Acceptance Criteria:**
- Admin changes broadcast via WebSocket
- Crown icon updates on all clients in < 1 second
- Notification toast appears for affected users
- Genre bar updates reflect change

### Epic 7: Song Information Access

**User Story 7.1**: As a user, I want to click any song in the queue or history to see its details, so I can learn more about it.

**Acceptance Criteria:**
- Clicking queue or history item opens song detail modal
- Modal shows same information as from search results
- "ADD TO QUEUE" button available if not in current queue
- Historical vote counts displayed

**User Story 7.2**: As a user, I want to see the last 40 songs played in a history panel, so I can reference what was played recently.

**Acceptance Criteria:**
- History panel accessible via tab navigation (QUEUE | HISTORY)
- Shows last 40 songs in reverse chronological order
- Each item shows: album art, song info, "Added by" username, final vote counts
- Timestamp: "Played X min ago" (relative time)
- Scrollable list with chrome dividers

**User Story 7.3**: As a user, I want history items to be slightly dimmed compared to the queue, so I can visually distinguish past from future.

**Acceptance Criteria:**
- History items have slightly dimmer overall appearance
- Same layout as queue items but no reorder buttons
- No "currently playing" highlight
- Chrome dividers between items

## Technical Requirements

### Multi-API Music Service Support
- **Primary**: Spotify Web API (with client credentials OAuth flow)
- **Fallback Tier 1**: Apple Music API
- **Fallback Tier 2**: YouTube Music API
- Search results normalized to common Song interface
- Graceful degradation if primary service unavailable

### Data Persistence
- **User sessions**: localStorage (username + sessionId, no expiration)
- **Queue state**: PostgreSQL database (Supabase or Vercel Postgres)
- **Vote history**: PostgreSQL with indexes for fast retrieval
- **Genre/Admin state**: PostgreSQL, synced via WebSocket
- **Active users**: In-memory with 30-minute TTL, synced via heartbeat

### Real-Time Synchronization (WebSocket or Supabase Realtime)
- Queue updates (add, reorder) sync in < 1 second
- Vote counts update in real-time
- Genre/admin changes broadcast immediately
- Active user list updates every 30 seconds (heartbeat)
- Conflict resolution: Last write wins

### Performance Requirements
- Search results return in < 2 seconds (includes API round-trip)
- Vote retrieval < 500ms
- WebSocket latency < 1 second
- Audio visualizations maintain 60fps
- Initial page load < 3 seconds (LCP)

### Browser Compatibility
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Web Audio API required for visualizations

## Future Considerations (Post-MVP)

### User Features
- Optional user authentication (email/password)
- Change username option
- User profiles with statistics
- Logout functionality

### Room Features
- Multiple independent rooms
- Private rooms with join codes
- Room creation and settings
- Room-specific genres and preferences

### Social Features
- Friend lists and following
- Direct messages between users
- Collaborative playlists
- Room chat

### Enhanced Voting
- Skip voting (if enough 👎 votes, skip to next song)
- Ban songs from queue (admin privilege)
- Upvote limit per user per session

### Advanced Analytics
- Most popular songs/artists in room
- User taste profiles
- Genre trend analysis
- Time-of-day listening patterns
