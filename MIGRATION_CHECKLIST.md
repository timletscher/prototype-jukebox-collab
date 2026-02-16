## Migration checklist — safe steps to apply Prisma migrations to hosted Postgres

Follow this checklist before adding or applying database migrations in CI or production.

1. Confirm repository `DATABASE_URL` is set
   - Add the Postgres connection string as a secret/environment variable named `DATABASE_URL` in Vercel (or GitHub Actions secrets if using GH-hosted CI).

2. Backup production data
   - Take a logical backup (pg_dump) or snapshot before running migrations.
   - Example:

```bash
# run on a machine with access to the DB
pg_dump "$DATABASE_URL" > backup-$(date +%F-%H%M).sql
```

3. Validate migration SQL
   - Review `prisma/migrations/*/migration.sql` for destructive changes.
   - If needed, create a safe migration that adds columns nullable-first, backfill, then make non-null.

4. Test migrations locally against a copy of the target DB
   - Restore your backup into a disposable Postgres instance and run `prisma migrate deploy` against it.

5. Configure CI to run migrations only when `DATABASE_URL` is present
   - Our CI already conditionally runs `npx prisma migrate deploy` when `DATABASE_URL` is provided.
   - To run migrations during deployment, ensure the deployment environment injects `DATABASE_URL`.

6. Run migrations (CI recommended)
   - When ready, push a change/merge to trigger CI. The workflow will run:

```bash
npx prisma generate --schema=prisma/schema.prisma
npx prisma migrate deploy --schema=prisma/schema.prisma
```

7. Verify runtime behavior
   - Check app logs and run a smoke test that exercises DB reads/writes.
   - Confirm PR previews reflect persisted queue data.

8. Rollback plan
   - If a migration causes issues, restore DB from the backup and rollback any schema changes manually.
   - Document the rollback steps and inform stakeholders.

9. Post-migration
   - Remove any temporary compatibility code once migration and backfills are complete.
   - Add notes to changelog/README about the schema change.

Quick commands summary

```bash
# backup
pg_dump "$DATABASE_URL" > backup.sql

# generate client
npx prisma generate --schema=prisma/schema.prisma

# deploy migrations (CI / safe environment)
npx prisma migrate deploy --schema=prisma/schema.prisma
```

If you want, I can:
- open a PR adding this file, or
- run a dry-run of the migrate/deploy flow against a disposable DB you point me to.
