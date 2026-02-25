import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useJukeboxStore from "../../src/lib/jukeboxStore";
import SearchPanel from "../../src/components/SearchPanel";

const mockItem = {
  id: "mock-item",
  title: "Neon Skyline",
  url: "https://example.com/preview",
  addedBy: null,
  createdAt: new Date().toISOString(),
  order: null,
};

describe("SearchPanel", () => {
  beforeEach(() => {
    useJukeboxStore.setState({
      user: "tester",
      queue: [],
      addItemRemote: jest.fn(async () => mockItem),
    });
  });

  it("shows mock results for a query", async () => {
    const user = userEvent.setup();
    render(<SearchPanel />);

    const input = screen.getByLabelText("search-input");
    await act(async () => {
      await user.type(input, "ne");
    });

    expect(await screen.findByText("Neon Skyline")).toBeInTheDocument();
  });

  it("calls addItemRemote when clicking Add", async () => {
    const user = userEvent.setup();
    render(<SearchPanel />);

    const input = screen.getByLabelText("search-input");
    await act(async () => {
      await user.type(input, "ne");
    });

    const addButtons = await screen.findAllByRole("button", { name: "Add" });
    await act(async () => {
      await user.click(addButtons[0]);
    });

    const { addItemRemote } = useJukeboxStore.getState();
    expect(addItemRemote).toHaveBeenCalledWith({
      title: "Neon Skyline",
      url: "https://example.com/preview/neon-skyline",
      addedBy: "tester",
    });
  });
});
