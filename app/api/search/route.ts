import { NextResponse } from "next/server";
import type { ApiError, SearchResponse } from "../../../src/types/jukebox";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";

let cachedToken: { token: string; expiresAt: number } | null = null;

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

  const token = await getAccessToken();
  if (!token) {
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

  return NextResponse.json(out);
}
