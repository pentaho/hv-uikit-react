import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  HvVerticalNavigationTreeView,
  HvVerticalNavigationTreeViewItem,
  type HvVerticalNavigationTreeViewProps,
} from ".";

const Sample = (props: HvVerticalNavigationTreeViewProps) => (
  <HvVerticalNavigationTreeView {...props}>
    <HvVerticalNavigationTreeViewItem icon={<div />} nodeId="1" label="System">
      <HvVerticalNavigationTreeViewItem nodeId="2" label="SCPodF">
        <HvVerticalNavigationTreeViewItem nodeId="3" label="Compute" disabled />
        <HvVerticalNavigationTreeViewItem nodeId="4" label="Storage" />
        <HvVerticalNavigationTreeViewItem nodeId="5" label="Ethernet" />
        <HvVerticalNavigationTreeViewItem
          nodeId="6"
          label="Fiber Channel"
          payload={{ path: "/hello/world", params: { a: 2, b: "3" } }}
        />
      </HvVerticalNavigationTreeViewItem>
    </HvVerticalNavigationTreeViewItem>

    <HvVerticalNavigationTreeViewItem
      icon={<div />}
      nodeId="7"
      label="Administration"
    >
      <HvVerticalNavigationTreeViewItem nodeId="8" label="Rest API" />
      <HvVerticalNavigationTreeViewItem nodeId="9" label="License" />
      <HvVerticalNavigationTreeViewItem nodeId="10" label="Log Bundle" />
    </HvVerticalNavigationTreeViewItem>
  </HvVerticalNavigationTreeView>
);

describe("VerticalNavigation TreeView", () => {
  it("renders tree items", () => {
    render(<Sample selected="4" mode="navigation" />);
    expect(screen.getAllByRole("list")).toHaveLength(4);
    expect(screen.getAllByRole("listitem")).toHaveLength(10);
  });

  it("selects element from no initial selection", () => {
    render(<Sample defaultSelected={[]} mode="navigation" />);
    expect(screen.getAllByRole("list")).toHaveLength(4);
    expect(screen.getAllByRole("listitem")).toHaveLength(10);
  });
});
