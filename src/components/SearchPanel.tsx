"use client";

import React, { useEffect, useMemo, useState } from "react";
import useJukeboxStore from "../lib/jukeboxStore";
import type { QueueItem } from "../types/jukebox";

const MOCK_RESULTS: QueueItem[] = [
  {
    id: "mock-1",
    title: "Neon Skyline",
    artist: "Night Arcade",
    url: "https://example.com/preview/neon-skyline",
    addedBy: null,
    createdAt: "2026-02-25T00:00:00.000Z",
    order: null,
  },
  {
    id: "mock-2",
    title: "Pulse Runner",
    artist: "Chrome Drive",
    url: "https://example.com/preview/pulse-runner",
    addedBy: null,
    createdAt: "2026-02-25T00:00:00.000Z",
    order: null,
  },
  {
    id: "mock-3",
    title: "Violet Drift",
    artist: "Static Bloom",
    url: "https://example.com/preview/violet-drift",
    addedBy: null,
    createdAt: "2026-02-25T00:00:00.000Z",
    order: null,
  },
];

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const addItemRemote = useJukeboxStore((s) => s.addItemRemote);
  const user = useJukeboxStore((s) => s.user) || "anonymous";

  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) return [];
    return MOCK_RESULTS.filter((item) => {
      const title = item.title.toLowerCase();
      const artist = (item.artist ?? "").toLowerCase();
      return title.includes(trimmed) || artist.includes(trimmed);
    });
  }, [query]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setResults(filteredResults);
    setLoading(false);
  }, [filteredResults, query]);

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
        placeholder="Search songs"
        aria-describedby="search-help"
        className="input"
      />
      <div id="search-help" className="sr-only">
        Type at least two characters to see results.
      </div>
      <ul style={{ marginTop: "var(--spacing-sm)" }} aria-live="polite">
        {loading && <li className="panel-subtitle">Searching...</li>}
        {!loading && results.length === 0 && query.trim().length >= 2 && (
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
                  await addItemRemote({ title: r.title, url: r.url ?? null, addedBy: user });
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
