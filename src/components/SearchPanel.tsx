"use client";

import React, { useEffect, useRef, useState } from "react";
import useJukeboxStore from "../lib/jukeboxStore";
import { searchSongs } from "../lib/api";
import type { QueueItem } from "../types/jukebox";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const addItemRemote = useJukeboxStore((s) => s.addItemRemote);
  const user = useJukeboxStore((s) => s.user) || "anonymous";

  const runSearch = async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchSongs(trimmed);
      setResults(data);
    } catch (err) {
      setResults([]);
      setError("Search is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const handle = window.setTimeout(async () => {
      if (cancelled) return;
      await runSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    debounceRef.current = handle;

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query]);

  return (
    <section className="panel" aria-labelledby="search-title">
      <div className="panel-title" id="search-title">Search</div>
      <label htmlFor="search-input" className="sr-only">
        Search songs
      </label>
      <input
        id="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          if (debounceRef.current) window.clearTimeout(debounceRef.current);
          runSearch(query);
        }}
        placeholder="Search songs"
        aria-describedby="search-help"
        className="input"
      />
      <div id="search-help" className="sr-only">
        Type at least two characters to see results. Press Enter to search immediately.
      </div>
      <ul style={{ marginTop: "var(--spacing-sm)" }} aria-live="polite">
        {loading && <li className="panel-subtitle">Searching...</li>}
        {!loading && error && (
          <li className="panel-subtitle">
            {error === "missing Spotify credentials"
              ? "Spotify search is not configured yet."
              : error}
          </li>
        )}
        {!loading && !error && results.length === 0 && query.trim().length >= MIN_QUERY_LENGTH && (
          <li className="panel-subtitle">No matches yet.</li>
        )}
        {results.map((r) => (
          <li key={r.id} className="search-result">
            <div style={{ flex: 1 }}>
              <div className="queue-item-title">{r.title}</div>
              <div className="search-meta">{r.artist ?? ""}</div>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await addItemRemote({
                    title: r.title,
                    artist: r.artist ?? null,
                    url: r.url ?? null,
                    addedBy: user,
                  });
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error("add failed", err);
                }
              }}
              className="button-primary"
              aria-label={`Add ${r.title}${r.artist ? ` by ${r.artist}` : ""} to queue`}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
