-- Postgres migration: create enum type and add status/attempts/lastAttemptAt columns
-- This migration is intended for hosted Postgres (CI/production).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'queuestatus') THEN
    CREATE TYPE "QueueStatus" AS ENUM ('PENDING','PROCESSING','DONE','FAILED');
  END IF;
EXCEPTION WHEN duplicate_object THEN
  -- enum already exists; ignore
  RAISE NOTICE 'QueueStatus enum already exists';
END$$;

-- Ensure the table exists and add columns if missing.
ALTER TABLE IF EXISTS "QueueItem"
  ADD COLUMN IF NOT EXISTS "status" "QueueStatus" DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "attempts" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lastAttemptAt" timestamp with time zone;

-- Optionally set NOT NULL or indexes depending on needs (left permissive here).
