import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

import { HvCanvasBottomPanel, HvCanvasBottomPanelProps } from "./BottomPanel";

const panelTabs = [
  { id: 0, title: "Tab 1" },
  { id: 1, title: "Tab 2" },
];

const renderSimplePanel = (props?: Partial<HvCanvasBottomPanelProps>) =>
  render(
    <HvCanvasBottomPanel
      open
      tabs={panelTabs}
      rightActions={[{ id: "action", label: "Action", icon: <div /> }]}
      {...props}
    >
      Content
    </HvCanvasBottomPanel>,
  );

const assertSelectedTab = (val: string) =>
  expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(val);

const assertUnselectedTabCount = (val: number) =>
  expect(screen.getAllByRole("tab", { selected: false })).toHaveLength(val);

describe("CanvasBottomPanel", () => {
  it("triggers onTabChange when changing the selected tab", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onTabChange: clickMock });
    const tabs = screen.getAllByRole("tab");
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(1);

    await user.click(tabs[1]);
    assertSelectedTab("Tab 2");
    assertUnselectedTabCount(1);
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onTabChange when changing the selected tab with the keyboard", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onTabChange: clickMock });
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(1);

    await user.keyboard("{tab}");
    await user.keyboard("{arrowright}");
    assertSelectedTab("Tab 2");
    assertUnselectedTabCount(1);
    expect(clickMock).toHaveBeenCalledTimes(1);

    await user.keyboard("{arrowleft}");
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(1);
    expect(clickMock).toHaveBeenCalledTimes(2);
  });

  it("doesn't trigger onTabChange when only using the tab key to navigate", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onTabChange: clickMock });
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(1);

    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(1);
  });

  it("triggers onAction when an action is clicked", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onAction: clickMock });

    const actions = screen.getAllByRole("button", { name: "Action" });
    await user.click(actions[0]);
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onAction when an action is clicked with keyboard", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onAction: clickMock });

    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{enter}");
    expect(clickMock).toHaveBeenCalledTimes(1);
  });
});
