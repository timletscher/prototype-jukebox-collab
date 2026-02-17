"use client";

import React, { useEffect, useState } from "react";
import useJukeboxStore from "../lib/jukeboxStore";
import type { QueueItem } from "../types/jukebox";
import { searchSongs } from "../lib/api";

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const addItemRemote = useJukeboxStore((s) => s.addItemRemote);
  const user = useJukeboxStore((s) => s.user) || "anonymous";

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      searchSongs(trimmed)
        .then((items) => {
          if (active) setResults(items);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <section className="panel">
      <div className="panel-title">Search</div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search songs"
        aria-label="search-input"
        className="input"
      />
      <ul style={{ marginTop: "var(--spacing-sm)" }}>
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
              onClick={async () => {
                try {
                  await addItemRemote({ title: r.title, url: r.url ?? null, addedBy: user });
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error("add failed", err);
                }
              }}
              className="button-primary"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
