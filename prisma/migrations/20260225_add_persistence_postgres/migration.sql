-- Postgres migration: add persistence models for Phase 5

CREATE TABLE IF NOT EXISTS "Song" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT,
    "durationMs" INTEGER,
    "albumArtUrl" TEXT,
    "source" TEXT,
    "externalUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Vote" (
    "id" TEXT PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "userId" TEXT,
    "username" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "castAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Genre" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "setBy" TEXT NOT NULL,
    "setAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "isActive" BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "AdminState" (
    "id" SERIAL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "grantedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "isActive" BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "PlayHistory" (
    "id" TEXT PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "addedBy" TEXT,
    "playedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
