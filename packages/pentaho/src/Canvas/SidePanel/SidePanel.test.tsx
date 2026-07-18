/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HvButton } from "@hitachivantara/uikit-react-core";

import { HvCanvasProvider } from "../CanvasContext";
import { HvCanvasSidePanel, type HvCanvasSidePanelProps } from "./SidePanel";

const label = "Test";

const tabs = [
  {
    id: "1",
    content: "Add Data",
  },
  {
    id: "2",
    content: "Model Structure",
  },
];

const renderSimplePanel = (props?: HvCanvasSidePanelProps) =>
  render(
    <HvCanvasProvider>
      <HvCanvasSidePanel {...props} tabs={tabs}>
        <HvButton>{label}</HvButton>
      </HvCanvasSidePanel>
    </HvCanvasProvider>,
  );

const ControlledPanel = ({
  onToggle,
  ...others
}: Partial<HvCanvasSidePanelProps>) => {
  const [opened, setOpened] = useState(false);
  return (
    <HvCanvasSidePanel
      open={opened}
      onToggle={(e, v) => {
        onToggle?.(e, v);
        setOpened(!opened);
      }}
      tabs={tabs}
      {...others}
    >
      <HvButton>{label}</HvButton>
    </HvCanvasSidePanel>
  );
};

const ControlledTabs = ({
  onTabChange,
  ...others
}: Partial<HvCanvasSidePanelProps>) => {
  const [tab, setTab] = useState(tabs[1].id);
  return (
    <HvCanvasSidePanel
      tab={tab}
      onTabChange={(e, v) => {
        onTabChange?.(e, v);
        setTab(v as string);
      }}
      tabs={tabs}
      defaultOpen
      {...others}
    >
      <HvButton>{label}</HvButton>
    </HvCanvasSidePanel>
  );
};

const expectSimplePanelClosed = () => {
  const openBtn = screen.getByRole("button", { name: "Open" });
  const content = screen.queryByRole("button", { name: label });
  const tabPanel = screen.queryByRole("tabpanel");
  const tabList = screen.queryByRole("tablist");
  expect(content).toBeNull();
  expect(tabPanel).toBeNull();
  expect(tabList).toBeNull();
  expect(openBtn).toBeInTheDocument();
};

const expectSimplePanelOpened = () => {
  const closeBtn = screen.getByRole("button", { name: "Close" });
  const content = screen.getByRole("button", { name: label });
  const tabPanel = screen.getByRole("tabpanel");
  const tabList = screen.getByRole("tablist");
  expect(content).not.toBeNull();
  expect(tabPanel).not.toBeNull();
  expect(tabPanel).toBeInTheDocument();
  expect(content).toBeInTheDocument();
  expect(tabList).toBeInTheDocument();
  expect(closeBtn).toBeInTheDocument();
};

const assertSelectedTab = (val: string) =>
  expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(val);

const assertNotSelectedTab = (val: string) =>
  expect(screen.getByRole("tab", { selected: false })).toHaveTextContent(val);

