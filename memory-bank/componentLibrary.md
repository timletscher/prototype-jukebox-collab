# Component Library — Jukebox

Purpose: canonical specs for UI components, referencing design tokens in `designSystem.md` and state hooks in `dataModels.md`.

Components (index)
- JukeboxFrame
- UsernameEntry (modal)
- AudioPlayer
  - PlayerControls
  - ProgressBar
  - VolumeControl
  - Visualizer (VU meter & oscilloscope)
- FloatingVote
- SearchPanel
- QueuePanel
  - QueueItem
- HistoryPanel
  - HistoryItem
- SongDetailModal
- GenreAdminBar
- SetGenreModal
- TransferAdminModal

---

1) JukeboxFrame
- Overview: top-level container that composes header (UsernameEntry trigger), `AudioPlayer`, `QueuePanel`, `SearchPanel`, `HistoryPanel`, and `GenreAdminBar`.
- Tokens: use `--space-3`, `--bg-elev-1`, border `--border-radius-md`, shadow `--shadow-chrome`.
- Layout: responsive grid (desktop: 3-column layout; mobile: stacked). Max-width 1280px, centered.
- Interactions: keyboard focus management between primary panes; header has accessible landmark (`role="banner"`).
- ARIA: landmark regions (`role="main"`) for main content; provide `aria-live` region for queue updates.
- Implementation:
  - Compose children; subscribe to `useJukeboxStore()` for room-level metadata.
  - Lazy-load `Visualizer` to avoid initial audio thread cost.

2) UsernameEntry (modal)
- Overview: modal to enter username persistent in localStorage; blocks until username set for first visit.
- Tokens: `--bg-modal`, `--color-text`, `--space-4` padding.
- Layout: centered modal 420px width (mobile 92% width).
- Interactions: submits on Enter; validates with regex (see `dataModels.md`).
- Accessibility: `role="dialog" aria-modal="true" aria-labelledby="username-title"`; focus trap inside modal; close disabled until valid username set (unless Guest allowed).
- Implementation hints:
  - Hook: `useUserSession()` returns `[user, setUser]`.
  - Persist to `localStorage.user_profile` and to Zustand store.

3) AudioPlayer (composite)
- Overview: handles playback control via Web Audio API (Howler.js optional), visualizer, and playback state.
- Subcomponents: `PlayerControls`, `ProgressBar`, `VolumeControl`, `Visualizer`.
- Tokens: `--accent-neon`, `--glass-bg`, `--radius-pill` for controls.
- Layout: horizontal control bar, big Play/Pause center, progress below.
- State: reads `jukeboxStore.playback` for current `song`, `position`, `isPlaying`.
- Implementation:
  - Use a single audio engine instance per room in `jukeboxStore.audioEngine`.
  - Expose methods: `play(song)`, `pause()`, `seek(ms)`, `setVolume(0-1)`.
  - Worker-friendly: offload heavy FFT work when possible.

PlayerControls
- Buttons: Play/Pause (48px), Prev, Next, Repeat, Shuffle (if supported).
- Touch targets 44–48px.
- Keyboard: Space toggles play/pause; Left/Right arrow for seek +/-5s.
- ARIA: controls grouped with `role="group" aria-label="player controls"`.

ProgressBar
- Visual: uses transform-based progress (`translateX`) for perf.
- Shows buffered segments and played progress; tooltip on hover with timestamp.
- Seeking: pointer/touch drag; use `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for slider semantics.

VolumeControl
- Small slider with mute toggle; persists per-user setting.
- Respect `prefers-reduced-motion` for transitions.

Visualizer
- Two modes: VU Bar + Oscilloscope (canvas). Use requestAnimationFrame; pause animations when tab inactive.
- Reduce work for low-power devices; respect `prefers-reduced-motion`.

4) FloatingVote
- Overview: ephemeral floating vote UI that appears near a track or on the player when a user casts a vote.
- Tokens: `--accent-pulse`, `--shadow-soft`.
- Animations: pulse + translateY float; respects `prefers-reduced-motion`.
- Interaction: shows vote count increment animation; accessible via aria-live announcements.

5) SearchPanel
- Overview: typeahead search with debounce (200ms), results list, keyboard navigation, and add-to-queue actions.
- Layout: search input with result dropdown; result items include thumbnail, title, artist, duration, actions.
- Implementation:
  - Use `useSearch()` hook that hits /api/search with caching & dedupe.
  - Keyboard: Up/Down to navigate, Enter to add, `>` to open details modal.
- ARIA: `role="combobox" aria-expanded`, and ensure unique ids for options.

6) QueuePanel
- Overview: ordered list of `QueueItem`s with drag-to-reorder support for admins or owner.
- Tokens: `--bg-elev-2`, `--border-radius-sm`.
- Behaviour: reordering sends `queue:reorder` event over WebSocket; optimistic local update then server confirm.
- Performance: virtualize long queues (react-window) when > 200 items.

QueueItem
- Elements: thumbnail (48x48), title, artist, vote badge, contextual action menu (more: remove, move to top).
- Vote affordance: tap to cast vote; show animated vote increment using `FloatingVote`.
- Accessibility: item row is keyboard-focusable; action menu is accessible with aria attributes.

7) HistoryPanel & HistoryItem
- Overview: read-only list of recent played tracks with timestamp and who queued/played.
- Pagination: load more via progressive fetch; store in `play_history` table.
- HistoryItem: small layout with title, user, timestamp, optional link to SongDetailModal.

8) SongDetailModal
- Overview: shows metadata, album art, external links (Spotify/YouTube), similar songs, and admin quick actions.
- Layout: wide modal up to 880px; image left, meta & actions right.
- Actions: Add to queue, Preview clip, Share link, Report (if moderation required).

9) GenreAdminBar
- Overview: compact bar for admins to set active genre, shuffle modes, and quick admin actions.
- Tokens: `--bg-admin`, `--accent-warn` for destructive actions.
- Implementation: requires admin permission check from `jukeboxStore.adminUser`.

10) SetGenreModal
- Overview: modal to choose a genre from curated list; includes search & preview.
- Effects: changing genre emits `genre:set` event; clients transition with fade-out then fade-in of queue contents.

11) TransferAdminModal
- Overview: select active user to transfer admin rights. Shows presence list and confirmation.
- Safety: require double-confirm for transfer; log `admin_transfer` event to history.

---

Common implementation notes
- Prop types: use TypeScript for all components; export interface `Props` for each component.
- Hooks: prefer `useJukeboxStore()` and `useUserSession()` instead of prop-drilling.
- Tests: each component must include unit tests (render, interactions) and at least one integration test covering the critical path.
- Visual QA: snapshot tests for critical states (empty queue, playing, voting).

---

Where to find implementations
- Reference tokens & CSS: `memory-bank/designSystem.md`
- Data shapes & validation: `memory-bank/dataModels.md`
- Example usage patterns: check `memory-bank/productContext.md` for UX flows and acceptance criteria.

(End of component library.)
