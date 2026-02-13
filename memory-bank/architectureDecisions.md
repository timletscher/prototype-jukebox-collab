# Architecture Decisions — Jukebox

This document captures the key architectural choices, alternatives considered, reasons, and consequences.

1) Realtime transport: WebSockets (managed) vs polling
- Decision: Use managed WebSocket provider (Supabase Realtime / Pusher) or a lightweight Node WebSocket server.
- Alternatives: Polling / Server-Sent Events.
- Rationale: Bi-directional events (votes, queue, presence) require low-latency two-way comms; WebSockets provide this with fewer round-trips.
- Consequences: Need connection management, backoff, and auth tokens. Managed providers reduce operational burden.

2) Audio stack: Web Audio API (native) + optional Howler.js
- Decision: Use Web Audio API directly for visualizer and low-latency control; adopt Howler.js as fallback abstraction for easier mobile behavior.
- Alternatives: Pure Howler, native <audio> only.
- Rationale: Web Audio provides FFT/AnalyserNode for visualizations and more precise timing.
- Consequences: More code to manage audio nodes, but higher fidelity visualizations and timing.

3) State management: Zustand + local component state
- Decision: Global state via Zustand for room-wide state (queue, votes, playback, users). Local ephemeral state stays in components.
- Alternatives: Redux, Context-only.
- Rationale: Lightweight, simple API, good TypeScript ergonomics, minimal boilerplate.
- Consequences: Keep store API well-documented; avoid overloading store with UI-only micro-state.

4) Database: PostgreSQL (Supabase) with Prisma (optional)
- Decision: Postgres for persisted queue/history; Supabase recommended for integrated realtime & auth.
- Alternatives: MongoDB, serverless KV for ephemeral state.
- Rationale: Relational consistency for play history and votes; Supabase provides an easy hosted option.
- Consequences: Migrations required; watch for row-level locking on high-write tables (use optimistic patterns for queue writes).

5) Deployment: Vercel for frontend, serverless functions for light API; managed service for websocket if needed
- Decision: Frontend on Vercel, serverless APIs for auth and search; use managed WebSocket (or small Node server on a cheap VPS) for presence if provider not chosen.
- Alternatives: Full self-hosted server.
- Rationale: Vercel gives zero-config for Next.js App Router and preview deployments.
- Consequences: Long-lived TCP connections on serverless require managed websocket or separate server.

6) Search backend: external API aggregator + caching
- Decision: Abstract search behind `/api/search` to coalesce multiple provider APIs (Spotify, YouTube) and cache results.
- Alternatives: Client-side search requests to external APIs.
- Rationale: Centralized rate-limit handling and normalized results.
- Consequences: Need server-side credentials and caching layer (in-memory LRU + Redis for scale).

7) Auth & identity: ephemeral username + optional OAuth
- Decision: Basic ephemeral username stored locally; optional OAuth for saving playlists or linking accounts.
- Alternatives: Require auth for all features.
- Rationale: Lower barrier to entry; allow anonymous participation with identifying handles.
- Consequences: Moderation challenge; require simple report/ban flow.

8) Testing approach: unit + e2e + visual
- Decision: Jest + React Testing Library for unit; Playwright for e2e; Chromatic or Playwright snapshots for visual tests.
- Rationale: Cover behavior and catch regressions in UI.
- Consequences: CI heavier but reduces risk.

9) Observability: Sentry + basic metrics
- Decision: Send client errors to Sentry, instrument key metrics (queue length, vote rate) to a simple metrics endpoint.
- Rationale: Early detection of regressions and user-impacting failures.
- Consequences: Privacy considerations for PII — sanitize data before sending.

10) Accessibility-first design
- Decision: Design tokens and components built with keyboard-first and screen-reader semantics as first-class requirements.
- Rationale: Inclusive UX; many users will use assistive tech.
- Consequences: Slight extra dev effort up front, fewer later remediations.

---

Appendix: Decision log format
- Each entry: id, title, date, decision made, alternatives, owners, notes.
- Add new entries as design changes are proposed; reference in PRs.