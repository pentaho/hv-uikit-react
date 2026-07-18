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
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvProvider } from "../providers/Provider";
import { HvScrollToVertical } from "./ScrollToVertical";

const Sample = () => {
  const options = [
    { label: "Tab 1", value: "mainId1" },
    { label: "Tab 2", value: "mainId2" },
    { label: "Tab 3", value: "mainId3" },
    { label: "Tab 4", value: "mainId4" },
  ];

  return (
    <HvProvider>
      <HvScrollToVertical options={options} />
    </HvProvider>
  );
};

describe("ScrollToVertical", () => {
  it("should render the buttons", () => {
    render(<Sample />);

    expect(screen.getByLabelText("Tab 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Tab 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Tab 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Tab 4")).toBeInTheDocument();
  });

  it("should have the correct tab selected", async () => {
    render(<Sample />);

    const tabs = screen.getAllByRole("listitem");
    expect(tabs.length).toBe(4);
    expect(tabs[0]).toHaveAttribute("aria-current", "true");

    const tabButtons = screen.getAllByRole("link");
    expect(tabButtons.length).toBe(4);

    await userEvent.click(tabButtons[3]);

    expect(tabs[0]).toHaveAttribute("aria-current", "false");
    expect(tabs[3]).toHaveAttribute("aria-current", "true");
  });
});
