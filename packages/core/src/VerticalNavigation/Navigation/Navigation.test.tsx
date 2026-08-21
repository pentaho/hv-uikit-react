import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvVerticalNavigationTree } from "./Navigation";

describe("VerticalNavigation - Navigation", () => {
  it("renders a labelled navigation landmark", () => {
    render(<HvVerticalNavigationTree aria-label="Example 1 navigation" />);

    expect(
      screen.getByRole("navigation", { name: "Example 1 navigation" }),
    ).toBeInTheDocument();
  });
});
