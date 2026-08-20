import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvGrid } from "./Grid";

describe("Grid", () => {
  it("should be defined", () => {
    const { container } = render(<HvGrid />);
    expect(container).toBeDefined();
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
