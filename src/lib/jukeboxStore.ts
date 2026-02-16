"use client";

import create from "zustand";
import type { QueueItem as ApiQueueItem } from "../types/jukebox";
import { fetchQueue, addQueueItem, deleteQueueItem, clearQueue as apiClearQueue } from "./api";

export type QueueItem = ApiQueueItem;

export type JukeboxState = {
  user?: string;
  queue: QueueItem[];
  setUser: (name: string) => void;
  setQueue: (items: QueueItem[]) => void;
  addItem: (item: QueueItem) => void;
  removeItem: (id: string) => void;
  clearQueue: () => void;
  // async remote operations
  loadQueue: () => Promise<void>;
  addItemRemote: (payload: { title: string; url?: string | null; addedBy?: string | null }) => Promise<QueueItem>;
  removeItemRemote: (id: string) => Promise<boolean>;
  clearQueueRemote: () => Promise<boolean>;
};

const useJukeboxStore = create<JukeboxState>((set, get) => ({
  user: undefined,
  queue: [],
  setUser: (name) => set({ user: name }),
  setQueue: (items) => set({ queue: items }),
  addItem: (item) =>
    set((s) => ({ queue: [...s.queue, { ...item, id: item.id || Date.now().toString() }] })),
  removeItem: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
  clearQueue: () => set({ queue: [] }),

  // async helpers that talk to the server with optimistic updates
  loadQueue: async () => {
    const items = await fetchQueue();
    set({ queue: items });
  },

  addItemRemote: async (payload: { title: string; url?: string | null; addedBy?: string | null }) => {
    const tempId = `tmp-${Date.now()}`;
    const temp: ApiQueueItem = {
      id: tempId,
      title: payload.title,
      url: payload.url ?? null,
      addedBy: payload.addedBy ?? null,
      createdAt: new Date().toISOString(),
      order: null,
    };

    // optimistic add
    set((s) => ({ queue: [...s.queue, temp] }));

    try {
      const created = await addQueueItem(payload);
      // replace temp with created
      set((s) => ({ queue: s.queue.map((q) => (q.id === tempId ? created : q)) }));
      return created;
    } catch (err) {
      // rollback
      set((s) => ({ queue: s.queue.filter((q) => q.id !== tempId) }));
      // rethrow for caller handling
      throw err;
    }
  },

  removeItemRemote: async (id: string) => {
    const prev = get().queue;
    // optimistic remove
    set((s) => ({ queue: s.queue.filter((q) => q.id !== id) }));
    try {
      await deleteQueueItem(id);
      return true;
    } catch (err) {
      // rollback by resetting previous queue
      set({ queue: prev });
      throw err;
    }
  },

  clearQueueRemote: async () => {
    const prev = get().queue;
    set({ queue: [] });
    try {
      await apiClearQueue();
      return true;
    } catch (err) {
      set({ queue: prev });
      throw err;
    }
  },
}));

export default useJukeboxStore;

// NOTE: keep exported types for components/tests
export { useJukeboxStore as useStore };
