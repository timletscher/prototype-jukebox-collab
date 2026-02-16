"use client";

import React from "react";
import useJukeboxStore, { QueueItem } from "../lib/jukeboxStore";

function QueueItemView({ item }: { item: QueueItem }) {
  const removeItem = useJukeboxStore((s) => s.removeItem);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, borderBottom: "1px solid #f4f4f4" }}>
      <div style={{ flex: 1 }}>
        <div><strong>{item.title}</strong></div>
        <div style={{ fontSize: 12, color: "#666" }}>{item.artist}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => removeItem(item.id)}>Remove</button>
      </div>
    </div>
  );
}

export default function QueuePanel() {
  const queue = useJukeboxStore((s) => s.queue);
  const clearQueue = useJukeboxStore((s) => s.clearQueue);

  return (
    <div style={{ padding: 12, border: "1px solid #eee" }}>
      <h4>Queue</h4>
      <div>
        {queue.length === 0 ? (
          <div style={{ color: "#666" }}>Queue is empty</div>
        ) : (
          <div>
            {queue.map((q) => (
              <QueueItemView key={q.id} item={q} />
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={() => clearQueue()}>Clear Queue</button>
      </div>
    </div>
  );
}
