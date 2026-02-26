# Project Phases & Acceptance Criteria

## Phase 1 — Persistence, API, UI wiring (current)

Acceptance criteria (done):
- API routes implemented and wired to frontend (`/api/queue` handlers).
- Persistence wired with Prisma; local SQLite fallback works and migrations committed.
- Shared types reconciled (server + client) to avoid type errors.
- CI runs `prisma generate` and conditionally `prisma migrate deploy` when `DATABASE_URL` is present.
- Local `npm run build` and `npm run lint` succeed.
- Migration checklist added (`MIGRATION_CHECKLIST.md`).

Notes:
- If you provided `DATABASE_URL` in the deployment environment, the CI step will run migrations on push; otherwise migrations are skipped.

---

## Phase 2 — Playback engine, processing worker, preview persistence

Goal: enable queued items to be processed (e.g., mark played, integrate playback metadata), and ensure PR previews show persistent queue state.

Milestones / tasks:
1. Define worker architecture (serverless trigger vs. dedicated worker):
   - Default plan: implement a processing endpoint `/api/worker/process-queue` and a lightweight scheduler trigger (CI/cron or Vercel scheduled function) to invoke it.
2. Implement queue-processing logic:
   - Dequeue items in small batches, mark status (processing, done, failed) in DB.
   - Add retry/backoff metadata fields on `QueueItem` if needed.
3. Add an API endpoint to trigger processing manually (secured by a token or deploy-time secret).
4. Add UI controls to inspect item status, re-queue, or force-process.
5. Add integration tests that run migrations against a disposable Postgres and exercise queue add/process/read flows.
6. Verify PR previews: ensure Vercel deploy pulls `DATABASE_URL` (or uses a preview DB) so preview apps read/write the same hosted Postgres.

Deliverables for Phase 2:
- `src/server/worker.ts` (processing logic) and API endpoint to trigger it.
- Scheduling/trigger docs and optional GitHub Action or Vercel Cron config to periodically invoke processing endpoint.
- Integration tests and smoke tests for PR preview verification.

---

If you'd like, I'll start Phase 2 by implementing the processing endpoint and a safe scheduler-trigger (default: GitHub Actions cron job that calls the endpoint). Say "go" and I'll implement the endpoint, add the scheduled GH Action to trigger it (disabled by default), and add tests scaffolding.
