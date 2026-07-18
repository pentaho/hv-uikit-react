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
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HvButton } from "@hitachivantara/uikit-react-core";

import {
  HvFlow,
  HvFlowBackground,
  HvFlowBaseNode,
  HvFlowControls,
  HvFlowMinimap,
  HvFlowSidebar,
  type HvFlowBaseNodeProps,
  type HvFlowControlsProps,
  type HvFlowNodeGroups,
} from ".";

const nodeGroups: HvFlowNodeGroups = {
  asset: {
    label: "Assets",
    color: "cat3",
    description: "This is my description 1.",
    icon: <div />,
    items: [
      { nodeType: "boomArm", label: "Boom Arm" },
      { nodeType: "spaceMountain", label: "Space Mountain" },
    ],
  },
  digitalTwin: {
    label: "Digital Twin",
    color: "cat2",
    description: "This is my description 2.",
    icon: <div />,
    items: [{ nodeType: "toyStory", label: "Toy Story" }],
  },
};

const BoomArm = (props: HvFlowBaseNodeProps) => (
  <HvFlowBaseNode
    title="Asset"
    subtitle="Boom Arm"
    groupId="asset"
    color="cat3"
    {...props}
  />
);
const ToyStory = (props: HvFlowBaseNodeProps) => (
  <HvFlowBaseNode
    title="Digital Twin"
    subtitle="Toy Story"
    groupId="digitalTwin"
    color="cat2"
    {...props}
  />
);
const SpaceMountain = (props: HvFlowBaseNodeProps) => (
  <HvFlowBaseNode
    title="Asset"
    subtitle="Space Mountain"
    groupId="asset"
    color="cat3"
    {...props}
  />
);
const nodeTypes = {
  boomArm: BoomArm,
  toyStory: ToyStory,
  spaceMountain: SpaceMountain,
};
const nodes = [
  {
    id: "1",
    position: { x: 41, y: 70 },
    data: {},
    type: "boomArm",
  },
  {
    id: "2",
    position: { x: 535, y: 44 },
    data: {},
    type: "toyStory",
  },
];
const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
];

const Flow = ({
  controlsProps,
  opened,
  emptyCanvas,
}: {
  controlsProps?: HvFlowControlsProps;
  opened?: boolean;
  emptyCanvas?: boolean;
}) => {
  const [open, setOpen] = useState(!!opened);

  return (
    <div style={{ height: "500px" }}>
      <HvButton onClick={() => setOpen(true)}>Add Node</HvButton>
      <br />
      <HvFlow
        nodes={emptyCanvas ? undefined : nodes}
        edges={emptyCanvas ? undefined : edges}
        nodeTypes={nodeTypes}
        nodeGroups={nodeGroups}
        sidebar={
          <HvFlowSidebar
            title="Add Node"
            description="Please choose within the options below"
            open={open}
            onClose={() => setOpen(false)}
          />
        }
      >
        <HvFlowControls {...controlsProps} />
        <HvFlowMinimap />
        <HvFlowBackground />
      </HvFlow>
    </div>
  );
};

