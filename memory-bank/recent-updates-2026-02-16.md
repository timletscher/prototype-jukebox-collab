# Recent repo updates — 2026-02-16

Summary of changes made by the agent on 2026-02-16:

- Added a Postgres migration SQL to create a `QueueStatus` enum and add `status`, `attempts`, and `lastAttemptAt` columns for safer worker semantics: `prisma/migrations/20260216_add_queue_status_postgres/migration.sql`.
- Scaffoled an integration test harness for queue processing (Jest + Prisma): `tests/integration/queue.spec.ts`. The test is skipped when `DATABASE_URL` is not set — intended for CI or local Docker Postgres runs.

Recommended next actions:

- Wire CI to run `prisma migrate deploy` against a hosted Postgres (only when `DATABASE_URL` is present in secrets).
- Add a Docker-based integration test job that brings up Postgres, runs migrations, then runs the Jest integration tests.

Notes:

- The repo currently uses a Postgres-targeting `prisma/schema.prisma` and a SQLite-friendly `prisma/schema.local.prisma` for local dev. Local migrations were applied earlier against SQLite; the new SQL file is intended to be applied against Postgres instances (CI/production).
