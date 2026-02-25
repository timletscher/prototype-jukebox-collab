"use client";

import { create } from "zustand";
import type { QueueItem as ApiQueueItem } from "../types/jukebox";
import { fetchQueue, addQueueItem, deleteQueueItem, clearQueue as apiClearQueue } from "./api";
import { broadcastQueueChange } from "./useRealtime";

export type QueueItem = ApiQueueItem;

export type ActiveUser = {
  username: string;
  sessionId: string;
  lastSeen: number;
  isAdmin: boolean;
};

export type JukeboxState = {
  user?: string;
  queue: QueueItem[];
  currentItem?: QueueItem;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  volume: number;
  activeUsers: ActiveUser[];
  activeUserCount: number;
  lastPresenceAt: number | null;
  setUser: (name: string) => void;
  setQueue: (items: QueueItem[]) => void;
  addItem: (item: QueueItem) => void;
  removeItem: (id: string) => void;
  clearQueue: () => void;
  setCurrentItem: (item?: QueueItem) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPositionMs: (positionMs: number) => void;
  setDurationMs: (durationMs: number) => void;
  setVolume: (volume: number) => void;
  setActiveUsers: (users: ActiveUser[]) => void;
  // async remote operations
  loadQueue: () => Promise<void>;
  addItemRemote: (payload: { title: string; url?: string | null; addedBy?: string | null }) => Promise<QueueItem>;
  removeItemRemote: (id: string) => Promise<boolean>;
  clearQueueRemote: () => Promise<boolean>;
};

const getInitialVolume = () => {
  if (typeof window === "undefined") return 0.6;
  try {
    const stored = window.localStorage.getItem("jukebox.volume");
    if (!stored) return 0.6;
    const parsed = Number(stored);
    if (Number.isNaN(parsed)) return 0.6;
    return Math.min(1, Math.max(0, parsed));
  } catch {
    return 0.6;
  }
};

const useJukeboxStore = create<JukeboxState>((set, get) => ({
  user: undefined,
  queue: [],
  currentItem: undefined,
  isPlaying: false,
  positionMs: 0,
  durationMs: 30000,
  volume: getInitialVolume(),
  activeUsers: [],
  activeUserCount: 0,
  lastPresenceAt: null,
  setUser: (name) => set({ user: name }),
  setQueue: (items) => set({ queue: items }),
  addItem: (item) =>
    set((s) => ({ queue: [...s.queue, { ...item, id: item.id || Date.now().toString() }] })),
  removeItem: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
  clearQueue: () => set({ queue: [] }),
  setCurrentItem: (item) => set({ currentItem: item }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPositionMs: (positionMs) => set({ positionMs }),
  setDurationMs: (durationMs) => set({ durationMs }),
  setVolume: (volume) => {
    const clamped = Math.min(1, Math.max(0, volume));
    set({ volume: clamped });
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("jukebox.volume", String(clamped));
    } catch {
      // ignore persistence errors
    }
  },
  setActiveUsers: (users) =>
    set({ activeUsers: users, activeUserCount: users.length, lastPresenceAt: Date.now() }),

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
      await broadcastQueueChange();
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
      await broadcastQueueChange();
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
      await broadcastQueueChange();
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
