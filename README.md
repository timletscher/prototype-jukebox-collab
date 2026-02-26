# Team Jukebox — Phase 0 scaffold

This repository contains a minimal scaffold for the Team Jukebox project (Next.js App Router + TypeScript).

Run locally:

```bash
# Install (pnpm recommended)
pnpm install
pnpm dev
```

## Spotify search (server-side)

This project includes a minimal `/api/search` endpoint backed by the Spotify Web API
using the Client Credentials flow.

Set the following environment variables (server-side only):

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

Behavior:
- `/api/search?q=...` returns an array of `QueueItem`-shaped results.
- Each result includes `title`, `artist`, and `url` (Spotify `preview_url` when available).

## Presence (Supabase Realtime)

Active user presence uses Supabase Realtime when configured. Set these public
environment variables for the client:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If these variables are not set, the client falls back to the HTTP heartbeat at
`/api/presence`.
