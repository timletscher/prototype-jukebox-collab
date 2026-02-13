# Team Jukebox — Product Requirements Document (PRD)

**Product Requirements Document:** Team Jukebox

## 1. Product Overview

**Product Name:** Team Jukebox

**Purpose:** A collaborative playlist application that enables team members to collectively curate and enjoy music together through a shared browser-based audio player.

**Target Users:** Teams working in shared physical or virtual spaces who want to create a collaborative music listening experience.

## 2. Goals & Objectives

Enable seamless collaborative music curation among team members

Create an engaging, interactive music listening experience

Foster team connection through shared musical preferences

Provide transparent queue management and playback history

Maintain song popularity metrics across sessions

## 3. User Stories & Acceptance Criteria

### Epic 1: Music Playback & Control

#### User Story 1.1: Continuous Playback

As a team member
I want the jukebox to play songs continuously until the queue is empty
So that we have uninterrupted music during our work session

**Acceptance Criteria**

- [ ] Audio player automatically advances to the next song when current song ends

- [ ] Playback continues until no songs remain in queue

- [ ] When queue is empty, player displays "Queue Empty" state

- [ ] Player does not loop or restart queue automatically

#### User Story 1.2: Volume Control

As a user
I want to adjust the playback volume
So that I can set the music to a comfortable listening level

**Acceptance Criteria**

- [ ] Volume control slider is visible on the player interface

- [ ] Volume can be adjusted from 0% (mute) to 100% (max)

- [ ] Volume changes take effect immediately

- [ ] Volume setting persists for the user's session

- [ ] Visual indicator shows current volume level

### Epic 2: Song Search & Discovery

#### User Story 2.1: Song Search

As a team member
I want to search for songs by name or artist
So that I can find and add specific tracks to the queue

**Acceptance Criteria**

- [ ] Search input field is prominently displayed

- [ ] Search accepts both song names and artist names

- [ ] Results are retrieved from available music APIs

- [ ] Results are displayed in a list sorted by relevance

- [ ] Search handles partial matches

- [ ] Empty search state displays helpful message

#### User Story 2.2: Search Autocomplete

As a user
I want search suggestions as I type
So that I can quickly find songs without typing the full name

**Acceptance Criteria**

- [ ] Autocomplete suggestions appear after typing 2+ characters

- [ ] Suggestions update dynamically as user types

- [ ] Suggestions are retrieved from available music APIs

- [ ] User can select a suggestion with mouse or keyboard

- [ ] Selecting a suggestion populates the search field and executes search

#### User Story 2.3: Song Details Modal

As a user
I want to view detailed information about a song before adding it
So that I can confirm it's the correct track

**Acceptance Criteria**

- [ ] Clicking a search result opens a modal with song details

- [ ] Modal displays: song title, artist name, album name, album art, duration

- [ ] Modal displays historical vote counts (if song was played previously)

- [ ] Modal includes "Add to Queue" button

- [ ] Modal includes "Cancel" button

- [ ] Modal includes "Close" button (X icon)

- [ ] Clicking Cancel or Close dismisses modal without adding song

- [ ] Clicking outside modal dismisses it

- [ ] Modal is keyboard accessible (ESC to close)

#### User Story 2.4: Add Song to Queue

As a team member
I want to add songs from search results to the queue
So that my song choices will be played

**Acceptance Criteria**

- [ ] "Add to Queue" button is visible in song details modal

- [ ] Clicking "Add to Queue" adds song to the end of the queue (if space available)

- [ ] If queue is full (25 songs), user receives error message

- [ ] Modal closes after successfully adding song

- [ ] User receives confirmation that song was added

- [ ] Newly added song appears in queue view immediately

- [ ] Duplicate songs can be added to queue

- [ ] Song retains its historical vote count when added

### Epic 3: Queue Management

#### User Story 3.1: View Upcoming Queue

As a team member
I want to see the list of upcoming songs
So that I know what music is coming next

**Acceptance Criteria**

- [ ] Queue view displays all upcoming songs in order

- [ ] Each queue item shows: song title, artist, album art, duration, vote counts

- [ ] Currently playing song is clearly indicated/highlighted

- [ ] Queue updates in real-time as songs are added or reordered

- [ ] Queue shows position number for each song

- [ ] Empty queue displays appropriate message

- [ ] Queue displays "X of 25 slots filled" indicator

#### User Story 3.2: Queue Capacity Limit

As a system
I want to limit the queue to 25 songs
So that the playlist remains manageable and responsive

**Acceptance Criteria**

- [ ] Queue cannot exceed 25 songs

- [ ] Attempting to add to full queue displays error message

- [ ] Queue capacity indicator is visible to all users

- [ ] As songs play and complete, queue capacity updates

- [ ] Users can add songs once capacity becomes available

#### User Story 3.3: Reorder Queue

As a team member
I want to shuffle songs up or down in the queue
So that we can adjust the play order based on team preferences

**Acceptance Criteria**

- [ ] Each queue item has "Move Up" and "Move Down" controls

- [ ] "Move Up" is disabled for the first song in queue

- [ ] "Move Down" is disabled for the last song in queue

- [ ] Moving a song updates queue order immediately

- [ ] Queue position numbers update after reordering

- [ ] Currently playing song cannot be moved

- [ ] All users see the updated queue order in real-time

#### User Story 3.4: Queue Permanence

As a team member
I want songs to remain in the queue once added
So that the jukebox operates like a traditional public jukebox

**Acceptance Criteria**

- [ ] No "Remove" or "Delete" button exists for queued songs

- [ ] Songs can only leave queue by being played

- [ ] Users cannot skip currently playing song

- [ ] Only reordering (up/down) is permitted, not removal

#### User Story 3.5: View Play History

As a team member
I want to see previously played songs in a separate tab
So that I can remember what we've listened to

**Acceptance Criteria**

- [ ] History tab is accessible from main navigation

- [ ] History displays songs in reverse chronological order (most recent first)

- [ ] History is limited to the 40 most recent songs

- [ ] Each history item shows: song title, artist, timestamp played, final vote counts

- [ ] History persists for the current session

- [ ] User can click on history items to view song details

- [ ] Oldest song is removed when 41st song is added to history

### Epic 4: Voting & Engagement

#### User Story 4.1: Vote on Playing Song

As a team member
I want to vote on the currently playing song
So that I can express my opinion about the music

**Acceptance Criteria**

- [ ] Three voting options are visible: Thumbs Down (👎), Thumbs Up (👍), Double Thumbs Up (👍👍)

- [ ] Voting buttons are only active for the currently playing song

- [ ] User can only cast one vote per song

- [ ] User can change their vote before song ends

- [ ] Vote count is displayed for each vote type on the song's line item

- [ ] Votes are visible to all users in real-time

- [ ] Voting does not affect queue order

#### User Story 4.2: Visual Vote Feedback

As a user
I want to see animated feedback when someone votes
So that the experience feels interactive and engaging

**Acceptance Criteria**

- [ ] When a vote is cast, corresponding icon (👎, 👍, or 👍👍) animates on screen

- [ ] Icon floats from bottom to top of browser window

- [ ] Animation is similar to reactions in Teams/Zoom

- [ ] Multiple votes can animate simultaneously

- [ ] Animation does not obstruct critical UI elements

- [ ] Animation completes within 2-3 seconds

#### User Story 4.3: Persistent Vote History

As a system
I want to retain vote counts for songs across sessions
So that popular songs display their historical popularity

**Acceptance Criteria**

- [ ] Vote counts are stored permanently in database

- [ ] When a song is added to queue, historical vote counts are retrieved

- [ ] Historical votes are displayed in queue view

- [ ] New votes during current play are added to historical total

- [ ] Vote history is displayed in song details modal

- [ ] Vote counts include: total thumbs down, total thumbs up, total double thumbs up

- [ ] Vote counts persist even after song leaves history

### Epic 5: User Management & Profiles

#### User Story 5.1: User Profile Creation

As a team member
I want to create a user profile
So that I can participate in the jukebox and potentially become genre holder

**Acceptance Criteria**

- [ ] Users can create a profile with username/display name

- [ ] Username must be unique within the jukebox session

- [ ] User profile persists for the session

- [ ] User's display name appears with their actions (adding songs, voting)

- [ ] Profile includes user role (standard user or admin)

#### User Story 5.2: Admin Role & Privileges

As an admin user
I want enhanced privileges
So that I can moderate the jukebox experience

**Acceptance Criteria**

- [ ] Admin users have all standard user capabilities

- [ ] Admin users can reorder any song in the queue

- [ ] Admin role is visually indicated in the UI

- [ ] Only one admin exists at a time (the current genre holder)

- [ ] Admin privileges are clearly documented in help/info section

### Epic 6: Genre Management

#### User Story 6.1: Set Current Genre

As a team member
I want to suggest and set a genre for the current music selection
So that we can guide the overall mood and style of our playlist

**Acceptance Criteria**

- [ ] Genre setting interface is accessible from main view

- [ ] Users can input custom genre or select from common genre options

- [ ] Only one genre is active at a time

- [ ] Current genre is displayed prominently

- [ ] Genre setter automatically becomes admin/genre holder

- [ ] Previous genre holder loses admin privileges when new genre is set

- [ ] Genre changes are reflected in real-time for all users

#### User Story 6.2: Genre Holder Admin Rights

As a genre holder
I want to automatically receive admin privileges
So that I can guide the musical direction I've established

**Acceptance Criteria**

- [ ] User who sets current genre becomes admin automatically

- [ ] Admin badge/indicator appears next to genre holder's name

- [ ] Previous genre holder's admin status is revoked

- [ ] Genre holder retains admin rights until they transfer or new genre is set

- [ ] System notifies user when they become admin

#### User Story 6.3: Transfer Genre Holder Rights

As a genre holder (admin)
I want to grant another user genre holder status
So that I can relinquish control while maintaining continuity

**Acceptance Criteria**

- [ ] Admin can access "Transfer Admin Rights" option

- [ ] Admin can select from list of active users

- [ ] Transfer requires confirmation

- [ ] Upon transfer, new user becomes admin/genre holder

- [ ] Original admin loses admin privileges

- [ ] Current genre remains unchanged during transfer

- [ ] All users are notified of admin change

- [ ] New admin can immediately exercise admin privileges

### Epic 7: Song Information Access

#### User Story 7.1: Quick Song Details

As a user
I want to click on any song to view its details
So that I can learn more about songs in the queue or history

**Acceptance Criteria**

- [ ] Songs in queue are clickable

- [ ] Songs in history are clickable

- [ ] Clicking opens modal with song details

- [ ] Modal displays: song title, artist, album, album art, duration, source link

- [ ] Modal displays historical vote counts

- [ ] Modal can be closed via X button, Cancel button, or ESC key

- [ ] Modal does not include "Add to Queue" for songs already in queue

- [ ] Modal includes "Add to Queue" for songs in history (if queue not full)

## 4. Technical Requirements

Integration

Multi-API Music Service Support

**Primary:** Spotify Web API

**Fallback options:** Apple Music API, YouTube Music API, or other services

Backend intelligently selects available and stable API

Graceful degradation if primary service is unavailable

Consistent data model across different music services

Data Persistence

User profiles stored in database

Vote history stored permanently with song identifiers

Genre and admin status tracked in session state

Play history limited to 40 most recent songs

Real-time Synchronization

Queue updates propagate to all users within 1 second

Vote counts update in real-time

Admin status changes reflected immediately

Genre changes synchronized across all clients

Performance

Search results return within 2 seconds

Smooth animation performance (60fps for vote animations)

Historical vote data retrieval within 500ms

Browser Compatibility

