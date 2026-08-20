import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvVerticalNavigationHeader } from "./Header";

const Sample = ({ onCollapse = vi.fn() }) => {
  return (
    <HvVerticalNavigationHeader
      title="Menu"
      openIcon={<div />}
      closeIcon={<div />}
      collapseButtonProps={{
        "aria-label": "collapseButton",
        "aria-expanded": true,
      }}
      onCollapseButtonClick={onCollapse}
    />
  );
};

describe("VerticalNavigation - Header", () => {
  it("renders the title and handles collapse requests", async () => {
    const onCollapse = vi.fn();
    render(<Sample onCollapse={onCollapse} />);

    expect(screen.getByText("Menu")).toBeInTheDocument();

    const collapseButton = screen.getByRole("button", {
      name: "collapseButton",
    });
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(collapseButton);
    expect(onCollapse).toHaveBeenCalledOnce();
  });
});
