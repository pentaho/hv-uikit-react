import { useRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  HvDropdownPanel,
  type HvDropdownPanelProps,
} from "./BaseDropdownPanel";

const PanelStatic = ({
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

const PanelDynamic = ({ ...props }: Partial<HvDropdownPanelProps>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const open = Boolean(anchorEl);

  return (
    <>
      <button
        type="button"
        onClick={(evt) => setAnchorEl(anchorEl ? undefined : evt.currentTarget)}
      >
        Anchor
      </button>
      <HvDropdownPanel
        open={open}
        anchorEl={anchorEl}
        onClickAway={vi.fn()}
        disablePortal
        {...props}
      />
    </>
  );
};

describe("HvDropdownPanel", () => {
  it("renders children when open", () => {
    render(<PanelStatic>Content</PanelStatic>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render children when closed", () => {
    render(<PanelStatic open={false}>Content</PanelStatic>);

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("applies containerId as id on the panel element", () => {
    render(<PanelStatic containerId="my-panel-id">Content</PanelStatic>);

    expect(document.getElementById("my-panel-id")).toBeInTheDocument();
  });

  it("calls onToggle when Escape is pressed inside the panel", async () => {
    const onToggle = vi.fn();
    const onFirstUpdate = vi.fn();

    render(
      <PanelDynamic onToggle={onToggle} onFirstUpdate={onFirstUpdate}>
        <button type="button" autoFocus />
      </PanelDynamic>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Anchor" }));
    expect(onToggle).toHaveBeenCalledTimes(0);

    await userEvent.keyboard("{Escape}");

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onFirstUpdate).toHaveBeenCalledTimes(1);
  });
});
