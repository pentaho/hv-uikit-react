import { act, render, screen } from "@testing-library/react";

import AppShell from "./AppShell";

describe("AppShell component", () => {
  it("should include a Header when a minimum configuration is provided", async () => {
    await act(async () => render(<AppShell config={{}} />));
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
