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

import { HvCanvasPanelTab } from "../PanelTab/PanelTab";
import { HvCanvasPanelTabs, type HvCanvasPanelTabsProps } from "./PanelTabs";

const Controlled = ({
  onChange,
  ...others
}: Partial<HvCanvasPanelTabsProps>) => {
  const [selected, setSelected] = useState(2);

  return (
    <HvCanvasPanelTabs
      value={selected}
      onChange={(e, v) => {
        onChange?.(e, v);
        setSelected(v as number);
      }}
      {...others}
    >
      <HvCanvasPanelTab value={0}>Tab 1</HvCanvasPanelTab>
      <HvCanvasPanelTab value={1}>Tab 2</HvCanvasPanelTab>
      <HvCanvasPanelTab value={2}>Tab 3</HvCanvasPanelTab>
    </HvCanvasPanelTabs>
  );
};

const assertSelectedTab = (val: string) =>
  expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(val);

const assertUnselectedTabCount = (val: number) =>
  expect(screen.getAllByRole("tab", { selected: false })).toHaveLength(val);

describe("CanvasTabs", () => {
  it("renders tabs", () => {
    render(
      <HvCanvasPanelTabs>
        <HvCanvasPanelTab value={0}>Tab 1</HvCanvasPanelTab>
        <HvCanvasPanelTab value={1}>Tab 2</HvCanvasPanelTab>
        <HvCanvasPanelTab value={2}>Tab 3</HvCanvasPanelTab>
      </HvCanvasPanelTabs>,
    );
    const tabList = screen.getByRole("tablist");
    const allTabs = screen.getAllByRole("tab");
    expect(tabList).toBeInTheDocument();
    expect(allTabs).toHaveLength(3);
    expect(allTabs.map((tab) => tab.innerHTML)).toEqual([
      "Tab 1",
      "Tab 2",
      "Tab 3",
    ]);
  });

  it("selects new tab and calls onChange when uncontrolled", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(
      <HvCanvasPanelTabs defaultValue={0} onChange={clickMock}>
        <HvCanvasPanelTab value={0}>Tab 1</HvCanvasPanelTab>
        <HvCanvasPanelTab value={1}>Tab 2</HvCanvasPanelTab>
        <HvCanvasPanelTab value={2}>Tab 3</HvCanvasPanelTab>
      </HvCanvasPanelTabs>,
    );
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(2);

    const allTabs = screen.getAllByRole("tab");
    await user.click(allTabs[2]);
    expect(clickMock).toHaveBeenCalledOnce();
    assertSelectedTab("Tab 3");
    assertUnselectedTabCount(2);
  });

  it("selects new tab and calls onChange when controlled", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(<Controlled onChange={clickMock} />);
    assertSelectedTab("Tab 3");
    assertUnselectedTabCount(2);

    const allTabs = screen.getAllByRole("tab");
    await user.click(allTabs[0]);
    expect(clickMock).toHaveBeenCalledOnce();
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(2);
  });

  // Tab to focus and arrow to navigate
  it("selects new tab and calls onChange when using the keyboard", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(
      <HvCanvasPanelTabs defaultValue={0} onChange={clickMock}>
        <HvCanvasPanelTab value={0}>Tab 1</HvCanvasPanelTab>
        <HvCanvasPanelTab value={1}>Tab 2</HvCanvasPanelTab>
        <HvCanvasPanelTab value={2}>Tab 3</HvCanvasPanelTab>
      </HvCanvasPanelTabs>,
    );
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(2);

    // Select "Tab 2"
    await user.keyboard("{tab}");
    await user.keyboard("{arrowright}");
    expect(clickMock).toHaveBeenCalledOnce();
    assertSelectedTab("Tab 2");
    assertUnselectedTabCount(2);

    // Select "Tab 3"
    await user.keyboard("{arrowright}");
    expect(clickMock).toHaveBeenCalledTimes(2);
    assertSelectedTab("Tab 3");
    assertUnselectedTabCount(2);

    // Select "Tab 2" again
    await user.keyboard("{arrowleft}");
    expect(clickMock).toHaveBeenCalledTimes(3);
    assertSelectedTab("Tab 2");
    assertUnselectedTabCount(2);
  });

  it("doesn't select new tab and call onChange when using only tab key to navigate", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(
      <HvCanvasPanelTabs defaultValue={0} onChange={clickMock}>
        <HvCanvasPanelTab value={0}>Tab 1</HvCanvasPanelTab>
        <HvCanvasPanelTab value={1}>Tab 2</HvCanvasPanelTab>
        <HvCanvasPanelTab value={2}>Tab 3</HvCanvasPanelTab>
      </HvCanvasPanelTabs>,
    );
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(2);

    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    expect(clickMock).not.toHaveBeenCalled();
    assertSelectedTab("Tab 1");
    assertUnselectedTabCount(2);
  });
});
