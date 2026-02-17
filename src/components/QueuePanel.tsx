"use client";

import React, { useEffect } from "react";
import useJukeboxStore, { QueueItem } from "../lib/jukeboxStore";

function QueueItemView({ item }: { item: QueueItem }) {
  const removeItemRemote = useJukeboxStore((s) => s.removeItemRemote);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, borderBottom: "1px solid #f4f4f4" }}>
      <div style={{ flex: 1 }}>
        <div><strong>{item.title}</strong></div>
        <div style={{ fontSize: 12, color: "#666" }}>{item.artist ?? ""}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={async () => {
            try {
              await removeItemRemote(item.id);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("remove failed", err);
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
  const loadQueue = useJukeboxStore((s) => s.loadQueue);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadQueue();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("failed to load queue on mount", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadQueue]);

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
              await loadQueue();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("refresh failed", err);
            }
          }}
          style={{ marginRight: 8 }}
        >
          Refresh
        </button>
        <button
          onClick={async () => {
            try {
              const clearQueueRemote = useJukeboxStore.getState().clearQueueRemote;
              await clearQueueRemote();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("clear failed", err);
            }
          }}
        >
          Clear Queue
        </button>
      </div>
    </div>
  );
}