Support for modern browsers (Chrome, Firefox, Safari, Edge)

Responsive design for various screen sizes

## 5. Data Models

User Profile

```json

{

```

**userId:** string,

**displayName:** string,

**isAdmin:** boolean,

**isGenreHolder:** boolean,

**createdAt:** timestamp

```json

}

```

Song

```json

{

```

**songId:** string,

**title:** string,

**artist:** string,

**album:** string,

**albumArt:** url,

**duration:** number,

**sourceApi:** string,

**sourceUrl:** string,

**historicalVotes:** {

**thumbsDown:** number,

**thumbsUp:** number,

**doubleThumbsUp:** number

```json

}

}

```

Queue Item

```json

{

```

**queuePosition:** number,

**song:** Song,

**addedBy:** userId,

**addedAt:** timestamp,

**currentVotes:** {

**thumbsDown:** number,

**thumbsUp:** number,

**doubleThumbsUp:** number

```json

}

}

```

Genre

```json

{

```

**genreName:** string,

**setBy:** userId,

**setAt:** timestamp

```json

}

```

## 6. User Interface Requirements

Main View Components

Audio Player Controls - Play/pause, progress bar, volume control

Currently Playing Display - Song info, album art, voting buttons

Queue View - Scrollable list of upcoming songs (max 25)

Search Interface - Search bar with autocomplete

Genre Display - Current genre and genre holder name

User Profile Indicator - Display name and admin badge (if applicable)

Navigation Tabs - Queue, History

Admin-Specific UI

"Transfer Admin Rights" button (visible only to admin)

Enhanced visual indicator of admin status

Admin badge next to username

## 7. Security & Access Control

User Permissions

**Standard Users:** Search, add songs (if queue not full), vote, reorder songs, set genre

**Admin Users:** All standard permissions + transfer admin rights

Data Validation

Queue capacity enforced server-side

Vote uniqueness per user per song enforced

Admin status changes validated

Genre holder transfers require valid target user

## 8. Error Handling

User-Facing Errors

Queue full (25 songs) - "Queue is full. Please wait for songs to play."

API unavailable - "Music service temporarily unavailable. Trying alternate source..."

Invalid song selection - "Song could not be loaded. Please try another."

Transfer admin to invalid user - "Selected user is not available."

System Errors

API failover logic activates automatically

Graceful degradation if real-time sync fails

Vote data persists even if display temporarily fails

## 9. Future Considerations (Out of Scope for v1)

Persistent user accounts across sessions

Playlist saving and sharing

Advanced voting algorithms to auto-skip heavily downvoted songs

Private/public room options

Mobile app versions

Integration with additional music services

Playlist analytics and insights

Scheduled genre changes

Multi-genre support

## 10. Success Metrics

Average session duration

Number of songs added per user

Voting participation rate

Genre holder transfer frequency

API failover success rate

User retention across sessions

## 11. Resolved Questions

**Queue length limit:** 25 songs maximum

**API availability:** Multi-API support with intelligent backend selection

**Song removal:** Not permitted - songs must play once queued

**Admin role:** Yes - genre holder has admin privileges, transferable

**Play history retention:** Limited to 40 most recent songs

**Voting effect on queue:** No effect on order; displays popularity visually with persistent vote counts

**Document Version:** 2.0
Last Updated: February 12, 2026
Owner: [Tim Letscher]

# Design Document: Team Jukebox

Version 1.1 - MVP Web Application (Updated)

## 1. Design Vision & Aesthetic

Core Design Philosophy

Chrome Dreams & Neon Nights - A pristine, polished retro-futuristic jukebox experience that blends 1950s diner chrome aesthetics with vibrant neon accents and subtle steampunk mechanical elements.

Visual Inspiration

Polished chrome Wurlitzer jukeboxes with clean lines

Vintage neon signage (pink, cyan, amber glow effects)

1950s diner aesthetic - streamlined, optimistic, futuristic

Analog audio equipment (VU meters, oscilloscopes)

Key Visual Principles

Pristine & Polished: Clean, well-maintained appearance

Subtle Motion: Purposeful, non-distracting animations

Neon Accents: Strategic use of glowing pink, cyan, and amber

Chrome Simplicity: Streamlined frames and borders

## 2. Color Palette

Primary Colors

```css

--chrome-light: #E8E8E8      /* Polished chrome highlights */

--chrome-base: #C0C0C0        /* Main chrome body */

--chrome-dark: #8B8B8B        /* Chrome shadows/depth */

--chrome-darkest: #4A4A4A     /* Deep shadows */

Neon Accent Colors

```

```css

--neon-pink: #FF10F0          /* Primary neon - votes, highlights */

--neon-cyan: #00F0FF          /* Secondary neon - active states */

--neon-amber: #FFB000         /* Tertiary neon - warnings, admin */

--neon-pink-glow: rgba(255, 16, 240, 0.6)

--neon-cyan-glow: rgba(0, 240, 255, 0.6)

--neon-amber-glow: rgba(255, 176, 0, 0.6)

Supporting Colors

```

```css

--background-dark: #1A1A1A    /* Deep background */

--background-medium: #2D2D2D  /* Secondary surfaces */

--text-light: #FFFFFF         /* Primary text */

--text-dim: #B0B0B0          /* Secondary text */

--glass-overlay: rgba(255, 255, 255, 0.05)

```

## 3. Typography

Font Families

Primary Display Font: "Bungee Shade" or "Righteous" (Google Fonts)

Usage: Main headings, jukebox title, genre display

Characteristics: Bold, retro diner signage feel

Secondary Display Font: "Audiowide" or "Orbitron" (Google Fonts)

Usage: Song titles, artist names, section headers

Characteristics: Futuristic yet retro, clean readability

Body Font: "Space Mono" or "Roboto Mono" (Google Fonts)

Usage: Queue lists, timestamps, technical info

Characteristics: Monospace, technical feel

Accent Font: "Pacifico" or "Satisfy" (Google Fonts)

Usage: User names, special callouts

Characteristics: Retro script, diner menu style

Type Scale

```css

--text-xs: 0.75rem    /* 12px - timestamps, metadata */

--text-sm: 0.875rem   /* 14px - body text, labels */

--text-base: 1rem     /* 16px - standard text */

--text-lg: 1.25rem    /* 20px - song titles */

--text-xl: 1.5rem     /* 24px - section headers */

--text-2xl: 2rem      /* 32px - main display */

--text-3xl: 3rem      /* 48px - hero text */

```

## 4. Layout & Structure

Overall Layout (Next.js App Router Structure)

```text

app/

├── layout.tsx          # Root layout with jukebox chrome frame

├── page.tsx            # Main jukebox interface

├── components/

│   ├── JukeboxFrame/   # Chrome frame wrapper

│   ├── AudioPlayer/    # Top-anchored player

│   ├── VUMeters/       # Audio visualization

│   ├── QueuePanel/     # Song queue display

│   ├── SearchPanel/    # Search interface

│   ├── HistoryPanel/   # Play history

│   ├── VoteButton/     # Neon vote buttons

│   ├── UsernameEntry/  # Simple username modal

│   └── GenreAdmin/     # Genre and admin controls

├── styles/

│   └── globals.css     # Design system tokens

└── lib/

    ├── audio/          # Audio context & controls

    └── session/        # Session management (localStorage)

```

Viewport Layout

```text

┌─────────────────────────────────────────────────┐

│  CHROME FRAME BORDER (top curve)                │

│  TEAM JUKEBOX                                   │

├─────────────────────────────────────────────────┤

│                                                 │

│  ┌───────────────────────────────────────────┐ │

│  │   NOW PLAYING                             │ │

│  │   [Album Art] Song Title - Artist         │ │

│  │   ████████████░░░░░░ 2:34 / 3:45         │ │

│  │   [VU Meters] [Oscilloscope]              │ │

│  │   👎 👍 👍👍  [Volume ▓▓▓▓▓▓▓░░░]        │ │

│  └───────────────────────────────────────────┘ │

│                                                 │

│  ┌─────────────┬───────────────────────────────┤

│  │   SEARCH    │     QUEUE (15/25)             │

│  │             │  ┌─────────────────────────┐  │

│  │ [Search Box]│  │ 1. Song Title           │  │

│  │             │  │    Artist • 3:45  ↑↓    │  │

│  │ Results:    │  │    👎2 👍8 👍👍3        │  │

│  │ • Song 1    │  │    Added by @user       │  │

│  │ • Song 2    │  ├─────────────────────────┤  │

│  │ • Song 3    │  │ 2. Song Title           │  │

│  │             │  │    Artist • 4:12  ↑↓    │  │

│  │             │  │    👎0 👍5 👍👍1        │  │

│  │             │  │    Added by @user       │  │

│  │             │  └─────────────────────────┘  │

│  └─────────────┴───────────────────────────────┤

│                                                 │

│  [QUEUE TAB] [HISTORY TAB]                     │

│  Genre: Synthwave 🎵 | Admin: @username        │

│  Logged in as: @yourusername                   │

└─────────────────────────────────────────────────┘

```

Responsive Breakpoints

```css

--mobile: 320px - 768px    /* Stack vertically */

--tablet: 769px - 1024px   /* Hybrid layout */

--desktop: 1025px+         /* Full jukebox layout */

```

## 5. Component Specifications

### 5.1 Jukebox Frame Component

**Visual Design**

Polished chrome border with subtle gradient

Rounded top corners (border-radius: 40px 40px 0 0)

Inner shadow for depth

Subtle neon underglow (pink/cyan alternating)

Title "TEAM JUKEBOX" at top center in neon-pink display font

**Technical Specs**

```tsx

// components/JukeboxFrame/JukeboxFrame.tsx

interface JukeboxFrameProps {

  children: React.ReactNode;

}

// Styling approach

- Outer container: chrome gradient border

- Inner container: dark background with glass overlay

- Border width: 20px (desktop), 12px (mobile)

- Padding: 24px

- Box shadow: Multiple layers for depth

CSS Effects:

```

```css

.jukebox-frame {

  background: linear-gradient(135deg,

    var(--chrome-light) 0%,

    var(--chrome-base) 50%,

    var(--chrome-dark) 100%

  );

  border-radius: 40px 40px 0 0;

  padding: 20px;

  box-shadow:

    inset 0 2px 4px rgba(255,255,255,0.3),

    inset 0 -2px 4px rgba(0,0,0,0.3),

    0 0 40px var(--neon-pink-glow);

}

.jukebox-title {

  font-family: var(--font-display);

  font-size: var(--text-3xl);

  color: var(--neon-pink);

  text-align: center;

  text-shadow: 0 0 20px var(--neon-pink-glow);

  letter-spacing: 0.1em;

  margin-bottom: var(--space-lg);

}

```

### 5.2 Username Entry Component (First Visit)

Purpose: Simple modal that appears on first visit to set username

**Visual Design**

```tsx

// components/UsernameEntry/UsernameEntry.tsx

Layout:

┌─────────────────────────────────────┐

│                                     │

│     WELCOME TO TEAM JUKEBOX         │

│                                     │

│     Enter your name to join:        │

│                                     │

│     ┌─────────────────────────┐    │

│     │ [Username input]        │    │

│     └─────────────────────────┘    │

│                                     │

│     [JOIN THE JUKEBOX]              │

│                                     │

└─────────────────────────────────────┘

- Width: 400px (max)

- Chrome frame with dark background

- Backdrop: rgba(0,0,0,0.9) - cannot dismiss

- Title: Display font, neon-cyan

- Input: Chrome-styled, auto-focused

- Button: Primary button style

- Cannot be closed until username entered

Technical Implementation:

```

```tsx

interface UsernameEntryProps {

  onSubmit: (username: string) => void;

}

// State management

- Check localStorage for existing username on mount

- If no username, show modal

- On submit:

  - Validate username (3-20 chars, alphanumeric + underscore)

  - Save to localStorage

  - Save to session state

  - Close modal

  - Enable jukebox interaction

// Validation rules

- Min length: 3 characters

- Max length: 20 characters

- Allowed: a-z, A-Z, 0-9, underscore, hyphen

- Display name format: @username

User Experience:

First Visit Flow:

```

## 1. User lands on page

## 2. Jukebox frame loads (slightly blurred)

## 3. Username modal appears (centered, focused)

## 4. User enters name

## 5. Clicks "Join the Jukebox"

## 6. Modal fades out

## 7. Jukebox becomes interactive

## 8. Username stored in localStorage

## 9. Future visits: auto-login with stored username

**Returning Visit Flow**

## 1. User lands on page

## 2. Username retrieved from localStorage

## 3. Jukebox immediately interactive

## 4. Username displayed in status bar

### 5.3 Audio Player Component (Top-Anchored)

**Layout**

Fixed to top of content area

Full width within chrome frame

Height: ~250px

Background: Dark with subtle chrome accents

**Sub-components**

Album Art Display

```tsx

// components/AudioPlayer/AlbumArt.tsx

- Size: 180x180px

- Simple chrome frame (8px border)

- Subtle inner shadow

- Rounded corners: 4px

- Spinning animation on play (subtle, 60s rotation)

Now Playing Info

```

```tsx

// components/AudioPlayer/NowPlayingInfo.tsx

- Song title: --text-2xl, neon-cyan color

- Artist: --text-lg, text-dim color

- Album: --text-sm, text-dim color

- Added by: --text-sm, accent font, text-dim

  Format: "Added by @username"

Progress Bar

```

```tsx

// components/AudioPlayer/ProgressBar.tsx

- Chrome track with neon-pink fill

- Height: 8px

- Rounded ends

- Time display: Monospace font, --text-sm

- Glow effect on fill

VU Meters

```

```tsx

// components/AudioPlayer/VUMeters.tsx

- Two vertical meters (L/R channels)

- Chrome frame with glass face

- Neon-pink bars that bounce with audio

- Scale markings: -20, -10, -5, 0, +3 dB

- Needle overlay (optional for extra retro feel)

- Size: 40px wide x 120px tall each

- Update rate: 60fps

Oscilloscope

```

```tsx

// components/AudioPlayer/Oscilloscope.tsx

- Canvas element: 200px x 80px

- Dark background with subtle grid

- Neon-cyan waveform

- Glow effect on line

- Retro CRT scanline overlay (subtle)

Vote Buttons

```

```tsx

// components/AudioPlayer/VoteButtons.tsx

- Three circular chrome buttons

- Size: 60px diameter

- Icons: 👎 👍 👍👍

- Inactive: Chrome with dim text

- Active: Neon glow (pink for selected)

- Hover: Subtle neon pulse

- Click: Bright flash, trigger floating animation

- Disabled if user hasn't entered username

Volume Control

```

```tsx

// components/AudioPlayer/VolumeControl.tsx

- Horizontal slider

- Chrome track with neon-cyan fill

- Circular chrome knob

- Icon: 🔇 to 🔊 based on level

- Width: 150px

```

### 5.4 Vote Animation Component

**Floating Neon Signs**

```tsx

// components/VoteAnimation/FloatingVote.tsx

interface FloatingVoteProps {

  type: 'thumbsDown' | 'thumbsUp' | 'doubleThumbsUp';

  startX: number; // Random x position

  username: string; // Show who voted

}

// Animation specs:

- Start: Bottom of viewport (y: 100%)

- End: Top of viewport (y: -10%)

- Duration: 2.5s

- Easing: ease-out

- Opacity: 0 → 1 → 0 (fade in/out)

- Scale: 0.8 → 1.2 → 1 (slight grow)

- Rotation: Random -15° to 15°

- Optional: Small username label below icon

Visual Style:

```

```css

.floating-vote {

  /* Neon sign effect */

  font-size: 3rem;

  filter: drop-shadow(0 0 10px var(--neon-pink));

  animation: flicker 0.1s infinite alternate;

}

.floating-vote-username {

  font-family: var(--font-accent);

  font-size: var(--text-xs);

  color: var(--text-dim);

  text-align: center;

  margin-top: 4px;

}

@keyframes flicker {

  0%, 100% { opacity: 1; }

  50% { opacity: 0.8; }

}

```

### 5.5 Search Panel Component

**Layout**

Left sidebar: 300px wide (desktop)

Collapsible on mobile

Chrome frame with dark interior

**Search Input**

```tsx

// components/SearchPanel/SearchInput.tsx

- Chrome-styled input field

- Neon-cyan focus glow

- Autocomplete dropdown below

- Monospace font for input

- Height: 48px

- Padding: 12px 16px

- Placeholder: "Search songs or artists..."

- Disabled if user hasn't entered username

Search Results:

```

```tsx

// components/SearchPanel/SearchResults.tsx

- Scrollable list (max-height: 400px)

- Each result:

  - Mini album art (40x40px)

  - Song title (--text-base)

  - Artist (--text-sm, dim)

  - Duration (--text-xs)

  - Chrome divider between items

- Hover: Neon-pink left border

- Click: Open modal

- Show top 20 results

```

### 5.6 Queue Panel Component

**Layout**

Main content area (right side)

Header shows: "QUEUE (X/25)"

Scrollable list

**Queue Item**

```tsx

// components/QueuePanel/QueueItem.tsx

interface QueueItemProps {

  position: number;

  song: Song;

  addedBy: string;

  isPlaying: boolean;

  isAdmin: boolean;

  currentUser: string;

}

// Visual layout per item:

┌─────────────────────────────────────────┐

│ [#] [Album] Song Title                  │

│           Artist • Duration    [↑][↓]   │

│           👎 2  👍 8  👍👍 3            │

│           Added by @username            │

└─────────────────────────────────────────┘

- Height: 90px (increased for username)

- Chrome bottom border

- Playing item: Neon-cyan left border (4px)

- Album art: 50x50px, chrome frame

- Position number: Large, neon-amber

- Reorder buttons: Chrome circular, 32px

- Added by: Accent font, --text-xs, text-dim

Empty State:

```

```tsx

// When queue is empty

- Large neon sign style text: "QUEUE EMPTY"

- Subtitle: "Search and add songs to get started"

- Pulsing neon glow effect

```

### 5.7 History Panel Component

**Layout**

Same area as queue (tab switch)

Shows last 40 songs

Reverse chronological order

**History Item**

```tsx

// components/HistoryPanel/HistoryItem.tsx

- Similar to queue item but:

  - No reorder buttons

  - Shows timestamp (e.g., "Played 5 min ago")

  - Shows final vote counts

  - Shows who added it

  - Slightly dimmer appearance

  - Click to view details/re-add

```

### 5.8 Modal Component (Song Details)

**Visual Design**

```tsx

// components/Modal/SongDetailModal.tsx

Layout:

┌─────────────────────────────────────┐

│  [X]                                │

│                                     │

│     ┌─────────────┐                │

│     │  Album Art  │                │

│     │   200x200   │                │

│     └─────────────┘                │

│                                     │

│   Song Title (Large)                │

│   Artist Name                       │

│   Album Name • Duration             │

│                                     │

│   Historical Votes:                 │

│   👎 15  👍 42  👍👍 8              │

│                                     │

│   [ADD TO QUEUE]  [CANCEL]          │

│                                     │

└─────────────────────────────────────┘

- Width: 500px (max)

- Chrome frame with dark background

- Backdrop: rgba(0,0,0,0.8) with blur

- Buttons: Full chrome button style

- Close X: Top-right, neon-pink on hover

- Add button disabled if queue full

```

### 5.9 Button Component System

**Primary Button (Add to Queue, etc.)**

```css

.button-primary {

  background: linear-gradient(135deg,

    var(--chrome-light),

    var(--chrome-base)

  );

  border: 2px solid var(--chrome-dark);

  border-radius: 24px;

  padding: 12px 32px;

  font-family: 'Audiowide', sans-serif;

  font-size: var(--text-base);

  color: var(--text-light);

  box-shadow:

    inset 0 1px 2px rgba(255,255,255,0.3),

    0 4px 8px rgba(0,0,0,0.3);

  transition: all 0.2s ease;

}

.button-primary:hover {

  box-shadow:

    inset 0 1px 2px rgba(255,255,255,0.3),

    0 4px 8px rgba(0,0,0,0.3),

    0 0 20px var(--neon-cyan-glow);

  transform: translateY(-2px);

}

.button-primary:active {

  transform: translateY(0);

  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);

}

.button-primary:disabled {

  opacity: 0.5;

  cursor: not-allowed;

  transform: none;

}

Secondary Button (Cancel, Close):

```

```css

.button-secondary {

  /* Similar but with darker chrome tones */

  background: var(--chrome-dark);

  border: 2px solid var(--chrome-darkest);

}

Icon Button (Reorder, etc.):

```

```css

.button-icon {

  width: 32px;

  height: 32px;

  border-radius: 50%;

  background: var(--chrome-base);

  border: 2px solid var(--chrome-dark);

  display: flex;

  align-items: center;

  justify-content: center;

}

```

### 5.10 Tab Navigation Component

**Visual Design**

```tsx

// components/Navigation/TabNav.tsx

┌─────────┬─────────┐

│  QUEUE  │ HISTORY │

└─────────┴─────────┘

- Chrome tab appearance

- Active tab: Neon-cyan bottom border (3px)

- Inactive tab: Dim text

- Smooth transition between tabs

- Font: Display font, --text-lg

```

### 5.11 Genre & Admin Display Component

**Layout**

```tsx

// components/GenreAdmin/GenreAdminBar.tsx

Located at bottom of jukebox frame:

┌─────────────────────────────────────────┐

│ 🎵 Genre: Synthwave                     │

│ 👑 Admin: @username [Transfer Rights]   │

│ 👤 Logged in as: @yourusername          │

└─────────────────────────────────────────┘

- Height: 80px (3 rows)

- Chrome top border

- Genre row:

  - Genre icon + name in neon-pink

  - [Set Genre] button (visible to all)

- Admin row:

  - Crown icon + admin username in neon-amber

  - [Transfer Rights] button (only visible to admin)

- User row:

  - User icon + current username in text-dim

  - Small, unobtrusive

Set Genre Modal:

```

```tsx

// components/GenreAdmin/SetGenreModal.tsx

Layout:

┌─────────────────────────────────────┐

│  [X]                                │

│                                     │

│     SET GENRE                       │

│                                     │

│     ┌─────────────────────────┐    │

│     │ [Genre input]           │    │

│     └─────────────────────────┘    │

│                                     │

│     Common genres:                  │

│     [Rock] [Pop] [Jazz] [Hip Hop]  │

│     [Electronic] [Classical]        │

│                                     │

│     Note: Setting genre makes you   │

│     the admin                       │

│                                     │

│     [SET GENRE]  [CANCEL]           │

│                                     │

└─────────────────────────────────────┘

- Custom input or quick select buttons

- Warning that user becomes admin

- Chrome button styling

Transfer Admin Modal:

```

```tsx

// components/GenreAdmin/TransferAdminModal.tsx

Layout:

┌─────────────────────────────────────┐

│  [X]                                │

│                                     │

│     TRANSFER ADMIN RIGHTS           │

│                                     │

│     Select new admin:               │

│                                     │

│     ┌─────────────────────────┐    │

│     │ @user1                  │    │

│     │ @user2                  │    │

│     │ @user3                  │    │

│     └─────────────────────────┘    │

│                                     │

│     Note: You will lose admin       │

│     privileges                      │

│                                     │

│     [TRANSFER]  [CANCEL]            │

│                                     │

└─────────────────────────────────────┘

- List of active users (from recent activity)

- Confirmation warning

- Only accessible to current admin

```

## 6. Session & State Management

User Session (localStorage)

```typescript

// lib/session/userSession.ts

interface UserSession {

  username: string;

  sessionId: string; // UUID generated on first visit

  createdAt: number;

  lastActive: number;

}

// Storage key: 'teamjukebox_user'

// Persists across browser sessions

// No expiration (until user clears storage)

Active Users Tracking

```

```typescript

// Track users who have interacted recently

interface ActiveUser {

  username: string;

  sessionId: string;

  lastActivity: number;

}

// Consider user "active" if activity within last 30 minutes

// Used for transfer admin dropdown

// Synced via WebSocket heartbeat

Global State (Zustand)

```

```typescript

// lib/store/jukeboxStore.ts

interface JukeboxState {

  // User

  currentUser: UserSession | null;

  setCurrentUser: (user: UserSession) => void;

  // Queue

  queue: QueueItem[];

  addToQueue: (song: Song) => void;

  reorderQueue: (fromIndex: number, toIndex: number) => void;

  // Currently Playing

  currentSong: Song | null;

  isPlaying: boolean;

  progress: number;

  // Genre & Admin

  currentGenre: string | null;

  adminUser: string | null;

  setGenre: (genre: string, username: string) => void;

  transferAdmin: (newAdmin: string) => void;

  // History

  history: HistoryItem[];

  // Votes

  votes: Map<string, VoteData>;

  castVote: (songId: string, voteType: VoteType) => void;

  // Active Users

  activeUsers: ActiveUser[];

}

```

## 7. Animation & Motion Guidelines

Subtle Motion Principles

Purpose-driven: Animations should provide feedback or guide attention

Duration: Keep most animations between 200-400ms

Easing: Use ease-out for entering, ease-in for exiting

Performance: Use transform and opacity for 60fps animations

Key Animations

**Page Load**

```css

- Jukebox frame fades in (400ms)

- Neon glow pulses once (800ms)

- Components slide in from bottom (staggered, 200ms each)

- Username modal appears (if needed) after frame loads

Username Entry:

```

```css

- Modal fades in with backdrop (300ms)

- Input field auto-focuses with subtle glow pulse

- On submit: Modal scales down and fades out (400ms)

- Jukebox content becomes interactive

Vote Button Click:

```

```css

- Button scales down (100ms)

- Neon flash (200ms)

- Trigger floating vote animation

- Update vote count with number flip animation

Song Transition:

```

```css

- Current song fades out (300ms)

- Next song fades in (300ms)

- Album art crossfade

- Queue items shift up smoothly (400ms)

Hover States:

```

```css

- Buttons: Subtle scale (1.05) and glow (200ms)

- Queue items: Neon border appears (150ms)

- Links: Underline slides in (200ms)

Genre/Admin Change:

```

```css

- Status bar updates with color transition (300ms)

- Crown icon transfers with slide animation (400ms)

- Notification toast appears briefly (2s display)

```

## 8. Next.js Technical Implementation

Project Structure

```text

team-jukebox/

├── app/

│   ├── layout.tsx

│   ├── page.tsx

│   ├── globals.css

│   └── api/

│       ├── songs/

│       │   └── route.ts

│       ├── queue/

│       │   └── route.ts

│       ├── votes/

│       │   └── route.ts

│       └── genre/

│           └── route.ts

├── components/

│   ├── JukeboxFrame/

│   │   ├── JukeboxFrame.tsx

│   │   └── JukeboxFrame.module.css

│   ├── UsernameEntry/

│   │   ├── UsernameEntry.tsx

│   │   └── UsernameEntry.module.css

│   ├── AudioPlayer/

│   │   ├── AudioPlayer.tsx

│   │   ├── AlbumArt.tsx

│   │   ├── NowPlayingInfo.tsx

│   │   ├── ProgressBar.tsx

│   │   ├── VUMeters.tsx

│   │   ├── Oscilloscope.tsx

│   │   ├── VoteButtons.tsx

│   │   └── VolumeControl.tsx

│   ├── QueuePanel/

│   │   ├── QueuePanel.tsx

│   │   ├── QueueItem.tsx

│   │   └── QueueEmpty.tsx

│   ├── SearchPanel/

│   │   ├── SearchPanel.tsx

│   │   ├── SearchInput.tsx

│   │   └── SearchResults.tsx

│   ├── HistoryPanel/

│   │   ├── HistoryPanel.tsx

│   │   └── HistoryItem.tsx

│   ├── GenreAdmin/

│   │   ├── GenreAdminBar.tsx

│   │   ├── SetGenreModal.tsx

│   │   └── TransferAdminModal.tsx

│   ├── Modal/

│   │   ├── Modal.tsx

│   │   └── SongDetailModal.tsx

│   ├── VoteAnimation/

│   │   └── FloatingVote.tsx

│   └── ui/

│       ├── Button.tsx

│       ├── Input.tsx

│       └── TabNav.tsx

├── lib/

│   ├── audio/

│   │   ├── AudioContext.tsx

│   │   ├── useAudioPlayer.ts

│   │   └── audioAnalyzer.ts

│   ├── api/

│   │   └── musicService.ts

│   ├── session/

│   │   ├── userSession.ts

│   │   └── useUserSession.ts

│   ├── store/

│   │   └── jukeboxStore.ts

│   └── hooks/

│       ├── useQueue.ts

│       ├── useVotes.ts

│       └── useRealtime.ts

├── styles/

│   ├── tokens.css

│   └── animations.css

└── public/

    └── fonts/

```

Key Technologies

Framework: Next.js 14+ (App Router)

Styling: CSS Modules + CSS Custom Properties

State Management: Zustand (lightweight, simple)

Real-time: WebSockets (Socket.io) or Supabase Realtime

Audio: Web Audio API + Howler.js

API Integration: Spotify Web API (with fallbacks)

Database: PostgreSQL (Supabase or Vercel Postgres)

Session Storage: localStorage (client-side only)

Deployment: Vercel

Session Management Flow

```typescript

// app/layout.tsx

'use client';

import { useEffect } from 'react';

import { useJukeboxStore } from '@/lib/store/jukeboxStore';

import { getUserSession, createUserSession } from '@/lib/session/userSession';

import UsernameEntry from '@/components/UsernameEntry/UsernameEntry';

export default function RootLayout({ children }) {

  const { currentUser, setCurrentUser } = useJukeboxStore();

  const [showUsernameEntry, setShowUsernameEntry] = useState(false);

  useEffect(() => {

    // Check for existing session

    const session = getUserSession();

    if (session) {

      setCurrentUser(session);

    } else {

      setShowUsernameEntry(true);

    }

  }, []);

  const handleUsernameSubmit = (username: string) => {

    const session = createUserSession(username);

    setCurrentUser(session);

    setShowUsernameEntry(false);

  };

  return (

    <html lang="en">

      <body>

        {showUsernameEntry && (

          <UsernameEntry onSubmit={handleUsernameSubmit} />

        )}

        <div className={showUsernameEntry ? 'blurred' : ''}>

          {children}

        </div>

      </body>

    </html>

  );

}

Design System Implementation

CSS Custom Properties (globals.css):

```

```css

:root {

  /* Colors */

  --chrome-light: #E8E8E8;

  --chrome-base: #C0C0C0;

  --chrome-dark: #8B8B8B;

  --chrome-darkest: #4A4A4A;

  --neon-pink: #FF10F0;

  --neon-cyan: #00F0FF;

  --neon-amber: #FFB000;

  --neon-pink-glow: rgba(255, 16, 240, 0.6);

  --neon-cyan-glow: rgba(0, 240, 255, 0.6);

  --neon-amber-glow: rgba(255, 176, 0, 0.6);

  --background-dark: #1A1A1A;

  --background-medium: #2D2D2D;

  --text-light: #FFFFFF;

  --text-dim: #B0B0B0;

  /* Typography */

  --font-display: 'Righteous', cursive;

  --font-secondary: 'Audiowide', cursive;

  --font-body: 'Space Mono', monospace;

  --font-accent: 'Pacifico', cursive;

  /* Spacing */

  --space-xs: 0.25rem;

  --space-sm: 0.5rem;

  --space-md: 1rem;

  --space-lg: 1.5rem;

  --space-xl: 2rem;

  --space-2xl: 3rem;

  /* Borders */

  --border-radius-sm: 4px;

  --border-radius-md: 8px;

  --border-radius-lg: 16px;

  --border-radius-xl: 24px;

  --border-radius-full: 9999px;

  /* Shadows */

  --shadow-sm: 0 2px 4px rgba(0,0,0,0.2);

  --shadow-md: 0 4px 8px rgba(0,0,0,0.3);

  --shadow-lg: 0 8px 16px rgba(0,0,0,0.4);

  --shadow-chrome:

    inset 0 2px 4px rgba(255,255,255,0.3),

    inset 0 -2px 4px rgba(0,0,0,0.3);

  /* Transitions */

  --transition-fast: 150ms ease;

  --transition-base: 200ms ease;

  --transition-slow: 400ms ease;

}

```

## 9. Accessibility Considerations

WCAG 2.1 AA Compliance

**Color Contrast**

Text on dark backgrounds: Ensure 4.5:1 ratio minimum

Neon colors for decorative purposes only

Important text uses --text-light on dark backgrounds

**Keyboard Navigation**

All interactive elements focusable

Focus indicators: Neon-cyan ring (3px)

Tab order follows logical flow

Escape key closes modals

Enter key submits username

**Screen Readers**

Semantic HTML elements

ARIA labels for icon buttons

Live regions for queue updates

Alt text for album art

Announce when user becomes admin

**Motion**

Respect prefers-reduced-motion

Disable floating animations if requested

Provide static alternatives

```css

@media (prefers-reduced-motion: reduce) {

  * {

    animation-duration: 0.01ms !important;

    transition-duration: 0.01ms !important;

  }

}

```

## 10. Responsive Design Strategy

Mobile (320px - 768px)

```text

┌─────────────────────┐

│  CHROME FRAME       │

│  TEAM JUKEBOX       │

├─────────────────────┤

│  NOW PLAYING        │

│  (Compact)          │

├─────────────────────┤

│  [QUEUE] [HISTORY]  │

├─────────────────────┤

│  Queue List         │

│  (Full width)       │

├─────────────────────┤

│  Genre & Admin      │

│  @yourusername      │

├─────────────────────┤

│  [🔍 Search FAB]    │

└─────────────────────┘

```

- Stack vertically

- Search as floating action button

- Simplified VU meters (smaller)

- Collapsible player details

- Username in compact status bar

Tablet (769px - 1024px)

```text

┌───────────────────────────┐

│  CHROME FRAME             │

│  TEAM JUKEBOX             │

├───────────────────────────┤

│  NOW PLAYING (Full)       │

├─────────────┬─────────────┤

│   SEARCH    │    QUEUE    │

│  (Narrow)   │   (Wide)    │

├─────────────┴─────────────┤

│  Genre & Admin & User     │

└───────────────────────────┘

```

- Hybrid layout

- Narrower search panel

- Full player features

Desktop (1025px+)

Full jukebox layout as specified in Section 4

## 11. Performance Optimization

Image Optimization

Next.js Image component for album art

WebP format with fallbacks

Lazy loading for queue items

Blur placeholder for loading states

Audio Performance

Preload next song in queue

Audio sprite for UI sounds (optional)

Web Audio API for VU meters/oscilloscope

Efficient canvas rendering (requestAnimationFrame)

Bundle Size

Code splitting by route

Dynamic imports for modals

Tree-shaking unused components

Font subsetting (only needed characters)

Real-time Optimization

Debounce search input (300ms)

Throttle vote animations

Batch queue updates

WebSocket connection pooling

Heartbeat for active users (every 30s)

localStorage Optimization

Minimal data storage (username + sessionId only)

No sensitive data

Automatic cleanup on logout (future feature)

## 12. Component Development Priority (MVP)

Phase 1: Core Infrastructure ✅

Next.js project setup

Design system (CSS tokens)

JukeboxFrame component

Basic layout structure

Phase 2: User Session

UsernameEntry component

Session management (localStorage)

User state in Zustand store

Active user tracking

Phase 3: Audio Playback

AudioPlayer component

Progress bar

Volume control

Basic play/pause functionality

Phase 4: Queue Management

QueuePanel component

QueueItem component (with "Added by")

Add to queue functionality

Reorder controls

Phase 5: Search

SearchPanel component

API integration

Search results display

Song detail modal

Phase 6: Voting & Engagement

Vote buttons

Floating vote animations (with username)

Vote count display

Persistent vote storage

Phase 7: Genre & Admin

GenreAdminBar component

Set Genre modal

Transfer Admin modal

Admin privilege logic

Phase 8: Advanced Features

VU meters

Oscilloscope

History panel

Active users list

Phase 9: Polish

Responsive design

Accessibility audit

Performance optimization

Error states & loading

## 13. Design Assets Needed

Icons

Vote icons: 👎 👍 👍👍 (emoji or custom SVG)

Playback: ⏯️ ⏸️ ⏭️ ⏮️

Volume: 🔇 🔉 🔊

Search: 🔍

Close: ✕

Reorder: ↑ ↓

Admin: 👑

Genre: 🎵

User: 👤

Fonts (Google Fonts)

```html

<link rel="preconnect" href="https://fonts.googleapis.com">

<link href="https://fonts.googleapis.com/css2?family=Righteous&family=Audiowide&family=Space+Mono:wght@400;700&family=Pacifico&display=swap" rel="stylesheet">

Graphics

Chrome texture/gradient (CSS)

Neon glow effects (CSS box-shadow)

Glass overlay (CSS backdrop-filter)

Grid pattern for oscilloscope (SVG)

```

## 14. Future Enhancements (Post-MVP)

User Features

Change username option

User profiles with stats

Logout functionality

User avatars

Room Features

Private rooms with codes

Multiple public rooms

Room creation

Room settings

Visual Enhancements

Animated chrome reflections

Particle effects on vote

Vinyl record spinning animation

Tube amp glow effects

Steam punk gear animations (subtle)

Interactive Features

Drag-and-drop queue reordering

Gesture controls (mobile)

Keyboard shortcuts

Custom themes/skins

Audio Features

Equalizer controls

Crossfade between songs

Audio effects (reverb, echo)

Visualizer customization

Social Features

User authentication (optional)

Friend lists

Direct messages

Collaborative playlists

## 15. Questions Resolved

✅ User Authentication: Simple username entry, no social login, no 2FA
✅ Room Management: Single public room for MVP
✅ Session Persistence: localStorage for username
✅ Admin Transfer UI: In genre/admin bar at bottom
✅ Search Results Limit: Top 20 results
✅ Mobile Experience: Mobile-responsive, desktop-optimized

Document Version: 1.1
Last Updated: February 12, 2026
Status: Ready for Development
Next Steps: Begin Phase 1 implementation

# Team Jukebox - Development Task List
Version 1.0

## High-Level Overview
### Phase 1: Project Setup & Foundation (Week 1)
Initialize Next.js project with design system
Set up development environment and tooling
Create base layout and chrome frame
### Phase 2: User Session Management (Week 1-2)
Implement username entry and session storage
Build user state management
Create active user tracking
### Phase 3: Core Audio Playback (Week 2-3)
Build audio player component
Implement playback controls
Add volume management
### Phase 4: Queue System (Week 3-4)
Create queue display and management
Implement reordering functionality
Add queue state synchronization
### Phase 5: Search & Discovery (Week 4-5)
Build search interface
Integrate music API
Create song detail modals
### Phase 6: Voting System (Week 5-6)
Implement vote buttons and logic
Create floating vote animations
Add persistent vote storage
### Phase 7: Genre & Admin Features (Week 6-7)
Build genre management
Implement admin privileges
Create transfer functionality
### Phase 8: Audio Visualization (Week 7-8)
Add VU meters
Implement oscilloscope
Optimize audio analysis
### Phase 9: History & Polish (Week 8-9)
Create history panel
Add responsive design
Implement error handling
### Phase 10: Testing & Deployment (Week 9-10)
Accessibility audit
Performance optimization
Production deployment

## Detailed Task Breakdown

## 1. Project Setup & Foundation
### 1.1 Initialize Next.js Project
#### 1.1.1 Create new Next.js 14+ project with App Router
Run npx create-next-app@latest team-jukebox
Select TypeScript, ESLint, Tailwind CSS, App Router
Configure src/ directory structure
#### 1.1.2 Set up Git repository
**Initialize git:** git init
Create .gitignore file
Create initial commit
Set up GitHub repository
#### 1.1.3 Configure project structure
Create /components directory
Create /lib directory
Create /styles directory
Create /public/fonts directory
Set up folder structure per design doc
### 1.2 Install Dependencies
#### 1.2.1 Install core dependencies
```bash
npm install zustand
npm install howler
npm install socket.io-client
npm install uuid
```
#### 1.2.2 Install development dependencies
```bash
npm install -D @types/howler
npm install -D @types/uuid
```
#### 1.2.3 Configure TypeScript
Update tsconfig.json with path aliases
Add strict type checking options
Configure module resolution
### 1.3 Set Up Design System
#### 1.3.1 Create CSS custom properties file
Create app/globals.css
Add color tokens (chrome, neon, backgrounds)
Add typography tokens (font families, sizes)
Add spacing tokens
Add border radius tokens
Add shadow tokens
Add transition tokens
#### 1.3.2 Import Google Fonts
Add font links to app/layout.tsx
**Configure font-display:** swap
**Add fonts:** Righteous, Audiowide, Space Mono, Pacifico
#### 1.3.3 Create animation utilities
Create styles/animations.css
Add keyframe animations (flicker, float, pulse)
Add transition utilities
Add reduced-motion media query
### 1.4 Create Base Layout
#### 1.4.1 Build root layout component
Create app/layout.tsx
Add HTML structure
Add font imports
Add metadata configuration
#### 1.4.2 Create main page component
Create app/page.tsx
Add basic structure
Import JukeboxFrame (to be built)
### 1.5 Build Jukebox Frame Component
#### 1.5.1 Create JukeboxFrame component structure
Create components/JukeboxFrame/JukeboxFrame.tsx
Create components/JukeboxFrame/JukeboxFrame.module.css
Define component interface
#### 1.5.2 Implement chrome frame styling
Add chrome gradient background
Add rounded top corners (40px)
Add inner shadow for depth
Add neon underglow effect
Add border (20px desktop, 12px mobile)
#### 1.5.3 Add jukebox title
Add "TEAM JUKEBOX" heading
Style with display font (Righteous)
Add neon-pink color and glow
Add letter-spacing
Center align
#### 1.5.4 Test frame responsiveness
Test on mobile (320px)
Test on tablet (768px)
Test on desktop (1024px+)
Adjust padding and borders
### 1.6 Set Up Development Tools
#### 1.6.1 Configure ESLint
Update .eslintrc.json
Add custom rules
Add accessibility plugin
#### 1.6.2 Set up Prettier
Create .prettierrc
Configure formatting rules
Add format scripts to package.json
#### 1.6.3 Configure VS Code settings
Create .vscode/settings.json
Add format on save
Add recommended extensions

## 2. User Session Management
### 2.1 Create Session Utilities
#### 2.1.1 Build user session module
Create lib/session/userSession.ts
Define UserSession interface
Implement getUserSession() function
Implement createUserSession() function
Implement updateLastActive() function
Implement clearUserSession() function
#### 2.1.2 Add UUID generation
Import uuid library
Generate unique session IDs
Store in localStorage with username
#### 2.1.3 Add session validation
Validate username format (3-20 chars)
Check for alphanumeric + underscore/hyphen
Sanitize input
Handle edge cases
### 2.2 Build Username Entry Component
#### 2.2.1 Create component structure
Create components/UsernameEntry/UsernameEntry.tsx
Create components/UsernameEntry/UsernameEntry.module.css
Define component props interface
#### 2.2.2 Build modal layout
Create modal container (400px max width)
Add chrome frame styling
Add dark backdrop (rgba(0,0,0,0.9))
Center modal in viewport
Make non-dismissible
#### 2.2.3 Add form elements
Add "WELCOME TO TEAM JUKEBOX" heading
Add instruction text
Add username input field
Add "JOIN THE JUKEBOX" button
Style with chrome/neon theme
#### 2.2.4 Implement form logic
Add form state management
Add input validation (real-time)
Add error message display
Handle form submission
Auto-focus input on mount
Handle Enter key submission
#### 2.2.5 Add animations
Fade in modal on mount
Pulse input glow on focus
Scale down and fade out on submit
Smooth transition (300-400ms)
### 2.3 Set Up State Management
#### 2.3.1 Create Zustand store
Create lib/store/jukeboxStore.ts
Define store interface
Initialize store with createStore
#### 2.3.2 Add user state slice
Add currentUser state
Add setCurrentUser action
Add clearCurrentUser action
Add updateUserActivity action
#### 2.3.3 Add active users slice
Add activeUsers state
Add addActiveUser action
Add removeActiveUser action
Add updateActiveUsers action
#### 2.3.4 Create custom hooks
Create lib/hooks/useUserSession.ts
Implement useUserSession() hook
Implement useActiveUsers() hook
### 2.4 Integrate Session into Layout
#### 2.4.1 Update root layout
Import UsernameEntry component
Add session check on mount
Show/hide username modal based on session
Add blur effect to content when modal shown
#### 2.4.2 Handle session lifecycle
Check localStorage on app load
Auto-login if valid session exists
Show username entry if no session
Update last active timestamp
#### 2.4.3 Add session persistence
Save to localStorage on username submit
Load from localStorage on mount
Handle localStorage errors gracefully
### 2.5 Build User Display Component
#### 2.5.1 Create user status component
Create components/UserStatus/UserStatus.tsx
**Display "Logged in as:** @username"
Style with accent font and dim color
Position in bottom status bar
#### 2.5.2 Add user indicator
Add user icon (👤)
Format username with @ prefix
Make text small and unobtrusive

## 3. Core Audio Playback
### 3.1 Set Up Audio Context
#### 3.1.1 Create audio context module
Create lib/audio/AudioContext.tsx
Initialize Web Audio API context
Create React Context for audio
Handle browser autoplay policies
#### 3.1.2 Integrate Howler.js
Create Howler instance manager
Configure audio sprite support
Add error handling
Add loading states
#### 3.1.3 Create audio player hook
Create lib/audio/useAudioPlayer.ts
Implement play/pause functionality
Implement seek functionality
Implement volume control
Add progress tracking
Add event listeners
### 3.2 Build Audio Player Component
#### 3.2.1 Create component structure
Create components/AudioPlayer/AudioPlayer.tsx
Create components/AudioPlayer/AudioPlayer.module.css
Define component layout (250px height)
Add dark background with chrome accents
#### 3.2.2 Position player at top
Fix to top of content area
Full width within chrome frame
Add chrome border at bottom
Ensure z-index for proper layering
### 3.3 Build Album Art Display
#### 3.3.1 Create AlbumArt component
Create components/AudioPlayer/AlbumArt.tsx
Set size to 180x180px
Add chrome frame (8px border)
Add rounded corners (4px)
Add inner shadow
#### 3.3.2 Add spinning animation
Create CSS keyframe for rotation
Set duration to 60s
Apply only when playing
Use transform for performance
#### 3.3.3 Integrate Next.js Image
Use Next.js Image component
Add blur placeholder
Optimize for WebP
Handle loading states
Add fallback for missing art
### 3.4 Build Now Playing Info
#### 3.4.1 Create NowPlayingInfo component
Create components/AudioPlayer/NowPlayingInfo.tsx
Layout song metadata vertically
#### 3.4.2 Style text elements
**Song title:** --text-2xl, neon-cyan
**Artist:** --text-lg, text-dim
**Album:** --text-sm, text-dim
**Added by:** --text-sm, accent font, text-dim
#### 3.4.3 Add text overflow handling
Implement text truncation
Add ellipsis for long titles
Consider marquee for very long text (optional)
### 3.5 Build Progress Bar
#### 3.5.1 Create ProgressBar component
Create components/AudioPlayer/ProgressBar.tsx
Create chrome track (8px height)
Add neon-pink fill
Add rounded ends
#### 3.5.2 Implement progress tracking
Connect to audio player hook
Update fill width based on progress
Add smooth transitions
Handle seek on click (optional for MVP)
#### 3.5.3 Add time displays
Show current time (left)
Show total duration (right)
**Format as MM:** SS
Use monospace font (--text-sm)
#### 3.5.4 Add glow effect
Add neon-pink glow to fill
Animate glow intensity subtly
Use box-shadow for effect
### 3.6 Build Volume Control
#### 3.6.1 Create VolumeControl component
Create components/AudioPlayer/VolumeControl.tsx
Create horizontal slider (150px width)
Add chrome track
Add neon-cyan fill
#### 3.6.2 Implement volume slider
Add circular chrome knob
Handle drag interactions
Update volume in real-time
Store volume in localStorage
#### 3.6.3 Add volume icons
Show 🔇 at 0%
Show 🔉 at 1-50%
Show 🔊 at 51-100%
Update icon based on level
#### 3.6.4 Add mute toggle
Click icon to mute/unmute
Remember previous volume level
Visual feedback on mute state
### 3.7 Add Playback Controls
#### 3.7.1 Create basic controls
Add play/pause button
Add skip to next button
Style as chrome buttons
Add neon glow on hover
#### 3.7.2 Implement control logic
Connect to audio player hook
Handle play/pause toggle
Handle skip to next song
Disable when queue empty
Update button states
### 3.8 Handle Audio Events
#### 3.8.1 Add event listeners
Listen for song end event
Listen for error events
Listen for loading events
#### 3.8.2 Implement auto-advance
Move to next song on end
Update queue state
Add to history
Handle empty queue
#### 3.8.3 Add error handling
Show error messages
Attempt to skip problematic songs
Log errors for debugging
Provide user feedback

## 4. Queue System
### 4.1 Set Up Queue State
#### 4.1.1 Add queue slice to store
Add queue state array
Add addToQueue action
Add removeFromQueue action (internal)
Add reorderQueue action
Add clearQueue action
#### 4.1.2 Define queue item interface
```typescript
interface QueueItem {
id: string;
song: Song;
addedBy: string;
addedAt: number;
position: number;
}
```
#### 4.1.3 Implement queue capacity logic
Check queue length (max 25)
Prevent adding when full
Return error message if full
### 4.2 Build Queue Panel Component
#### 4.2.1 Create component structure
Create components/QueuePanel/QueuePanel.tsx
Create components/QueuePanel/QueuePanel.module.css
Set up scrollable container
#### 4.2.2 Add queue header
Display "QUEUE (X/25)"
Style with secondary display font
Show neon-cyan color
Update count dynamically
#### 4.2.3 Create scrollable list
Set max-height for scrolling
Add custom scrollbar styling
Smooth scroll behavior
Add chrome dividers between items
### 4.3 Build Queue Item Component
#### 4.3.1 Create component structure
Create components/QueuePanel/QueueItem.tsx
Create components/QueuePanel/QueueItem.module.css
Define component props interface
#### 4.3.2 Layout queue item
Set height to 90px
Add chrome bottom border
Create grid layout for content
**Position:** [#] [Album] [Info] [Controls]
#### 4.3.3 Add album art thumbnail
**Size:** 50x50px
Add chrome frame
Use Next.js Image
Add loading placeholder
#### 4.3.4 Display song information
Song title (--text-lg)
Artist name (--text-sm, dim)
Duration (--text-xs)
**Format duration as MM:** SS
#### 4.3.5 Add position number
Large font size (--text-2xl)
Neon-amber color
Position in top-left
Bold weight
#### 4.3.6 Display "Added by" info
Show "@username"
Use accent font (Pacifico)
**Size:** --text-xs
**Color:** text-dim
Position below artist
#### 4.3.7 Add vote count display
Show 👎, 👍, 👍👍 with counts
Inline layout
Small font size
Update in real-time
#### 4.3.8 Style currently playing item
Add neon-cyan left border (4px)
Slightly brighter background
Pulsing glow effect (subtle)
Highlight position number
### 4.4 Build Reorder Controls
#### 4.4.1 Create reorder buttons
Create up arrow button (↑)
Create down arrow button (↓)
Style as chrome circular buttons (32px)
Position on right side of item
#### 4.4.2 Implement reorder logic
Handle up button click
Handle down button click
Swap positions in queue array
Update position numbers
Animate transition smoothly
#### 4.4.3 Add button state logic
Disable up for first item
Disable down for last item
Disable both for currently playing
Visual feedback for disabled state
#### 4.4.4 Add permission checks
Allow all users to reorder (for MVP)
Add visual feedback on click
Prevent rapid clicking (debounce)
### 4.5 Build Empty Queue State
#### 4.5.1 Create QueueEmpty component
Create components/QueuePanel/QueueEmpty.tsx
Center content vertically
#### 4.5.2 Style empty state
**Large text:** "QUEUE EMPTY"
Display font with neon-pink
**Subtitle:** "Search and add songs to get started"
Add pulsing glow animation
#### 4.5.3 Add call-to-action
Highlight search panel
**Optional:** Add example searches
Make visually appealing
### 4.6 Implement Add to Queue
#### 4.6.1 Create add to queue function
Validate queue capacity
Create queue item object
Add current user as "addedBy"
Add timestamp
Assign position number
#### 4.6.2 Update queue state
Append to queue array
Trigger re-render
Show success feedback
Update queue count
#### 4.6.3 Handle errors
Queue full error
Invalid song error
Network error
Display error messages
### 4.7 Add Queue Persistence (Optional for MVP)
#### 4.7.1 Save queue to backend
Send queue updates to server
Handle WebSocket events
Sync across clients
#### 4.7.2 Load queue on mount
Fetch current queue from server
Populate local state
Handle loading state

## 5. Search & Discovery
### 5.1 Set Up Music API Integration
#### 5.1.1 Create music service module
Create lib/api/musicService.ts
Define API interfaces
Set up API client
#### 5.1.2 Configure Spotify API
Register app on Spotify Developer Dashboard
Get Client ID and Secret
Store in environment variables
Implement OAuth flow (client credentials)
#### 5.1.3 Create API methods
**searchSongs(query:** string)
**getSongDetails(id:** string)
**getAutocomplete(query:** string)
Handle rate limiting
Add error handling
Add retry logic
#### 5.1.4 Create API route handlers
Create app/api/songs/search/route.ts
Create app/api/songs/[id]/route.ts
Proxy requests to Spotify
Add caching (optional)
Return normalized data
### 5.2 Build Search Panel Component
#### 5.2.1 Create component structure
Create components/SearchPanel/SearchPanel.tsx
Create components/SearchPanel/SearchPanel.module.css
Set width to 300px (desktop)
Add chrome frame styling
#### 5.2.2 Make responsive
Collapsible on mobile
Floating action button trigger
Slide-in animation
Full-width on mobile when open
### 5.3 Build Search Input Component
#### 5.3.1 Create component structure
Create components/SearchPanel/SearchInput.tsx
Add chrome-styled input field
**Height:** 48px
**Padding:** 12px 16px
#### 5.3.2 Style input field
Chrome border and background
Neon-cyan focus glow
Monospace font (Space Mono)
**Placeholder:** "Search songs or artists..."
#### 5.3.3 Add search icon
Position 🔍 icon on left
Add clear button (X) on right
Show clear only when input has value
#### 5.3.4 Implement input logic
Handle onChange event
Debounce input (300ms)
Trigger search on debounced value
Handle Enter key
Disable if no username
### 5.4 Implement Autocomplete
#### 5.4.1 Create autocomplete dropdown
Position below input
Match input width
Chrome frame styling
Max 5 suggestions
#### 5.4.2 Fetch autocomplete suggestions
Call API after 2+ characters
Show loading indicator
Display suggestions
Highlight matching text
#### 5.4.3 Handle suggestion selection
Click to select
Keyboard navigation (up/down arrows)
Enter to select
Populate input and trigger search
#### 5.4.4 Style suggestions
Hover state with neon-pink
Selected state (keyboard)
Smooth transitions
### 5.5 Build Search Results Component
#### 5.5.1 Create component structure
Create components/SearchPanel/SearchResults.tsx
Create scrollable container
**Max-height:** 400px
Custom scrollbar styling
#### 5.5.2 Display results list
Show top 20 results
Each result as clickable item
Chrome dividers between items
#### 5.5.3 Create result item layout
Mini album art (40x40px)
Song title (--text-base)
Artist name (--text-sm, dim)
Duration (--text-xs)
Horizontal layout
#### 5.5.4 Add hover effects
Neon-pink left border (3px)
Slight background change
Smooth transition (150ms)
#### 5.5.5 Handle click event
Open song detail modal
Pass song data to modal
Prevent default link behavior
### 5.6 Add Loading & Error States
#### 5.6.1 Create loading component
Show spinner/skeleton
Chrome-styled loader
Display while searching
Smooth fade in/out
#### 5.6.2 Create error state
Display error message
Retry button
Helpful error text
Style with chrome theme
#### 5.6.3 Create empty state
"No results found" message
Search suggestions
Encourage different search
### 5.7 Build Song Detail Modal
#### 5.7.1 Create Modal wrapper component
Create components/Modal/Modal.tsx
Add backdrop (rgba(0,0,0,0.8))
Add blur effect
Center modal in viewport
#### 5.7.2 Create SongDetailModal component
Create components/Modal/SongDetailModal.tsx
**Width:** 500px max
Chrome frame styling
Dark background
#### 5.7.3 Layout modal content
Album art (200x200px) at top
Song title (large, --text-2xl)
Artist name (--text-lg)
Album name (--text-base)
Duration (--text-sm)
#### 5.7.4 Display historical votes
**Section header:** "Historical Votes"
Show 👎, 👍, 👍👍 with counts
Style with neon colors
Show "No votes yet" if none
#### 5.7.5 Add action buttons
"ADD TO QUEUE" button (primary)
"CANCEL" button (secondary)
Close X button (top-right)
Style with chrome buttons
#### 5.7.6 Implement modal logic
Handle add to queue click
Validate queue capacity
Show success/error feedback
Close modal on success
Handle cancel/close
Handle ESC key
Handle backdrop click
#### 5.7.7 Add animations
Fade in backdrop (300ms)
Scale in modal (300ms)
Fade out on close (200ms)
Smooth transitions

## 6. Voting System
### 6.1 Set Up Vote State
#### 6.1.1 Add votes slice to store
Add votes state (Map<songId, VoteData>)
Add castVote action
Add getVotes selector
Add getUserVote selector
#### 6.1.2 Define vote interfaces
```typescript
interface VoteData {
songId: string;
thumbsDown: number;
thumbsUp: number;
doubleThumbsUp: number;
userVotes: Map<userId, VoteType>;
}
```

type VoteType = 'thumbsDown' | 'thumbsUp' | 'doubleThumbsUp';
#### 6.1.3 Create vote persistence module
Create lib/api/voteService.ts
Implement saveVote() function
Implement getVoteHistory() function
Store in database
### 6.2 Build Vote Buttons Component
#### 6.2.1 Create component structure
Create components/AudioPlayer/VoteButtons.tsx
Create three button elements
Layout horizontally with spacing
#### 6.2.2 Style vote buttons
Circular chrome buttons (60px diameter)
**Icons:** 👎 👍 👍👍
**Inactive:** Chrome with dim text
**Active:** Neon-pink glow
**Hover:** Subtle neon pulse
#### 6.2.3 Add button states
Disabled if no song playing
Disabled if user hasn't voted
Selected state for user's vote
Visual feedback for each state
#### 6.2.4 Display vote counts
Show count below each button
Small font (--text-xs)
Update in real-time
Animate count changes
### 6.3 Implement Vote Logic
#### 6.3.1 Handle vote button click
Get current user
Get current song
Determine vote type
Check if user already voted
#### 6.3.2 Update vote state
**If new vote:** Add to counts
**If changing vote:** Subtract old, add new
Update userVotes map
Trigger re-render
#### 6.3.3 Save vote to backend
Call vote API endpoint
Send songId, userId, voteType
Handle errors
Update persistent storage
#### 6.3.4 Trigger vote animation
Create floating vote instance
Pass vote type and position
Add to animation queue
Remove after animation completes
### 6.4 Build Floating Vote Animation
#### 6.4.1 Create FloatingVote component
Create components/VoteAnimation/FloatingVote.tsx
**Accept props:** type, startX, username
Render vote icon (👎/👍/👍👍)
#### 6.4.2 Style floating vote
**Font size:** 3rem
Neon glow effect (drop-shadow)
Optional username label below
Accent font for username
#### 6.4.3 Implement float animation
**Start position:** bottom (y: 100%)
**End position:** top (y: -10%)
**Duration:** 2.5s
**Easing:** ease-out
#### 6.4.4 Add additional effects
**Opacity:** 0 → 1 → 0
**Scale:** 0.8 → 1.2 → 1
**Rotation:** Random -15° to 15°
Slight horizontal drift
#### 6.4.5 Add flicker effect
Subtle opacity flicker (neon sign)
0.1s intervals
Alternate between 0.8 and 1.0
Infinite during animation
#### 6.4.6 Handle animation lifecycle
Mount component on vote
Start animation immediately
Remove from DOM after completion
Clean up event listeners
### 6.5 Create Vote Animation Manager
#### 6.5.1 Build animation queue system
Track active animations
Limit concurrent animations (max 10)
Queue excess animations
Process queue as animations complete
#### 6.5.2 Randomize start positions
Generate random X position
Avoid clustering (spread out)
Ensure visible within viewport
#### 6.5.3 Handle multiple simultaneous votes
Stagger start times slightly (50ms)
Vary animation speeds slightly
Prevent overlap when possible
### 6.6 Integrate Votes with Queue
#### 6.6.1 Display votes in queue items
Show vote counts for each song
Update in real-time
Style with neon colors
Compact layout
#### 6.6.2 Display votes in history
Show final vote counts
Indicate if user voted
Style consistently with queue
#### 6.6.3 Load historical votes
Fetch from database on song load
Display in song detail modal
Show cumulative votes across all plays
### 6.7 Add Vote Persistence
#### 6.7.1 Create database schema
**Table:** song_votes
**Columns:** song_id, user_id, vote_type, timestamp
Indexes for performance
#### 6.7.2 Create API endpoints
POST /api/votes - Cast vote
**GET /api/votes/:** songId - Get song votes
Handle concurrent requests
Add validation
#### 6.7.3 Implement vote aggregation
Count votes by type
Calculate totals
Cache results (optional)
Return to client

## 7. Genre & Admin Features
### 7.1 Set Up Genre & Admin State
#### 7.1.1 Add genre/admin slice to store
Add currentGenre state
Add adminUser state
Add setGenre action
Add transferAdmin action
#### 7.1.2 Define interfaces
```typescript
interface Genre {
name: string;
setBy: string;
setAt: number;
}
```
#### 7.1.3 Implement admin logic
Check if user is admin
Grant admin on genre set
Revoke admin on transfer
Persist admin state
### 7.2 Build Genre Admin Bar Component
#### 7.2.1 Create component structure
Create components/GenreAdmin/GenreAdminBar.tsx
Create components/GenreAdmin/GenreAdminBar.module.css
Position at bottom of jukebox
**Height:** 80px (3 rows)
#### 7.2.2 Add chrome top border
2px solid chrome-dark
Subtle shadow above
Separate from main content
#### 7.2.3 Layout three rows
**Row 1:** Genre display and set button
**Row 2:** Admin display and transfer button
**Row 3:** Current user display
Vertical spacing between rows
### 7.3 Build Genre Display Row
#### 7.3.1 Display current genre
**Icon:** 🎵
**Text:** "Genre: [name]"
**Style:** Neon-pink color
**Font:** Secondary display font
#### 7.3.2 Add "Set Genre" button
Chrome button styling
Visible to all users
Opens SetGenreModal on click
Positioned on right side
#### 7.3.3 Handle no genre state
Display "No genre set"
Encourage users to set one
Dim color
### 7.4 Build Admin Display Row
#### 7.4.1 Display current admin
**Icon:** 👑
**Text:** "Admin: @username"
**Style:** Neon-amber color
**Font:** Secondary display font
#### 7.4.2 Add "Transfer Rights" button
Chrome button styling
Only visible to current admin
Opens TransferAdminModal on click
Positioned on right side
#### 7.4.3 Handle no admin state
Display "No admin"
Explain admin is set with genre
### 7.5 Build Set Genre Modal
#### 7.5.1 Create component structure
Create components/GenreAdmin/SetGenreModal.tsx
**Width:** 400px max
Chrome frame styling
#### 7.5.2 Add genre input
Text input for custom genre
**Placeholder:** "Enter genre..."
Chrome styling
Auto-focus on open
#### 7.5.3 Add quick select buttons
**Common genres:** Rock, Pop, Jazz, Hip Hop, Electronic, Classical
Chrome button styling
Grid layout (2-3 columns)
Click to populate input
#### 7.5.4 Add warning message
**"Note:** Setting genre makes you the admin"
Small text below input
Neon-amber color
Inform user of consequences
#### 7.5.5 Add action buttons
"SET GENRE" button (primary)
"CANCEL" button (secondary)
Handle submit
Handle cancel
#### 7.5.6 Implement set genre logic
Validate genre name (not empty)
Update genre state
Set current user as admin
Revoke previous admin
Close modal
Show success feedback
Broadcast change to all users
### 7.6 Build Transfer Admin Modal
#### 7.6.1 Create component structure
Create components/GenreAdmin/TransferAdminModal.tsx
**Width:** 400px max
Chrome frame styling
#### 7.6.2 Display active users list
Fetch list of active users
Exclude current admin
Show username for each
Scrollable if many users
#### 7.6.3 Make users selectable
Radio button or click to select
Highlight selected user
Show selection state clearly
#### 7.6.4 Add warning message
**"Note:** You will lose admin privileges"
Neon-amber color
Position above buttons
#### 7.6.5 Add action buttons
"TRANSFER" button (primary)
"CANCEL" button (secondary)
Disable transfer if no selection
#### 7.6.6 Implement transfer logic
Validate selection
Update admin state
Revoke current admin privileges
Grant to selected user
Close modal
Show success feedback
Notify new admin
Broadcast change to all users
### 7.7 Add Admin Privileges
#### 7.7.1 Show admin badge
Display crown icon next to username
Neon-amber glow
Visible in queue items
Visible in status bar
#### 7.7.2 Enable admin features
Currently all users can reorder (MVP)
**Future:** Admin-only queue management
Visual indicator of admin status
#### 7.7.3 Handle admin loss
Remove badge immediately
Update UI permissions
Show notification
### 7.8 Persist Genre & Admin
#### 7.8.1 Save to backend
Create API endpoints
POST /api/genre - Set genre
POST /api/admin/transfer - Transfer admin
Store in database
#### 7.8.2 Sync across clients
Broadcast via WebSocket
Update all connected clients
Handle conflicts (last write wins)
#### 7.8.3 Load on mount
Fetch current genre/admin
Populate state
Handle loading state

## 8. Audio Visualization
### 8.1 Set Up Audio Analysis
#### 8.1.1 Create audio analyzer module
Create lib/audio/audioAnalyzer.ts
Initialize AnalyserNode from Web Audio API
Connect to audio source
Configure FFT size (2048 for smooth visualization)
#### 8.1.2 Create analysis hooks
Create lib/audio/useAudioAnalysis.ts
Implement useFrequencyData() hook
Implement useTimeDomainData() hook
Update at 60fps using requestAnimationFrame
#### 8.1.3 Optimize performance
Use Uint8Array for data
Reuse buffers (don't recreate)
Throttle updates if needed
Clean up on unmount
### 8.2 Build VU Meters Component
#### 8.2.1 Create component structure
Create components/AudioPlayer/VUMeters.tsx
Create two meter instances (L/R)
**Size:** 40px wide x 120px tall each
Position side-by-side
#### 8.2.2 Style meter frames
Chrome frame with glass face
Dark background
**Scale markings:** -20, -10, -5, 0, +3 dB
White text for markings
#### 8.2.3 Create meter bars
Vertical neon-pink bars
Fill from bottom to top
Smooth transitions
Glow effect on bars
#### 8.2.4 Implement meter logic
Get frequency data from analyzer
Calculate RMS (root mean square) for each channel
Convert to dB scale
Map to meter height (0-100%)
Update bar height
#### 8.2.5 Add peak hold
Track peak value
Display peak indicator (small line)
Decay peak slowly (500ms)
Different color for peak (neon-cyan)
#### 8.2.6 Add needle overlay (optional)
SVG needle that follows level
Smooth animation
Vintage meter aesthetic
#### 8.2.7 Optimize rendering
Use CSS transforms for bar height
Avoid layout thrashing
Use will-change for performance
Limit update rate to 60fps
### 8.3 Build Oscilloscope Component
#### 8.3.1 Create component structure
Create components/AudioPlayer/Oscilloscope.tsx
**Canvas element:** 200px x 80px
Dark background
Chrome frame
#### 8.3.2 Add background grid
Create SVG grid pattern
Subtle lines (dim color)
Retro CRT aesthetic
Position behind waveform
#### 8.3.3 Implement waveform drawing
Get time domain data from analyzer
Clear canvas each frame
Draw waveform as line
Neon-cyan color
2px line width
#### 8.3.4 Add glow effect
Draw waveform twice
**First pass:** Blurred glow
**Second pass:** Sharp line
Use canvas shadowBlur
#### 8.3.5 Add CRT scanline effect
Overlay subtle horizontal lines
Animate slowly (optional)
Low opacity (0.1)
Enhance retro feel
#### 8.3.6 Optimize canvas rendering
Use requestAnimationFrame
Clear only dirty regions (optional)
Avoid unnecessary redraws
Throttle if performance issues
### 8.4 Handle No Audio State
#### 8.4.1 Show idle state
VU meters at zero
Oscilloscope shows flat line
Dim appearance
**Optional:** Subtle animation
#### 8.4.2 Animate on audio start
Fade in visualizations
Smooth transition
Sync with playback
### 8.5 Add Visualization Controls (Optional)
#### 8.5.1 Toggle visualizations
Show/hide VU meters
Show/hide oscilloscope
Save preference
#### 8.5.2 Adjust sensitivity
Slider for meter sensitivity
Adjust gain multiplier
Persist setting

## 9. History & Polish
### 9.1 Set Up History State
#### 9.1.1 Add history slice to store
Add history state array (max 40)
Add addToHistory action
Add clearHistory action
Implement FIFO logic (remove oldest when >40)
#### 9.1.2 Define history item interface
```typescript
interface HistoryItem {
song: Song;
playedAt: number;
addedBy: string;
votes: VoteData;
}
```
#### 9.1.3 Implement history tracking
Add song to history on completion
Include final vote counts
Include timestamp
Maintain order (newest first)
### 9.2 Build History Panel Component
#### 9.2.1 Create component structure
Create components/HistoryPanel/HistoryPanel.tsx
Create components/HistoryPanel/HistoryPanel.module.css
Same area as queue (tab switch)
Scrollable container
#### 9.2.2 Add history header
Display "HISTORY"
Show count (X songs)
Style with secondary display font
#### 9.2.3 Create scrollable list
Reverse chronological order
Max 40 items
Custom scrollbar
Chrome dividers
### 9.3 Build History Item Component
#### 9.3.1 Create component structure
Create components/HistoryPanel/HistoryItem.tsx
Similar layout to queue item
**Height:** 90px
#### 9.3.2 Display song information
Album art (50x50px)
Song title
Artist name
Duration
Added by username
#### 9.3.3 Show timestamp
**Format:** "Played X min ago"
Use relative time (e.g., "5 min ago", "1 hour ago")
Update periodically
Small font (--text-xs)
#### 9.3.4 Display final vote counts
Show 👎, 👍, 👍👍 with counts
Same layout as queue
Slightly dimmer appearance
#### 9.3.5 Make clickable
Click to open song detail modal
Show option to re-add to queue
Hover effect (neon-pink border)
#### 9.3.6 Style differently from queue
Slightly dimmer overall
No reorder buttons
No "currently playing" state
Chrome dividers
### 9.4 Implement Tab Navigation
#### 9.4.1 Create TabNav component
Create components/ui/TabNav.tsx
**Two tabs:** "QUEUE" and "HISTORY"
Chrome tab styling
#### 9.4.2 Style tabs
**Active tab:** Neon-cyan bottom border (3px)
**Inactive tab:** Dim text
**Hover:** Slight glow
Display font (--text-lg)
#### 9.4.3 Implement tab switching
Click to switch tabs
Smooth content transition
Update URL (optional)
Keyboard accessible (arrow keys)
#### 9.4.4 Animate tab content
Fade out current content
Fade in new content
Slide animation (optional)
**Duration:** 300ms
### 9.5 Add Responsive Design
#### 9.5.1 Mobile layout (320px - 768px)
Stack components vertically
Full-width queue/history
Collapsible search (FAB)
Simplified player controls
Smaller VU meters
Adjust font sizes
#### 9.5.2 Tablet layout (769px - 1024px)
Hybrid layout
Narrower search panel (200px)
Full player features
Adjust spacing
#### 9.5.3 Desktop layout (1025px+)
Full jukebox layout
All features visible
Optimal spacing
#### 9.5.4 Test breakpoints
Test at each breakpoint
Ensure no overflow
Check touch targets (44px min)
Verify readability
### 9.6 Implement Error Handling
#### 9.6.1 Create error boundary
Wrap app in ErrorBoundary
Catch React errors
Display fallback UI
Log errors
#### 9.6.2 Add error states for components
API errors (search, queue, votes)
Audio errors (playback, loading)
Network errors
Display user-friendly messages
#### 9.6.3 Create error notification system
Toast notifications
Chrome-styled toasts
Auto-dismiss (5s)
Stack multiple toasts
#### 9.6.4 Add retry mechanisms
Retry failed API calls (3 attempts)
Exponential backoff
User-initiated retry button
Clear error state on success
### 9.7 Add Loading States
#### 9.7.1 Create loading components
Spinner with chrome styling
Skeleton screens for lists
Progress indicators
Shimmer effects
#### 9.7.2 Add loading states to components
Search results loading
Queue loading
Song details loading
Audio loading
#### 9.7.3 Optimize perceived performance
Show content immediately when available
Progressive loading
Optimistic updates
### 9.8 Implement Keyboard Shortcuts (Optional)
#### 9.8.1 Add global shortcuts
**Space:** Play/pause
**→:** Next song
**↑/↓:** Volume
**/:** Focus search
**Esc:** Close modals
#### 9.8.2 Add contextual shortcuts
**Tab:** Switch between queue/history
**Enter:** Select search result
**1/2/3:** Quick vote (thumbs down/up/double)
#### 9.8.3 Show keyboard shortcut help
Modal with all shortcuts
Triggered by ? key
Chrome-styled modal
### 9.9 Add Animations & Transitions
#### 9.9.1 Polish existing animations
Ensure smooth 60fps
Consistent timing
Proper easing
#### 9.9.2 Add micro-interactions
Button press feedback
Hover effects
Focus indicators
Success animations
#### 9.9.3 Add page transitions
Fade in on load
Smooth tab switches
Modal animations
#### 9.9.4 Respect reduced motion
Check prefers-reduced-motion
Disable decorative animations
Keep functional animations minimal

## 10. Testing & Deployment
### 10.1 Accessibility Audit
#### 10.1.1 Run automated tests
Use axe DevTools
Use Lighthouse accessibility audit
Fix critical issues
Document remaining issues
#### 10.1.2 Manual keyboard testing
Tab through entire interface
Test all interactive elements
Verify focus indicators
Test keyboard shortcuts
#### 10.1.3 Screen reader testing
Test with NVDA (Windows)
Test with VoiceOver (Mac)
Verify ARIA labels
Test live regions
#### 10.1.4 Color contrast testing
**Verify all text meets 4.5:** 1 ratio
Test with color blindness simulators
Ensure neon colors are decorative only
#### 10.1.5 Fix accessibility issues
Add missing ARIA labels
Improve focus management
Enhance keyboard navigation
Update documentation
### 10.2 Performance Optimization
#### 10.2.1 Run Lighthouse performance audit
Identify bottlenecks
Check Core Web Vitals
Analyze bundle size
#### 10.2.2 Optimize images
Use Next.js Image component
Implement lazy loading
Use WebP format
Add blur placeholders
#### 10.2.3 Optimize JavaScript
Code splitting
Tree shaking
Minimize bundle size
Remove unused dependencies
#### 10.2.4 Optimize CSS
Remove unused styles
Minimize CSS files
Use CSS containment
Optimize animations
#### 10.2.5 Optimize audio
Preload next song
Efficient audio analysis
Throttle visualization updates
Clean up audio resources
#### 10.2.6 Add caching
Cache API responses
Service worker (optional)
Browser caching headers
CDN for static assets
### 10.3 Cross-Browser Testing
#### 10.3.1 Test on Chrome
Latest version
Check all features
Verify performance
#### 10.3.2 Test on Firefox
Latest version
Check audio playback
Verify visualizations
#### 10.3.3 Test on Safari
Latest version
Check Web Audio API compatibility
Test on iOS Safari
#### 10.3.4 Test on Edge
Latest version
Verify all features
#### 10.3.5 Fix browser-specific issues
Add polyfills if needed
Adjust CSS for compatibility
Test fallbacks
### 10.4 Device Testing
#### 10.4.1 Test on desktop
Various screen sizes
Different resolutions
Multiple browsers
#### 10.4.2 Test on tablet
iPad (Safari)
Android tablet (Chrome)
Test touch interactions
#### 10.4.3 Test on mobile
iPhone (Safari)
Android phone (Chrome)
Test responsive layout
Verify touch targets
#### 10.4.4 Fix device-specific issues
Adjust layouts
Fix touch interactions
Optimize for small screens
### 10.5 Set Up Backend Infrastructure
#### 10.5.1 Set up database
Choose provider (Supabase/Vercel Postgres)
Create database schema
Set up migrations
Add indexes
#### 10.5.2 Set up WebSocket server
Choose provider (Socket.io/Supabase Realtime)
Configure connection
Set up event handlers
Add authentication
#### 10.5.3 Set up API routes
Implement all endpoints
Add error handling
Add rate limiting
Add logging
#### 10.5.4 Configure environment variables
Set up .env.local
Add to Vercel
Document required variables
Secure sensitive data
### 10.6 Deploy to Vercel
#### 10.6.1 Prepare for deployment
Run production build locally
Test production build
Fix any build errors
Optimize bundle
#### 10.6.2 Configure Vercel project
Connect GitHub repository
Configure build settings
Add environment variables
Set up custom domain (optional)
#### 10.6.3 Deploy to production
Push to main branch
Verify deployment
Test production site
Monitor for errors
#### 10.6.4 Set up monitoring
Add error tracking (Sentry)
Add analytics (Vercel Analytics)
Set up uptime monitoring
Configure alerts
### 10.7 Documentation
#### 10.7.1 Create README
Project description
Installation instructions
Development setup
Deployment guide
#### 10.7.2 Document API
Endpoint documentation
Request/response formats
Error codes
Rate limits
#### 10.7.3 Create user guide
How to use the jukebox
Feature explanations
Keyboard shortcuts
FAQ
#### 10.7.4 Document code
Add JSDoc comments
Explain complex logic
Document design decisions
Add inline comments
### 10.8 Final Testing
#### 10.8.1 End-to-end testing
Test complete user flows
Test edge cases
Test error scenarios
Test concurrent users
#### 10.8.2 Load testing
Simulate multiple users
Test queue performance
Test WebSocket scaling
Identify bottlenecks
#### 10.8.3 Security testing
Check for XSS vulnerabilities
Validate input sanitization
Test rate limiting
Review CORS settings
#### 10.8.4 User acceptance testing
Get feedback from test users
Fix critical issues
Prioritize improvements
Plan next iteration
### 10.9 Launch Preparation
#### 10.9.1 Create launch checklist
All features working
No critical bugs
Performance acceptable
Documentation complete
#### 10.9.2 Prepare launch announcement
Write announcement post
Create demo video
Prepare screenshots
Share with team
#### 10.9.3 Monitor launch
Watch error logs
Monitor performance
Track user feedback
Be ready to hotfix
#### 10.9.4 Post-launch tasks
Gather user feedback
Plan improvements
Fix reported bugs
Iterate on design

## Appendix: Estimated Timeline
### Phase 1: 3-5 days
### Phase 2: 3-4 days
### Phase 3: 5-7 days
### Phase 4: 5-7 days
### Phase 5: 5-7 days
### Phase 6: 4-6 days
### Phase 7: 4-5 days
### Phase 8: 5-7 days
### Phase 9: 5-7 days
### Phase 10: 5-7 days
**Total Estimated Time:** 44-62 days (approximately 9-13 weeks)

**Document Version:** 1.0
Last Updated: February 12, 2026
Status: Ready for Development
