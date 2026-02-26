"use client";

import React, { useCallback, useEffect } from "react";
import useJukeboxStore, { QueueItem } from "../lib/jukeboxStore";
import { useQueueRealtime } from "../lib/useRealtime";

function QueueItemView({
  item,
  isFirst,
  isLast,
}: {
  item: QueueItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const removeItemRemote = useJukeboxStore((s) => s.removeItemRemote);
  const moveQueueItemRemote = useJukeboxStore((s) => s.moveQueueItemRemote);
  const songLabel = `${item.title}${item.artist ? ` by ${item.artist}` : ""}`;
  const artistName = item.artist?.trim();
  const artistLabel = artistName ? artistName : "Unknown artist";
  const addedByLabel = item.addedBy ? `Added by ${item.addedBy}` : "Added by unknown";
  return (
    <div className="queue-item" role="listitem">
      <div style={{ flex: 1 }}>
        <div className="queue-item-title">{item.title}</div>
        <div className="queue-item-artist">{artistLabel}</div>
        <div className="queue-item-meta">{addedByLabel}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={async () => {
            try {
              await moveQueueItemRemote(item.id, "up");
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("move up failed", err);
            }
          }}
          className="button-ghost"
          disabled={isFirst}
          aria-label={`Move ${songLabel} up`}
        >
          Up
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await moveQueueItemRemote(item.id, "down");
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("move down failed", err);
            }
          }}
          className="button-ghost"
          disabled={isLast}
          aria-label={`Move ${songLabel} down`}
        >
          Down
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await removeItemRemote(item.id);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("remove failed", err);
            }
          }}
          className="button-ghost"
          aria-label={`Remove ${songLabel}`}
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
  const refreshQueue = useCallback(() => loadQueue(), [loadQueue]);

  useEffect(() => {
    (async () => {
      try {
        await loadQueue();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("failed to load queue on mount", err);
      }
    })();
  }, [loadQueue]);

  useQueueRealtime({
    onChange: refreshQueue,
  });

  return (
    <section className="panel" aria-labelledby="queue-title">
      <div className="panel-title" id="queue-title">Queue</div>
      <div className="panel-subtitle" style={{ marginBottom: "var(--spacing-sm)" }}>
        {queue.length}/25 slots filled
      </div>
      <div>
        {queue.length === 0 ? (
          <div className="queue-empty" role="status" aria-live="polite">
            Queue Empty
          </div>
        ) : (
          <div role="list" aria-label="Queue items">
            {queue.map((q, index) => (
              <QueueItemView
                key={q.id}
                item={q}
                isFirst={index === 0}
                isLast={index === queue.length - 1}
              />
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: "var(--spacing-sm)", display: "flex", gap: "var(--spacing-sm)" }}>
        <button
          type="button"
          onClick={async () => {
            try {
              await refreshQueue();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("refresh failed", err);
            }
          }}
        >
          Refresh
        </button>
        <button
          type="button"
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
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await fetch("/api/queue/test", { method: "POST" });
              if (!res.ok) throw new Error("test add failed");
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("test add failed", err);
            }
          }}
        >
          Add Test Item
        </button>
      </div>
    </section>
  );
}
