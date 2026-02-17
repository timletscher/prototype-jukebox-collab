"use client";

import React, { useEffect } from "react";
import useJukeboxStore, { QueueItem } from "../lib/jukeboxStore";

function QueueItemView({ item }: { item: QueueItem }) {
  const removeItemRemote = useJukeboxStore((s) => s.removeItemRemote);
  return (
    <div className="queue-item">
      <div style={{ flex: 1 }}>
        <div className="queue-item-title">{item.title}</div>
        <div className="queue-item-artist">{item.artist ?? ""}</div>
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
          className="button-ghost"
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
    <section className="panel">
      <div className="panel-title">Queue</div>
      <div className="panel-subtitle" style={{ marginBottom: "var(--spacing-sm)" }}>
        {queue.length}/25 slots filled
      </div>
      <div>
        {queue.length === 0 ? (
          <div className="queue-empty">Queue Empty</div>
        ) : (
          <div>
            {queue.map((q) => (
              <QueueItemView key={q.id} item={q} />
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: "var(--spacing-sm)", display: "flex", gap: "var(--spacing-sm)" }}>
        <button
          onClick={async () => {
            try {
              await loadQueue();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("refresh failed", err);
            }
          }}
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
          className="button-ghost"
        >
          Clear Queue
        </button>
      </div>
    </section>
  );
}
