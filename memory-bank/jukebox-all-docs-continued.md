## Design tokens (continued)

:root {
  --shadow-chrome: 0 6px 14px rgba(0,0,0,0.45);
}

---

## 9. Testing & QA

- Unit tests: Jest + React Testing Library for components.
  - AudioPlayer: mock Web Audio API, verify play/pause, progress updates.
  - VoteButtons: state changes, disabled state when no username.
  - QueuePanel: add/reorder/remove behaviors.
- Integration tests: Playwright for flows (enter username, search, add to queue, vote).
- Visual regression: Chromatic or Playwright snapshots for key components (AudioPlayer, Queue, Modal).
- Performance: Lighthouse checks, ensure 60fps for animations (use will-change, transforms).
- Accessibility: axe-core automated checks + manual keyboard navigation and screen reader passes.

Testing matrix:
- Browsers: Chromium (primary), Safari (macOS), Firefox (spot check)
- Devices: Desktop responsive (300px–1600px), mobile narrow.

CI steps:
- lint (ESLint + Prettier)
- typecheck (TypeScript)
- unit tests
- visual snapshot (optional on PRs)
- e2e smoke (Playwright)

---

## 10. Accessibility (A11y)

- Keyboard first: all interactive elements reachable via Tab/Shift+Tab.
- Focus styles: high-contrast visible outlines (avoid removing default focus).
- ARIA: use proper roles for modal (role="dialog" aria-modal="true"), alerts for toast notifications.
- Color contrast: ensure text and critical UI meet WCAG AA contrast ratios; provide non-color affordances (icons, labels).
- Motion: respect `prefers-reduced-motion`; provide a toggle in settings for reduced animation.

---

## 11. Deployment & CI/CD

- Host: Vercel (Next.js App Router). Use preview deployments for PRs.
- Secrets: store Spotify API, DB connection strings, WebSocket keys in Vercel secrets.
- Database migrations: use Prisma or Supabase migrations in CI.
- Realtime: use a managed WebSocket provider (Supabase Realtime or Pusher) or a small Node WebSocket server behind a serverless function.
- Observability: Sentry for errors, Log to cloud provider, add basic metrics (uptime, queue length, error rate).

CI workflow (GitHub Actions):
1. Install deps, run lint + typecheck
2. Run unit tests and coverage
3. Run Playwright e2e on main branch before deploy
4. Deploy to Vercel (automatic on merge to main)

---

## 12. Roadmap & Milestones

MVP (2-3 weeks):
- Core UI: Username entry, AudioPlayer (play/pause/progress), Search, Queue add/remove, basic VoteButtons
- Local session storage and Zustand store
- Basic WebSocket heartbeat for activeUsers
- Unit tests for critical components

Phase 2 (3-4 weeks):
- Real-time syncing: queue and votes across clients
- Admin flows: set genre, transfer admin
- History panel, modal with detailed song info
- Visual polish: animations, VU meters, oscilloscope

Phase 3 (TBD):
- Spotify integration & fallback providers
- Persistence: Postgres history and queue storage
- Mobile-first polish & offline support
- Advanced analytics and moderation tools

---

## 13. Implementation checklist (developer tasks)

- [ ] Scaffold Next.js app (App Router) and project layout
- [ ] Add global design tokens and fonts
- [ ] Implement `userSession` utilities and `UsernameEntry` modal
- [ ] Build `jukeboxStore` (Zustand) with types and basic actions
- [ ] Implement `AudioPlayer` core (play/pause, progress, volume)
- [ ] Implement `SearchPanel` with mock data + modal details
- [ ] Implement `QueuePanel` with add/reorder/remove + tests
- [ ] Wire simple WebSocket server for real-time sync (local dev)
- [ ] Add unit tests and CI configuration
- [ ] Accessibility pass and visual polish

---

## 14. Notes & conventions

- Keep components small and focused; prefer composition over monolith components.
- Use CSS Modules where visual scoping is required; use shared tokens in `styles/tokens.css`.
- Favor transform/opacity for animations; avoid animating layout where possible.
- Document component API with PropTypes or TypeScript interfaces and examples in the repo's `docs/` folder.

---

If you'd like, I can:
- scaffold the Next.js project structure in this workspace,
- generate starter components (`UsernameEntry`, `jukeboxStore`, `AudioPlayer`), or
- create the CI workflow and testing configs.

Which would you like next?