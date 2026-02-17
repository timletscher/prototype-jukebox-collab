"use client";

import React, { useState } from "react";
import useJukeboxStore from "../lib/jukeboxStore";

const MOCK_RESULTS: Array<{ id: string; title: string; artist?: string }> = [
  { id: "1", title: "Song A", artist: "Artist 1" },
  { id: "2", title: "Song B", artist: "Artist 2" },
  { id: "3", title: "Song C", artist: "Artist 3" },
];

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const addItemRemote = useJukeboxStore((s) => s.addItemRemote);
  const user = useJukeboxStore((s) => s.user) || "anonymous";

  const results = MOCK_RESULTS.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

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
        {results.map((r) => (
          <li key={r.id} className="search-result">
            <div style={{ flex: 1 }}>
              <div className="queue-item-title">{r.title}</div>
              <div className="search-meta">{r.artist}</div>
            </div>
            <button
              onClick={async () => {
                try {
                  await addItemRemote({ title: r.title, addedBy: user });
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
