# Phase 1 — Development Plan

## Overview
Phase 1 builds the minimal, testable backend and completes the UI skeleton into a working feature: a shared jukebox queue where users can add and remove items. Previews will be validated using Vercel PR previews (no local preview tasks).

## Objectives
- Wire UI to a simple API surface and persistent storage (SQLite/Postgres or file-backed for the prototype).
- Add CI checks (lint, typecheck, build, tests) so PR previews are trustworthy.
- Define clear acceptance criteria and deliver a Phase 1 PR with Vercel preview.

## Scope
- Backend: small REST API under `src/app/api` (or `src/pages/api`) that supports: list queue, add item, remove item, clear queue.
- Persistence: lightweight (SQLite via Prisma) or JSON-file adapter for prototype; keep migration path clear.
- Frontend: connect `SearchPanel` and `QueuePanel` to API calls; keep `useJukeboxStore` as a client cache and sync with server state.
- Tests: unit tests for store and API handlers, and component smoke tests for main flows.

## Milestones & Acceptance Criteria

**Milestone 1 — API + persistence scaffold**
- Implement endpoints: GET `/api/queue`, POST `/api/queue`, DELETE `/api/queue/:id`, POST `/api/queue/clear`.
- Persistence saves and returns `QueueItem[]` across restarts.
- CI: `npm run build` and `npm run lint` pass.

**Acceptance Criteria (Phase 1)**
- Vercel PR preview shows the app; adding an item in `SearchPanel` triggers a server POST and the queue updates and persists between refreshes.
- Removing and clearing items update server state and UI accordingly.
- Basic automated tests (unit + API) pass in CI.

**Milestone 2 — Tests & CI**
- Add Jest + React Testing Library tests for store and components.
- Add GitHub Actions workflow that runs: install, lint, typecheck, build, and tests.
- PR preview must include workflow results for verification.

## Tasks (short)
1. Define API shape and shared TypeScript DTOs (`src/types/jukebox.ts`) — 0.5 day
2. Implement API handlers + persistence adapter (SQLite/Prisma or JSON file) — 1–2 days
3. Wire frontend to API (fetch/POST/DELETE) and make `useJukeboxStore` sync with server — 1 day
4. Add tests for store & API — 1 day
5. Add GitHub Actions workflow and verify Vercel preview — 0.5 day

## Implementation notes
- Use Vercel preview URLs as canonical PR previews; avoid adding local preview steps to the plan.
- Keep the API surface minimal and well-typed. Move `QueueItem` to `src/types/jukebox.ts` and import it in both server and client code where useful.
- For rapid prototyping prefer a JSON-file adapter; for a more realistic prototype use SQLite + Prisma (migration-friendly).

## Recommended next step
- I can scaffold the API handlers and a simple JSON-file persistence adapter now (fast), or scaffold Prisma+SQLite (more setup but robust). Which do you prefer?
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
- Status: Completed (multi-window sync verified)
- Note: Presence runs on a single Supabase Realtime channel (no multi-room yet).
- Deliverable: multi-client sync local test (two browser windows).

## Phase 4 — Admin features & Genre flows (Days 23–27)
- Tasks:
  - Implement `GenreAdminBar`, `SetGenreModal`, and `TransferAdminModal`
  - Admin-only actions behind permission checks in `jukeboxStore`
  - UI flows to set genre and confirm queue transition (completed)
- Backlog: realtime broadcast for admin/genre changes
- Deliverable: admin users can modify genre and transfer admin.

## Phase 5 — Persistence & backend integration (Days 28–33)
- Tasks:
  - Implement `/api/search` aggregator with caching layer (completed)
  - Implement Postgres schema (tables in `dataModels.md`) and migrations (completed)
  - Add endpoints for queue persistence and history writes (completed)
  - Integrate with Supabase or Prisma client (completed via Prisma)
- Deliverable: data persisted; newly joined clients get persisted queue.

## Phase 6 — Polish, accessibility & animations (Days 34–38)
- Tasks:
  - Implement design tokens across components
  - Add animations and ensure `prefers-reduced-motion` compliance
  - Accessibility audit (axe) and manual remediation (completed)
  - Visual polish: responsive tweaks, small UX improvements (completed)
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
