import create from 'zustand'

export type QueueItem = {
  id: string
  songId: string
  title: string
  artist: string
  position: number
}

type UserSession = {
  username?: string
  sessionId?: string
}

type AudioState = {
  currentSongId?: string
  isPlaying: boolean
  progress: number
}

type JukeboxState = {
  user: UserSession
  queue: QueueItem[]
  votes: Record<string, number>
  genre?: string
  audio: AudioState
  history: QueueItem[]
  // actions
  setUser: (u: UserSession) => void
  addToQueue: (item: QueueItem) => void
  removeFromQueue: (id: string) => void
  setPlaying: (songId?: string) => void
}

export const useJukeboxStore = create<JukeboxState>((set) => ({
  user: {},
  queue: [],
  votes: {},
  genre: undefined,
  audio: { isPlaying: false, progress: 0 },
  history: [],
  setUser: (u) => set({ user: u }),
  addToQueue: (item) => set((s) => ({ queue: [...s.queue, item] })),
  removeFromQueue: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
  setPlaying: (songId) => set((s) => ({ audio: { ...s.audio, currentSongId: songId, isPlaying: !!songId } }))
}))
