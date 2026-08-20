import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvGrid } from "./Grid";

describe("Grid", () => {
  it("renders its content and forwards native element props", () => {
    render(
      <HvGrid component="section" aria-label="Results">
        Grid content
      </HvGrid>,
    );

    expect(screen.getByRole("region", { name: "Results" })).toHaveTextContent(
      "Grid content",
    );
  });

  it("should render a container with explicit size items", () => {
    const { container } = render(
      <HvGrid container data-testid="container">
        <HvGrid size={{ xs: 12, md: 6 }} data-testid="item" />
      </HvGrid>,
    );

    expect(container.firstChild).toBeTruthy();
  });
});