describe("CanvasSidePanel", () => {
  it("does not show tabs when not provided", () => {
    renderSimplePanel({ tabs: [] });
    const tabList = screen.queryByRole("tablist");
    expect(tabList).toBeNull();
  });

  it("shows and hides the content and triggers onToggle when toggled and defaultOpen is false", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onToggle: clickMock });
    expectSimplePanelClosed();

    const openBtn = screen.getByRole("button", { name: "Open" });
    await user.click(openBtn);
    expect(clickMock).toHaveBeenCalledOnce();
    expectSimplePanelOpened();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);
    expect(clickMock).toHaveBeenCalledTimes(2);
    expectSimplePanelClosed();
  });

  it("hides and shows the content and triggers onToggle when toggled and defaultOpen is true", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onToggle: clickMock, defaultOpen: true });
    expectSimplePanelOpened();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);
    expect(clickMock).toHaveBeenCalledOnce();
    expectSimplePanelClosed();

    const openBtn = screen.getByRole("button", { name: "Open" });
    await user.click(openBtn);
    expect(clickMock).toHaveBeenCalledTimes(2);
    expectSimplePanelOpened();
  });

  it("shows and hides the content and triggers onToggle when toggled and controlled", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(<ControlledPanel onToggle={clickMock} />);
    expectSimplePanelClosed();

    const openBtn = screen.getByRole("button", { name: "Open" });
    await user.click(openBtn);
    expect(clickMock).toHaveBeenCalledOnce();
    expectSimplePanelOpened();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);
    expect(clickMock).toHaveBeenCalledTimes(2);
    expectSimplePanelClosed();
  });

  it("shows and hides the content and triggers onToggle when toggled with keyboard", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(<ControlledPanel onToggle={clickMock} />);
    expectSimplePanelClosed();

    // Open
    await user.keyboard("{tab}");
    await user.keyboard("{enter}");
    expect(clickMock).toHaveBeenCalledOnce();
    expectSimplePanelOpened();

    // Close
    await user.keyboard("{enter}");
    expect(clickMock).toHaveBeenCalledTimes(2);
    expectSimplePanelClosed();
  });

  it("triggers onTabChange and changes selected tab when a tab is clicked", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onTabChange: clickMock, defaultOpen: true });

    const panelTabs = screen.getAllByRole("tab");
    expect(panelTabs).toHaveLength(tabs.length);
    assertSelectedTab(tabs[0].content);
    assertNotSelectedTab(tabs[1].content);

    await user.click(panelTabs[1]);
    expect(clickMock).toHaveBeenCalledOnce();
    assertNotSelectedTab(tabs[0].content);
    assertSelectedTab(tabs[1].content);
  });

  it("triggers onTabChange and changes selected tab when a tab is clicked with keyboard", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onTabChange: clickMock, defaultOpen: true });
    assertNotSelectedTab(tabs[1].content);
    assertSelectedTab(tabs[0].content);

    await user.keyboard("{tab}");
    await user.keyboard("{arrowright}");
    expect(clickMock).toHaveBeenCalledOnce();
    assertNotSelectedTab(tabs[0].content);
    assertSelectedTab(tabs[1].content);

    await user.keyboard("{arrowleft}");
    expect(clickMock).toHaveBeenCalledTimes(2);
    assertNotSelectedTab(tabs[1].content);
    assertSelectedTab(tabs[0].content);
  });

  it("doesn't trigger onTabChange and change selected tab when only using tab key to navigate", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    renderSimplePanel({ onTabChange: clickMock, defaultOpen: true });
    assertNotSelectedTab(tabs[1].content);
    assertSelectedTab(tabs[0].content);

    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    expect(clickMock).not.toHaveBeenCalled();
    assertNotSelectedTab(tabs[1].content);
    assertSelectedTab(tabs[0].content);
  });

  it("overrides labels", async () => {
    const user = userEvent.setup();
    const closeLabel = "Close1";
    const openLabel = "Open2";
    renderSimplePanel({ labels: { close: closeLabel, open: openLabel } });

    const openBtn = screen.getByRole("button", { name: openLabel });
    expect(openBtn).toBeInTheDocument();

    await user.click(openBtn);

    const closeBtn = screen.getByRole("button", { name: closeLabel });
    expect(closeBtn).toBeInTheDocument();
  });

  it("can control selected tab", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(<ControlledTabs onTabChange={clickMock} />);

    const panelTabs = screen.getAllByRole("tab");
    expect(panelTabs).toHaveLength(tabs.length);
    assertSelectedTab(tabs[1].content);
    assertNotSelectedTab(tabs[0].content);

    await user.click(panelTabs[0]);
    expect(clickMock).toHaveBeenCalledOnce();
    assertNotSelectedTab(tabs[1].content);
    assertSelectedTab(tabs[0].content);
  });
});