describe("Flow", () => {
  it("should render all four controls", () => {
    const { getByRole } = render(<Flow />);

    const zoomIn = getByRole("button", { name: /Zoom in/i });
    const zoomOut = getByRole("button", { name: /Zoom out/i });
    const fitView = getByRole("button", { name: /Fit view/i });
    const interactive = getByRole("button", { name: /Interactive/i });

    expect(zoomIn).toBeInTheDocument();
    expect(zoomOut).toBeInTheDocument();
    expect(fitView).toBeInTheDocument();
    expect(interactive).toBeInTheDocument();
  });

  it("should hide the zoom controls", () => {
    const { queryByRole } = render(<Flow controlsProps={{ hideZoom: true }} />);

    const zoomIn = queryByRole("button", { name: /Zoom in/i });
    const zoomOut = queryByRole("button", { name: /Zoom out/i });
    const fitView = queryByRole("button", { name: /Fit view/i });
    const interactive = queryByRole("button", { name: /Interactive/i });

    expect(zoomIn).not.toBeInTheDocument();
    expect(zoomOut).not.toBeInTheDocument();
    expect(fitView).toBeInTheDocument();
    expect(interactive).toBeInTheDocument();
  });

  it("should hide the fit view control", () => {
    const { queryByRole } = render(
      <Flow controlsProps={{ hideFitView: true }} />,
    );

    const zoomIn = queryByRole("button", { name: /Zoom in/i });
    const zoomOut = queryByRole("button", { name: /Zoom out/i });
    const fitView = queryByRole("button", { name: /Fit view/i });
    const interactive = queryByRole("button", { name: /Interactive/i });

    expect(zoomIn).toBeInTheDocument();
    expect(zoomOut).toBeInTheDocument();
    expect(fitView).not.toBeInTheDocument();
    expect(interactive).toBeInTheDocument();
  });

  it("should hide the interactive control", () => {
    const { queryByRole } = render(
      <Flow controlsProps={{ hideInteractive: true }} />,
    );

    const zoomIn = queryByRole("button", { name: /Zoom in/i });
    const zoomOut = queryByRole("button", { name: /Zoom out/i });
    const fitView = queryByRole("button", { name: /Fit view/i });
    const interactive = queryByRole("button", { name: /Interactive/i });

    expect(zoomIn).toBeInTheDocument();
    expect(zoomOut).toBeInTheDocument();
    expect(fitView).toBeInTheDocument();
    expect(interactive).not.toBeInTheDocument();
  });

  it("should render the minimap", () => {
    const { getByTestId } = render(<Flow />);

    expect(getByTestId("rf__minimap")).toBeInTheDocument();
  });

  it("should render the background", () => {
    const { getByTestId } = render(<Flow />);

    expect(getByTestId("rf__background")).toBeInTheDocument();
  });

  it("should render the initial two nodes", () => {
    const { getByTestId } = render(<Flow />);

    expect(getByTestId("rf__node-1")).toBeInTheDocument();
    expect(getByTestId("rf__node-2")).toBeInTheDocument();
  });

  it("should open the drawer by clicking on add node", async () => {
    const { queryByRole, getByRole } = render(<Flow />);

    const addBtn = getByRole("button", { name: /Add Node/i });
    const closeBtnBf = queryByRole("button", { name: /Close/i });

    expect(closeBtnBf).toBeNull();
    expect(addBtn).toBeInTheDocument();

    await userEvent.click(addBtn);

    expect(getByRole("button", { name: /Close/i })).toBeInTheDocument();
  });

  it("should have two groups in drawer", () => {
    const { getByRole, getAllByRole, queryByText } = render(
      <Flow opened emptyCanvas />,
    );

    const groups = getByRole("list");
    const buttons = getAllByRole("button", { name: /Expand group/i });
    const group1Description = queryByText("This is my description 1.");
    const group2Description = queryByText("This is my description 2.");
    const assetsTitle = queryByText("Assets (2)");
    const digitalTwinTitle = queryByText("Digital Twin");

    expect(groups).toBeInTheDocument();
    expect(groups.children.length).toBe(2);
    expect(buttons.length).toBe(2);
    expect(group1Description).toBeInTheDocument();
    expect(group2Description).toBeInTheDocument();
    expect(assetsTitle).toBeInTheDocument();
    expect(digitalTwinTitle).toBeInTheDocument();
  });

  it("should have (2) in assets group label", () => {
    const { queryByText } = render(<Flow opened emptyCanvas />);

    const assets = queryByText("Assets (2)");

    expect(assets).toBeInTheDocument();
  });

  it("should open group by clicking on expanded button", async () => {
    const { getAllByRole, queryByText } = render(<Flow opened emptyCanvas />);

    const buttons = getAllByRole("button", { name: /Expand group/i });
    const boomArmItemBf = queryByText("Boom Arm");
    const spaceMountainItemBf = queryByText("Space Mountain");
    const toyStoryItemBf = queryByText("Toy Story");

    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
    expect(boomArmItemBf).toBeNull();
    expect(spaceMountainItemBf).toBeNull();
    expect(toyStoryItemBf).toBeNull();

    await userEvent.click(buttons[0]);

    const boomArmItemAf = queryByText("Boom Arm");
    const spaceMountainItemAf = queryByText("Space Mountain");
    const toyStoryItemAf = queryByText("Toy Story");

    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
    expect(boomArmItemAf).toBeInTheDocument();
    expect(spaceMountainItemAf).toBeInTheDocument();
    expect(toyStoryItemAf).toBeNull();
  });

  it("should update the groups on search", async () => {
    const { getByRole, queryAllByRole, queryByText } = render(
      <Flow opened emptyCanvas />,
    );

    const search = getByRole("searchbox");
    const groupsBf = getByRole("list");
    const buttonsBf = queryAllByRole("button", { name: /Expand group/i });
    const group1TitleBf = queryByText("Assets (2)");
    const group2TitleBf = queryByText("Digital Twin");

    expect(search).toBeInTheDocument();
    expect(groupsBf.children.length).toBe(2);
    expect(buttonsBf.length).toBe(2);
    expect(buttonsBf[0]).toHaveAttribute("aria-expanded", "false");
    expect(buttonsBf[1]).toHaveAttribute("aria-expanded", "false");
    expect(group1TitleBf).toBeInTheDocument();
    expect(group2TitleBf).toBeInTheDocument();

    await userEvent.type(search, "arm");

    await waitFor(
      () => {
        const groupsAf = getByRole("list");
        const group1TitleAf = queryByText("Assets");
        const group2TitleAf = queryByText("Digital Twin");
        const buttonsAf = queryAllByRole("button", { name: /Expand group/i });

        expect(groupsAf.children.length).toBe(1);
        expect(buttonsAf.length).toBe(1);
        expect(buttonsAf[0]).toHaveAttribute("aria-expanded", "true");
        expect(group1TitleAf).toBeInTheDocument();
        expect(group2TitleAf).toBeNull();
      },
      { timeout: 2000 },
    );
  });
});
