"use client";

import React from "react";
import useJukeboxStore, { QueueItem } from "../lib/jukeboxStore";
import { deleteQueueItem, fetchQueue, clearQueue as apiClearQueue } from "../lib/api";

function QueueItemView({ item }: { item: QueueItem }) {
  const removeItemLocal = useJukeboxStore((s) => s.removeItem);
  const setQueue = useJukeboxStore((s) => s.setQueue);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, borderBottom: "1px solid #f4f4f4" }}>
      <div style={{ flex: 1 }}>
        <div><strong>{item.title}</strong></div>
        <div style={{ fontSize: 12, color: "#666" }}>{item.artist}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={async () => {
            try {
              await deleteQueueItem(item.id);
              const latest = await fetchQueue();
              setQueue(latest);
            } catch (err) {
              // fallback to local removal on error
              // eslint-disable-next-line no-console
              console.error('delete failed, falling back to local remove', err);
              removeItemLocal(item.id);
            }
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function QueuePanel() {
  const queue = useJukeboxStore((s) => s.queue);
  const setQueue = useJukeboxStore((s) => s.setQueue);

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
        <button
          onClick={async () => {
            try {
              await apiClearQueue();
              setQueue([]);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('clear failed', err);
            }
          }}
        >
          Clear Queue
        </button>
      </div>
    </div>
  );
}
