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
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { css } from "@emotion/css";
import type { NodeProps } from "reactflow";
import {
  HvButton,
  HvGlobalActions,
  HvIconButton,
  HvTypography,
  theme,
  useTheme,
} from "@hitachivantara/uikit-react-core";
import {
  Add,
  Backwards,
  Fail,
  Leaf,
  Teapot,
  Water,
} from "@hitachivantara/uikit-react-icons";
import {
  HvFlow,
  HvFlowBackground,
  HvFlowControls,
  HvFlowEmpty,
  HvFlowSidebar,
  type HvFlowProps,
} from "@hitachivantara/uikit-react-lab";

import { restrictToSample } from "../Base";
// The code for these utils are available here: https://github.com/pentaho/hv-uikit-react/tree/master/packages/lab/src/components/Flow/stories/BaseHook
import { CustomEdge } from "./IconEdge";
import { Node } from "./Node";

// Initial state
const initialState = {
  nodes: [
    {
      width: 250,
      height: 365,
      id: "1caf2381eaf",
      position: { x: 194, y: -160 },
      data: { nodeLabel: "Custom Label" },
      type: "leaves",
    },
    {
      width: 250,
      height: 274,
      id: "caf2381eaf3",
      position: { x: 637, y: -367 },
      data: { nodeLabel: "Custom Label" },
      type: "teapot",
    },
  ],
  edges: [
    {
      source: "1caf2381eaf",
      sourceHandle: "leaves",
      target: "caf2381eaf3",
      targetHandle: "teapot",
      id: "reactflow__edge-1caf2381eaf0-caf2381eaf30",
      type: "iconEdge",
    },
  ],
  viewport: { x: 100, y: 500, zoom: 1 },
};

const LeavesNode = (props: NodeProps) => (
  <Node
    groupId="leaves"
    output={{ id: "leaves", label: "outputs" }}
    {...props}
  />
);

const WaterNode = (props: NodeProps) => (
  <Node groupId="water" output={{ id: "water", label: "outputs" }} {...props} />
);

const TeapotNode = (props: NodeProps) => (
  <Node
    groupId="teapot"
    input={{ label: "inputs", id: "teapot" }}
    output={{ label: "outputs", id: "tea" }}
    {...props}
  />
);

const nodeGroups = {
  leaves: {
    label: "Tea Leaves",
    color: "cat3",
    icon: <Leaf />,
    items: [{ nodeType: "leaves", label: "Green Tea" }],
  },
  teapot: {
    label: "Teapot",
    color: "cat2",
    icon: <Teapot />,
    items: [{ nodeType: "teapot", label: "Teapot" }],
  },
  water: {
    label: "Water",
    color: "cat1",
    icon: <Water />,
    items: [{ nodeType: "water", label: "Water" }],
  },
} satisfies HvFlowProps["nodeGroups"];

const nodeTypes = {
  leaves: LeavesNode,
  teapot: TeapotNode,
  water: WaterNode,
} satisfies HvFlowProps["nodeTypes"];

const edgeTypes = { iconEdge: CustomEdge } satisfies HvFlowProps["edgeTypes"];

// Classes
export const classes = {
  root: css({ height: "100vh" }),
  globalActions: css({ paddingBottom: theme.space.md }),
  flow: css({
    height: "calc(100% - 90px)",
  }),
  customAction: css({ display: "flex", flexDirection: "row" }),
};

export const BaseHook = () => {
  const { rootId } = useTheme();

  const [open, setOpen] = useState(false);

  return (
    <div className={classes.root}>
      <HvGlobalActions
        className={classes.globalActions}
        position="relative"
        backButton={
          <HvIconButton title="Back">
            <Backwards />
          </HvIconButton>
        }
        title="New Flow"
      >
        <HvButton
          variant="primary"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Node
        </HvButton>
      </HvGlobalActions>
      <div className={classes.flow}>
        <HvFlow
          nodes={initialState.nodes}
          edges={initialState.edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          nodeGroups={nodeGroups}
          defaultViewport={initialState.viewport}
          sidebar={
            <HvFlowSidebar
              title="Add Node"
              description="Please choose within the options below"
              open={open}
              onClose={() => setOpen(false)}
              // Needed to fix storybook
              dragOverlayProps={{
                modifiers: [
                  restrictToWindowEdges,
                  (args) => restrictToSample(rootId || "", args),
                ],
              }}
            />
          }
        >
          <HvFlowBackground />
          <HvFlowControls />
          <HvFlowEmpty
            title="Empty Flow"
            action={
              <div className={classes.customAction}>
                <HvTypography
                  link
                  component="a"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  Add nodes
                </HvTypography>
                <HvTypography>&nbsp;to start building your flow.</HvTypography>
              </div>
            }
            icon={<Fail />}
          />
        </HvFlow>
      </div>
    </div>
  );
};
