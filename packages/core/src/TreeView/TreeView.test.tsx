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
import { describe, expect, it, vi } from "vitest";

import { HvTreeItem, HvTreeView } from ".";

describe("HvTreeView", () => {
  it("renders the tree and items", () => {
    render(
      <HvTreeView aria-label="myTree">
        <HvTreeItem nodeId="1" label="item1" />
        <HvTreeItem nodeId="2" label="item2" />
        <HvTreeItem nodeId="3" label="item3" />
      </HvTreeView>,
    );

    expect(screen.getByRole("tree", { name: "myTree" })).toBeInTheDocument();
    expect(screen.getAllByRole("treeitem").length).toBe(3);

    expect(screen.getByRole("treeitem", { name: "item1" })).toBeInTheDocument();
    expect(screen.getByRole("treeitem", { name: "item2" })).toBeInTheDocument();
    expect(screen.getByRole("treeitem", { name: "item3" })).toBeInTheDocument();
  });

  it("expands tree items when defined", async () => {
    const mockClick = vi.fn();

    render(
      <HvTreeView defaultExpanded={["1"]}>
        <HvTreeItem nodeId="1" label="item1" onClick={mockClick}>
          <HvTreeItem nodeId="11" label="i11" />
          <HvTreeItem nodeId="22" label="i22" />
        </HvTreeItem>
        <HvTreeItem nodeId="1" label="item2" />
        <HvTreeItem nodeId="1" label="item3" />
      </HvTreeView>,
    );

    expect(screen.getAllByRole("treeitem").length).toBe(5);

    expect(screen.getByRole("treeitem", { name: "i11" })).toBeInTheDocument();
    expect(screen.getByRole("treeitem", { name: "i22" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("treeitem", { name: /item1/ }));

    expect(mockClick).toHaveBeenCalled();
  });
});
