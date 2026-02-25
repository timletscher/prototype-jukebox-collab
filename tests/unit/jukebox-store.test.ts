import useJukeboxStore from "../../src/lib/jukeboxStore";

describe("jukeboxStore", () => {
  beforeEach(() => {
    useJukeboxStore.setState({ queue: [], user: undefined });
  });

  it("adds items to the queue", () => {
    const item = {
      id: "item-1",
      title: "Neon Skyline",
      artist: "Night Arcade",
      url: null,
      addedBy: "tester",
      createdAt: new Date().toISOString(),
      order: 1,
    };

    useJukeboxStore.getState().addItem(item);
    const { queue } = useJukeboxStore.getState();

    expect(queue).toHaveLength(1);
    expect(queue[0].title).toBe("Neon Skyline");
  });

  it("clears the queue", () => {
    useJukeboxStore.setState({
      queue: [
        {
          id: "item-2",
          title: "Pulse Runner",
          artist: "Chrome Drive",
          url: null,
          addedBy: "tester",
          createdAt: new Date().toISOString(),
          order: 1,
        },
      ],
    });

    useJukeboxStore.getState().clearQueue();
    expect(useJukeboxStore.getState().queue).toHaveLength(0);
  });
});
