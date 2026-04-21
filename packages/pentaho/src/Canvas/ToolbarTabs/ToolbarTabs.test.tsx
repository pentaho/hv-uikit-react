import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

import {
  HvCanvasToolbarTabs,
  type HvCanvasToolbarTabsProps,
} from "./ToolbarTabs";

const Sample = (props: Partial<HvCanvasToolbarTabsProps>) => (
  <HvCanvasToolbarTabs
    defaultTabs={[
      {
        id: "tab1",
        label: "Tab 1",
      },
      {
        id: "tab2",
        label: "Tab 2",
      },
      {
        id: "tab3",
        label: "Tab 3",
      },
    ]}
    {...props}
  />
);

describe("CanvasToolbarTabs", () => {
  it("triggers onTabChange and onChange when removing the selected tab", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    const onChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} onChange={onChangeMock} />);

    const closeBtn = screen
      .getAllByRole("tab")[0]
      .querySelector("[data-name=CloseXS]");
    await user.click(closeBtn!);
    expect(onTabChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onTabChange and onChange when removing the selected tab with keyboard", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    const onChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} onChange={onChangeMock} />);

    await user.keyboard("{tab}");
    await user.keyboard("{delete}");
    expect(onTabChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it("only triggers onChange when removing a non-selected tab", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    const onChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} onChange={onChangeMock} />);

    const closeBtn = screen
      .getAllByRole("tab")[1]
      .querySelector("[data-name=CloseXS]");
    await user.click(closeBtn!);
    expect(onTabChangeMock).not.toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onTabChange and onChange when adding a tab", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    const onChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} onChange={onChangeMock} />);

    const createBtn = screen.getByRole("button", {
      name: "Create new",
    });
    await user.click(createBtn);
    expect(onTabChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onTabChange and onChange when adding a tab with keyboard", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    const onChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} onChange={onChangeMock} />);
    const dropdownMenu = screen.getByRole("button", { name: "Dropdown menu" });
    expect(dropdownMenu).toBeInTheDocument();

    await user.keyboard("{tab}"); // first tab
    await user.keyboard("{tab}"); // dropdown menu
    await user.keyboard("{tab}"); // create button
    await user.keyboard("{enter}"); // add
    expect(onTabChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onChange when editing a tab", async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();
    render(<Sample onChange={onChangeMock} />);

    const labelEditor = screen.getByText("Tab 1");
    await user.click(labelEditor);
    const newLabel = "My new label";
    await user.type(labelEditor, newLabel);

    const selectedTab = screen.getByRole("tab", { selected: true });
    expect(selectedTab).toHaveTextContent(newLabel);
    expect(onChangeMock).toHaveBeenCalledTimes(newLabel.length);
  });

  it("triggers onTabChange when changing tab", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} />);

    // Change selected tab
    const secondTab = screen.getByRole("tab", {
      name: "Tab 2",
    });
    await user.click(secondTab);
    expect(onTabChangeMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onTabChange when changing tab with keyboard", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} />);

    // Change selected tab
    await user.keyboard("{tab}");
    await user.keyboard("{arrowright}");
    expect(onTabChangeMock).toHaveBeenCalledTimes(1);
  });

  it("doesn't trigger onTabChange when only using the tab key to navigate", async () => {
    const user = userEvent.setup();
    const onTabChangeMock = vi.fn();
    render(<Sample onTabChange={onTabChangeMock} />);

    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    expect(onTabChangeMock).not.toHaveBeenCalled();
  });

  it("shows 'Create new' button by default", () => {
    render(<Sample />);
    const createButton = screen.getByRole("button", { name: "Create new" });
    expect(createButton).toBeInTheDocument();
  });

  it("doesn't show 'Create new' button when hideCreateNew is true", () => {
    render(<Sample hideCreateNew />);
    const createButton = screen.queryByRole("button", { name: "Create new" });
    expect(createButton).not.toBeInTheDocument();
  });
});
