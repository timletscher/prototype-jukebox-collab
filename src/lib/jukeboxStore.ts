"use client";

import create from "zustand";

export type QueueItem = {
  id: string;
  title: string;
  artist?: string;
  addedBy?: string;
};

export type JukeboxState = {
  user?: string;
  queue: QueueItem[];
  setUser: (name: string) => void;
  addItem: (item: QueueItem) => void;
  removeItem: (id: string) => void;
  clearQueue: () => void;
};

const useJukeboxStore = create<JukeboxState>((set) => ({
  user: undefined,
  queue: [],
  setUser: (name) => set({ user: name }),
  addItem: (item) =>
    set((s) => ({ queue: [...s.queue, { ...item, id: item.id || Date.now().toString() }] })),
  removeItem: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
  clearQueue: () => set({ queue: [] }),
}));

export default useJukeboxStore;

// NOTE: keep exported types for components/tests
export { useJukeboxStore as useStore };
