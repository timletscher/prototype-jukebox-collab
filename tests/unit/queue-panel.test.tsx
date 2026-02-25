import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useJukeboxStore from "../../src/lib/jukeboxStore";
import QueuePanel from "../../src/components/QueuePanel";

const mockQueueItem = {
  id: "queue-1",
  title: "Pulse Runner",
  artist: "Chrome Drive",
  url: null,
  addedBy: "tester",
  createdAt: new Date().toISOString(),
  order: 1,
};

describe("QueuePanel", () => {
  beforeEach(() => {
    useJukeboxStore.setState({
      queue: [],
      loadQueue: jest.fn(async () => undefined),
      removeItemRemote: jest.fn(async () => true),
      clearQueueRemote: jest.fn(async () => true),
    });
  });

  it("renders empty state when queue is empty", () => {
    render(<QueuePanel />);
    expect(screen.getByText("Queue Empty")).toBeInTheDocument();
  });

  it("renders queue items and calls remove", async () => {
    useJukeboxStore.setState({ queue: [mockQueueItem] });
    const user = userEvent.setup();
    render(<QueuePanel />);

    expect(screen.getByText("Pulse Runner")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    const { removeItemRemote } = useJukeboxStore.getState();
    expect(removeItemRemote).toHaveBeenCalledWith("queue-1");
  });
});
