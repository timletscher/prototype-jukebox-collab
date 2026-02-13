# Active Context — Runtime / Sprint Tracker

Purpose: single-file snapshot of the active dev context (keep updated during development). Use this to seed AI assistants and onboarding.

## Template fields (fill during active work)

- **activeSprint**: Sprint name or number
- **startDate**: YYYY-MM-DD
- **endDate**: YYYY-MM-DD
- **currentDay**: Day X of sprint
- **currentBranch**: branch name
- **lastCommit**: `<short-sha> — message` (date)
- **deployStatus**: staging / prod / last-deployed-at
- **openPRs**: short list of PRs (link + status)
- **openTasks**:
  - id: short description — assignee — status

- **topPriorityBugs**:
  - id: short desc — impact — owner

- **activeUsersCount**: number (from presence)
- **roomState**: one-line snapshot (current song / queue length / genre)
- **currentGenre**: e.g., `Synthwave` (source: admin)
- **adminUser**: username or null
- **lastManualDBMigration**: migration id & date
- **blockedBy**:
  - short description of blockers

- **notes**: freeform notes (design calls, decisions)

- **testingSnapshot**:
  - latest CI run: status, failing tests
  - last visual snapshot change: link

- **runbookQuickSteps**:
  1. Start dev server: `npm run dev`
  2. Recreate DB (dev): `pnpm run db:reset`
  3. Seed demo room: `pnpm run seed:demo`

- **dailyGoals**: list of today's mini-goals

---

Usage guidelines
- Keep this file small and up-to-date; update at start/end of daily work.
- Use `activeContext.md` as the authoritative source for the assistant and the on-shift developer.
- When creating `/update memory bank` PRs, refresh `activeContext.md` with relevant progress and `progress.md` as needed.

(End of template.)
