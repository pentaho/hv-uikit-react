import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvVerticalNavigationSlider } from "./NavigationSlider";

describe("NavigationSlider", () => {
  it("renders  items and identifies the current item", () => {
    render(
      <HvVerticalNavigationSlider
        aria-label="Navigation pages"
        selected="overview"
        data={[
          { id: "overview", label: "Overview" },
          { id: "settings", label: "Settings" },
        ]}
      />,
    );

    expect(
      screen.getByRole("list", { name: "Navigation pages" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("listitem", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      screen.getByRole("listitem", { name: "Settings" }),
    ).not.toHaveAttribute("aria-current");
  });
});
