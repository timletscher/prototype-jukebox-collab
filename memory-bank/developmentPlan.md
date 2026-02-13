# Development Plan — Jukebox

Goal: phased plan to deliver an MVP and progressive enhancements. Timeline targets ~48 days (adjustable).

Summary timeline (approx): 48 days total
- Setup & scaffolding: 2 days
- Core UI (Username, Search, Queue): 7 days
- Audio core & Player: 6 days
- Realtime & Sync: 7 days
- Admin features & Genre flows: 5 days
- Persistence & backend integration: 6 days
- Polish, accessibility & animations: 5 days
- Testing & CI: 4 days
- Deploy & monitoring: 2 days
- Buffer, docs & handoff: 4 days

## Phase 0 — Setup & scaffolding (Days 1–2)
- Tasks:
  - Initialize Next.js app with App Router and TypeScript
  - Add `eslint`, `prettier`, `husky` pre-commit hooks
  - Add base `styles/tokens.css` from `designSystem.md` and import fonts
  - Create `memory-bank/` docs in repo root (already present)
  - Create GitHub Actions CI skeleton (lint, typecheck)
- Deliverable: repo scaffold on a working branch with linters passing.

## Phase 1 — Core UI (Days 3–9)
- Tasks:
  - Implement `UsernameEntry` modal and `useUserSession()` util
  - Implement `SearchPanel` (UI-only with mock search results)
  - Implement `QueuePanel` and `QueueItem` with add/remove UI flows
  - Implement basic `jukeboxStore` skeleton (Zustand) with types
  - Write unit tests for each component
- Deliverable: interactive UI flows using mocked data.

## Phase 2 — Audio core & Player (Days 10–15)
- Tasks:
  - Implement `AudioPlayer` with Web Audio API wrapper
  - Implement `PlayerControls`, `ProgressBar`, `VolumeControl`
  - Add `Visualizer` canvas (basic FFT visualization)
  - Integrate with `jukeboxStore` playback state
- Deliverable: local playback with visualizer and controls.

## Phase 3 — Realtime & Sync (Days 16–22)
- Tasks:
  - Add WebSocket client to sync queue, votes, and presence
  - Implement optimistic UI updates for votes and queue reorder
  - Implement presence list with basic active user indicators
  - Add safeguards for reconnection and state reconciliation
- Deliverable: multi-client sync local test (two browser windows).

## Phase 4 — Admin features & Genre flows (Days 23–27)
- Tasks:
  - Implement `GenreAdminBar`, `SetGenreModal`, and `TransferAdminModal`
  - Admin-only actions behind permission checks in `jukeboxStore`
  - UI flows to set genre and confirm queue transition
- Deliverable: admin users can modify genre and transfer admin.

## Phase 5 — Persistence & backend integration (Days 28–33)
- Tasks:
  - Implement `/api/search` aggregator with caching layer
  - Implement Postgres schema (tables in `dataModels.md`) and migrations
  - Add endpoints for queue persistence and history writes
  - Integrate with Supabase or Prisma client
- Deliverable: data persisted; newly joined clients get persisted queue.

## Phase 6 — Polish, accessibility & animations (Days 34–38)
- Tasks:
  - Implement design tokens across components
  - Add animations and ensure `prefers-reduced-motion` compliance
  - Accessibility audit (axe) and manual remediation
  - Visual polish: responsive tweaks, small UX improvements
- Deliverable: accessible, polished UI ready for broader testing.

## Phase 7 — Testing & CI (Days 39–42)
- Tasks:
  - Complete unit tests coverage target (50-70% for critical code)
  - Add Playwright e2e smoke tests (enter username, add song, vote)
  - Setup visual snapshot tests for core components
  - Integrate tests into GitHub Actions
- Deliverable: automated CI running tests on PRs.

## Phase 8 — Deploy & monitoring (Days 43–44)
- Tasks:
  - Configure Vercel deployment, environment variables
  - Configure Sentry and metrics hooks
  - Run load tests for WebSocket concurrency (smoke)
- Deliverable: production deployment and basic monitoring.

## Phase 9 — Buffer, docs & handoff (Days 45–48)
- Tasks:
  - Fix any remaining bugs from QA
  - Complete developer docs and memory-bank updates
  - Handoff checklist and README with run instructions
- Deliverable: release-ready repository and docs.

---

Notes & scaling adjustments
- If realtime provider chosen (managed), shift 1–2 days from Phase 5 to work on provider config and keys.
- If deeper Spotify integration required, expect +1–2 weeks for API edge cases and privacy handling.

Runbook (dev quick start)
1. Install deps

```bash
npm install
# or
pnpm install
```

2. Dev server

```bash
npm run dev
# or
pnpm dev
```

3. Run unit tests

```bash
npm test
```

4. Run Playwright (e2e)

```bash
npx playwright test
```

(End of development plan.)
