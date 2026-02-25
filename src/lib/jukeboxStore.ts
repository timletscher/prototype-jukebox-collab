"use client";

import { create } from "zustand";
import type {
  QueueItem as ApiQueueItem,
  QueueReorderDirection,
  VoteCounts,
  VoteType,
} from "../types/jukebox";
import {
  fetchQueue,
  addQueueItem,
  deleteQueueItem,
  clearQueue as apiClearQueue,
  reorderQueue,
} from "./api";
import { broadcastQueueChange, broadcastVoteChange } from "./useRealtime";

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
  currentGenre: string | null;
  adminUser: string | null;
  activeUsers: ActiveUser[];
  activeUserCount: number;
  lastPresenceAt: number | null;
  votesBySongId: Record<string, VoteCounts>;
  userVotesBySongId: Record<string, VoteType>;
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
  setGenre: (genre: string) => void;
  transferAdmin: (nextAdmin: string) => void;
  setActiveUsers: (users: ActiveUser[]) => void;
  setVoteCounts: (songId: string, counts: VoteCounts) => void;
  applyVoteChange: (songId: string, previousVote: VoteType | null, nextVote: VoteType) => void;
  castVoteOptimistic: (songId: string, voteType: VoteType, sessionId?: string | null) => void;
  // async remote operations
  loadQueue: () => Promise<void>;
  addItemRemote: (payload: { title: string; url?: string | null; addedBy?: string | null }) => Promise<QueueItem>;
  removeItemRemote: (id: string) => Promise<boolean>;
  clearQueueRemote: () => Promise<boolean>;
  moveQueueItemRemote: (id: string, direction: QueueReorderDirection) => Promise<void>;
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

const emptyVoteCounts = (): VoteCounts => ({
  thumbsDown: 0,
  thumbsUp: 0,
  doubleThumbsUp: 0,
});

const applyVoteDelta = (
  counts: VoteCounts,
  previousVote: VoteType | null,
  nextVote: VoteType
): VoteCounts => {
  const next = { ...counts };
  if (previousVote === "thumbsDown") next.thumbsDown = Math.max(0, next.thumbsDown - 1);
  if (previousVote === "thumbsUp") next.thumbsUp = Math.max(0, next.thumbsUp - 1);
  if (previousVote === "doubleThumbsUp") {
    next.doubleThumbsUp = Math.max(0, next.doubleThumbsUp - 1);
  }
  if (nextVote === "thumbsDown") next.thumbsDown += 1;
  if (nextVote === "thumbsUp") next.thumbsUp += 1;
  if (nextVote === "doubleThumbsUp") next.doubleThumbsUp += 1;
  return next;
};

const moveQueueItem = (
  items: QueueItem[],
  id: string,
  direction: QueueReorderDirection
): QueueItem[] => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = items.slice();
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);
  return next;
};

const withAdminFlag = (users: ActiveUser[], adminUser: string | null) =>
  users.map((user) => ({ ...user, isAdmin: Boolean(adminUser && user.username === adminUser) }));

const canAdmin = (state: { user?: string; adminUser: string | null }) => {
  if (!state.adminUser) return true;
  if (!state.user) return false;
  return state.user === state.adminUser;
};

const useJukeboxStore = create<JukeboxState>((set, get) => ({
  user: undefined,
  queue: [],
  currentItem: undefined,
  isPlaying: false,
  positionMs: 0,
  durationMs: 30000,
  volume: getInitialVolume(),
  currentGenre: null,
  adminUser: null,
  activeUsers: [],
  activeUserCount: 0,
  lastPresenceAt: null,
  votesBySongId: {},
  userVotesBySongId: {},
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
  setGenre: (genre) => {
    const trimmed = genre.trim();
    if (!trimmed) return;
    const user = get().user ?? null;
    if (!user) return;
    set((state) => ({
      currentGenre: trimmed,
      adminUser: user,
      activeUsers: withAdminFlag(state.activeUsers, user),
    }));
  },
  transferAdmin: (nextAdmin) => {
    const trimmed = nextAdmin.trim();
    if (!trimmed) return;
    const currentAdmin = get().adminUser;
    const user = get().user;
    if (!user || currentAdmin !== user) return;
    set((state) => ({
      adminUser: trimmed,
      activeUsers: withAdminFlag(state.activeUsers, trimmed),
    }));
  },
  setActiveUsers: (users) =>
    set((state) => ({
      activeUsers: withAdminFlag(users, state.adminUser),
      activeUserCount: users.length,
      lastPresenceAt: Date.now(),
    })),
  setVoteCounts: (songId, counts) =>
    set((state) => ({ votesBySongId: { ...state.votesBySongId, [songId]: counts } })),
  applyVoteChange: (songId, previousVote, nextVote) =>
    set((state) => {
      const existing = state.votesBySongId[songId] ?? emptyVoteCounts();
      const updated = applyVoteDelta(existing, previousVote, nextVote);
      return { votesBySongId: { ...state.votesBySongId, [songId]: updated } };
    }),
  castVoteOptimistic: (songId, voteType, sessionId) => {
    const previousVote = get().userVotesBySongId[songId] ?? null;
    set((state) => {
      const existing = state.votesBySongId[songId] ?? emptyVoteCounts();
      const updated = applyVoteDelta(existing, previousVote, voteType);
      return {
        votesBySongId: { ...state.votesBySongId, [songId]: updated },
        userVotesBySongId: { ...state.userVotesBySongId, [songId]: voteType },
      };
    });
    void broadcastVoteChange({
      songId,
      voteType,
      previousVote,
      sessionId: sessionId ?? null,
    });
  },

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
  moveQueueItemRemote: async (id, direction) => {
    if (!canAdmin(get())) {
      throw new Error("admin required");
    }
    const prev = get().queue;
    const optimistic = moveQueueItem(prev, id, direction);
    if (optimistic === prev) return;
    set({ queue: optimistic });
    try {
      const updated = await reorderQueue({ id, direction });
      set({ queue: updated });
      await broadcastQueueChange();
    } catch (err) {
      set({ queue: prev });
      throw err;
    }
  },
}));

export default useJukeboxStore;

// NOTE: keep exported types for components/tests
export { useJukeboxStore as useStore };
