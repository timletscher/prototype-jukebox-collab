import useJukeboxStore from "../../src/lib/jukeboxStore";
import { reorderQueue } from "../../src/lib/api";
import { broadcastVoteChange } from "../../src/lib/useRealtime";

type QueueItem = {
  id: string;
  title: string;
  url?: string | null;
  addedBy?: string | null;
  createdAt?: string;
  order?: number | null;
};

jest.mock("../../src/lib/api", () => ({
  fetchQueue: jest.fn(),
  addQueueItem: jest.fn(),
  deleteQueueItem: jest.fn(),
  clearQueue: jest.fn(),
  reorderQueue: jest.fn(),
}));

jest.mock("../../src/lib/useRealtime", () => ({
  broadcastQueueChange: jest.fn(),
  broadcastVoteChange: jest.fn(),
}));

const resetStore = () => {
  useJukeboxStore.setState({
    user: undefined,
    queue: [],
    currentItem: undefined,
    isPlaying: false,
    positionMs: 0,
    durationMs: 30000,
    volume: 0.6,
    currentGenre: null,
    adminUser: null,
    activeUsers: [],
    activeUserCount: 0,
    lastPresenceAt: null,
    votesBySongId: {},
    userVotesBySongId: {},
  });
};

describe("jukeboxStore", () => {
  beforeEach(() => {
    resetStore();
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  test("setGenre requires a user and assigns admin", () => {
    const store = useJukeboxStore.getState();

    store.setGenre("Synthwave");
    expect(useJukeboxStore.getState().currentGenre).toBeNull();

    store.setUser("Ada");
    useJukeboxStore.setState({
      activeUsers: [
        { username: "Ada", sessionId: "1", lastSeen: Date.now(), isAdmin: false },
        { username: "Ben", sessionId: "2", lastSeen: Date.now(), isAdmin: false },
      ],
      activeUserCount: 2,
    });

    store.setGenre("Synthwave");
    const next = useJukeboxStore.getState();
    expect(next.currentGenre).toBe("Synthwave");
    expect(next.adminUser).toBe("Ada");
    expect(next.activeUsers.find((u) => u.username === "Ada")?.isAdmin).toBe(true);
  });

  test("transferAdmin only works for current admin", () => {
    const store = useJukeboxStore.getState();
    store.setUser("Ben");
    useJukeboxStore.setState({ adminUser: "Ada" });

    store.transferAdmin("Ben");
    expect(useJukeboxStore.getState().adminUser).toBe("Ada");

    store.setUser("Ada");
    useJukeboxStore.setState({
      activeUsers: [
        { username: "Ada", sessionId: "1", lastSeen: Date.now(), isAdmin: true },
        { username: "Ben", sessionId: "2", lastSeen: Date.now(), isAdmin: false },
      ],
      activeUserCount: 2,
    });

    store.transferAdmin("Ben");
    const next = useJukeboxStore.getState();
    expect(next.adminUser).toBe("Ben");
    expect(next.activeUsers.find((u) => u.username === "Ben")?.isAdmin).toBe(true);
  });

  test("applyVoteChange updates counts correctly", () => {
    const store = useJukeboxStore.getState();
    store.applyVoteChange("song-1", null, "thumbsUp");
    let counts = useJukeboxStore.getState().votesBySongId["song-1"];
    expect(counts.thumbsUp).toBe(1);

    store.applyVoteChange("song-1", "thumbsUp", "doubleThumbsUp");
    counts = useJukeboxStore.getState().votesBySongId["song-1"];
    expect(counts.thumbsUp).toBe(0);
    expect(counts.doubleThumbsUp).toBe(1);
  });

  test("castVoteOptimistic updates user votes and broadcasts", () => {
    const store = useJukeboxStore.getState();
    store.setUser("Ada");

    store.castVoteOptimistic("song-1", "thumbsDown", "sess-1");
    let counts = useJukeboxStore.getState().votesBySongId["song-1"];
    expect(counts.thumbsDown).toBe(1);
    expect(useJukeboxStore.getState().userVotesBySongId["song-1"]).toBe("thumbsDown");

    store.castVoteOptimistic("song-1", "thumbsUp", "sess-1");
    counts = useJukeboxStore.getState().votesBySongId["song-1"];
    expect(counts.thumbsDown).toBe(0);
    expect(counts.thumbsUp).toBe(1);

    const mockBroadcast = broadcastVoteChange as jest.Mock;
    expect(mockBroadcast).toHaveBeenCalled();
    const lastCall = mockBroadcast.mock.calls[mockBroadcast.mock.calls.length - 1][0];
    expect(lastCall.previousVote).toBe("thumbsDown");
    expect(lastCall.voteType).toBe("thumbsUp");
  });

  test("moveQueueItemRemote enforces admin and reorders", async () => {
    const store = useJukeboxStore.getState();
    store.setUser("Ada");
    useJukeboxStore.setState({ adminUser: "Ada" });

    const queue: QueueItem[] = [
      { id: "a", title: "Song A" },
      { id: "b", title: "Song B" },
    ];
    useJukeboxStore.setState({ queue });

    const mockReorder = reorderQueue as jest.Mock;
    mockReorder.mockResolvedValue([queue[1], queue[0]]);

    await store.moveQueueItemRemote("b", "up");
    expect(useJukeboxStore.getState().queue[0].id).toBe("b");

    store.setUser("Ben");
    await expect(store.moveQueueItemRemote("b", "up")).rejects.toThrow("admin required");
  });
});
