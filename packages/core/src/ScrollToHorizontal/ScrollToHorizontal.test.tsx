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
import { HvScrollToHorizontal } from "./ScrollToHorizontal";

const Sample = () => (
  <HvProvider>
    <HvScrollToHorizontal
      options={[
        { label: "Server status summary", value: "mainId1" },
        { label: "Optimization", value: "mainId2" },
        { label: "Performance analysis", value: "mainId3" },
        { label: "Insights", value: "mainId4" },
      ]}
    />
  </HvProvider>
);

describe("ScrollToHorizontal", () => {
  it("renders the section links", () => {
    render(<Sample />);

    const tab1 = screen.getByRole("link", { name: "Server status summary" });
    expect(tab1).toBeInTheDocument();

    const tab2 = screen.getByRole("link", { name: "Optimization" });
    expect(tab2).toBeInTheDocument();

    const tab3 = screen.getByRole("link", { name: "Performance analysis" });
    expect(tab3).toBeInTheDocument();

    const tab4 = screen.getByRole("link", { name: "Insights" });
    expect(tab4).toBeInTheDocument();
  });

  it("switches to the correct selected tab", async () => {
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
