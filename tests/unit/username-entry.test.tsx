import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useJukeboxStore from "../../src/lib/jukeboxStore";
import UsernameEntry from "../../src/components/UsernameEntry";

describe("UsernameEntry", () => {
  beforeEach(() => {
    useJukeboxStore.setState({ user: undefined });
  });

  it("sets the username when saved", async () => {
    const user = userEvent.setup();
    render(<UsernameEntry />);

    const input = screen.getByLabelText("username");
    await act(async () => {
      await user.type(input, "JukeboxUser");
    });
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Save" }));
    });

    expect(useJukeboxStore.getState().user).toBe("JukeboxUser");
  });

  it("renders nothing when user is already set", () => {
    useJukeboxStore.setState({ user: "AlreadyHere" });
    const { container } = render(<UsernameEntry />);
    expect(container).toBeEmptyDOMElement();
  });
});
