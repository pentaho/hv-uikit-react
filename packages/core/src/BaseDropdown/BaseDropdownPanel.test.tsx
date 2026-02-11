import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  HvDropdownPanel,
  type HvDropdownPanelProps,
} from "./BaseDropdownPanel";

const PanelFixture = ({
  open = true,
  ...props
}: Partial<HvDropdownPanelProps>) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={anchorRef} type="button">
        Anchor
      </button>
      <HvDropdownPanel
        open={open}
        anchorEl={anchorRef.current}
        onClickAway={vi.fn()}
        disablePortal
        {...props}
      />
    </>
  );
};

describe("HvDropdownPanel", () => {
  it("renders children when open", () => {
    render(<PanelFixture>Content</PanelFixture>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render children when closed", () => {
    render(<PanelFixture open={false}>Content</PanelFixture>);

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("applies containerId as id on the panel element", () => {
    render(<PanelFixture containerId="my-panel-id">Content</PanelFixture>);

    expect(document.getElementById("my-panel-id")).toBeInTheDocument();
  });

  it("calls onToggle when Escape is pressed inside the panel", async () => {
    const onToggle = vi.fn();
    render(
      <PanelFixture onToggle={onToggle}>
        <button type="button" autoFocus />
      </PanelFixture>,
    );

    await userEvent.keyboard("{Escape}");

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
