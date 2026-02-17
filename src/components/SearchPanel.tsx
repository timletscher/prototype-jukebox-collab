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
    <div style={{ padding: 12, border: "1px solid #eee" }}>
      <h4>Search</h4>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search songs"
        aria-label="search-input"
        style={{ padding: 8, width: "100%" }}
      />
      <ul style={{ marginTop: 8 }}>
        {results.map((r) => (
          <li key={r.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <strong>{r.title}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>{r.artist}</div>
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
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
