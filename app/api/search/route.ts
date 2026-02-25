import { NextResponse } from "next/server";
import type { ApiError, SearchResponse } from "../../../src/types/jukebox";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";
const SEARCH_TTL_MS = 2 * 60 * 1000;
const SEARCH_CACHE_MAX = 100;

let cachedToken: { token: string; expiresAt: number } | null = null;
let searchCache = new Map<string, { expiresAt: number; data: SearchResponse }>();

const mockResults = (now: string): SearchResponse => [
  {
    id: "mock-1",
    title: "Neon Skyline",
    artist: "Night Arcade",
    url: "https://example.com/preview/neon-skyline",
    addedBy: null,
    createdAt: now,
    order: null,
  },
  {
    id: "mock-2",
    title: "Pulse Runner",
    artist: "Chrome Drive",
    url: "https://example.com/preview/pulse-runner",
    addedBy: null,
    createdAt: now,
    order: null,
  },
  {
    id: "mock-3",
    title: "Violet Drift",
    artist: "Static Bloom",
    url: "https://example.com/preview/violet-drift",
    addedBy: null,
    createdAt: now,
    order: null,
  },
];

const getCachedSearch = (query: string) => {
  const key = query.toLowerCase();
  const cached = searchCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    searchCache.delete(key);
    return null;
  }
  searchCache.delete(key);
  searchCache.set(key, cached);
  return cached.data;
};

const setCachedSearch = (query: string, data: SearchResponse) => {
  const key = query.toLowerCase();
  searchCache.set(key, { expiresAt: Date.now() + SEARCH_TTL_MS, data });
  if (searchCache.size <= SEARCH_CACHE_MAX) return;
  const firstKey = searchCache.keys().next().value as string | undefined;
  if (firstKey) searchCache.delete(firstKey);
};

const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({ grant_type: "client_credentials" });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) return null;

  const expiresInMs = (json.expires_in ?? 3600) * 1000;
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + expiresInMs - 60000,
  };

  return cachedToken.token;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";
  if (!query) return NextResponse.json([]);

  const cached = getCachedSearch(query);
  if (cached) return NextResponse.json(cached);

  const token = await getAccessToken();
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      const now = new Date().toISOString();
      const out = mockResults(now);
      setCachedSearch(query, out);
      return NextResponse.json(out);
    }

    const error: ApiError = { error: "missing Spotify credentials" };
    return NextResponse.json(error, { status: 500 });
  }

  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", "10");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error: ApiError = { error: "Spotify search failed" };
    return NextResponse.json(error, { status: 502 });
  }

  const json = (await res.json()) as {
    tracks?: {
      items?: Array<{
        id: string;
        name: string;
        preview_url?: string | null;
        artists?: Array<{ name: string }>;
      }>;
    };
  };

  const items = json.tracks?.items ?? [];
  const now = new Date().toISOString();
  const out: SearchResponse = items.map((item) => ({
    id: item.id,
    title: item.name,
    artist: item.artists?.[0]?.name ?? null,
    url: item.preview_url ?? null,
    addedBy: null,
    createdAt: now,
    order: null,
  }));

  setCachedSearch(query, out);

  return NextResponse.json(out);
}
