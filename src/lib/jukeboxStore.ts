"use client";

import create from "zustand";
import type { QueueItem as ApiQueueItem } from "../types/jukebox";

export type QueueItem = ApiQueueItem;

export type JukeboxState = {
  user?: string;
  queue: QueueItem[];
  setUser: (name: string) => void;
  setQueue: (items: QueueItem[]) => void;
  addItem: (item: QueueItem) => void;
  removeItem: (id: string) => void;
  clearQueue: () => void;
};

const useJukeboxStore = create<JukeboxState>((set) => ({
  user: undefined,
  queue: [],
  setUser: (name) => set({ user: name }),
  setQueue: (items) => set({ queue: items }),
  addItem: (item) =>
    set((s) => ({ queue: [...s.queue, { ...item, id: item.id || Date.now().toString() }] })),
  removeItem: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
  clearQueue: () => set({ queue: [] }),
}));

export default useJukeboxStore;

// NOTE: keep exported types for components/tests
export { useJukeboxStore as useStore };
