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
  Column,
  Cube,
  DataFlow,
  Fail,
  Leaf,
  Table,
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
import type { HierarchyData } from "./Level";
import { Node } from "./Node";
import { NodeGroup } from "./NodeGroup";

// Initial state
const initialState = {
  nodes: [
    {
      width: 500,
      height: 300,
      id: "testGroup",
      position: { x: 0, y: 0 },
      positionAbsolute: { x: 0, y: 0 },
      data: {},
      type: "group",
    },
    {
      width: 250,
      height: 365,
      id: "1caf2381eaf",
      position: { x: 0, y: 360 },
      data: {},
      type: "dimensionTable",
    },
    {
      width: 250,
      height: 274,
      id: "caf2381eaf3",
      position: { x: 637, y: 0 },
      data: {},
      type: "factTable",
    },
  ],
  viewport: { x: 50, y: 50, zoom: 1 },
};

const dimensionTableDataObject: HierarchyData[] = [
  {
    id: "Markets_Hierarchy",
    label: "Markets Hierarchy",
    icon: <DataFlow />,
    type: "level",
    children: [
      {
        id: "country",
        label: "Country",
        icon: <DataFlow />,
        type: "level",
        actions: [],
      },
      {
        id: "State Province",
        label: "State Province",
        icon: <DataFlow />,
        type: "level",
        actions: [],
      },
      {
        id: "CustomerWith",
        label: "CustomWith",
        type: "table",
        children: [
          {
            id: "CustomerNumber1",
            label: "CustomerNumber",
            icon: <Column />,
            type: "level",
            actions: [],
          },
        ],
      },
    ],
    actions: [],
  },
  {
    id: "Class_Type_Hierarchy",
    label: "Class Type Hierarchy",
    icon: <DataFlow />,
    type: "level",
    children: [
      {
        id: "Class",
        label: "Class",
        icon: <DataFlow />,
        type: "level",
      },
    ],
  },
];

const factTableDataObject: HierarchyData[] = [
  {
    id: "Order Fact",
    label: "Order Fact",
    icon: <Table />,
    type: "table",
    children: [
      {
        id: "ProductCode",
        label: "ProductCode",
        icon: <Column />,
        type: "level",
        actions: [],
      },
      {
        id: "CustomerNumber2",
        label: "CustomerNumber",
        icon: <Column />,
        type: "level",
        actions: [],
      },
      {
        id: "OrderDate",
        label: "OrderDate",
        icon: <Column />,
        type: "level",
        actions: [],
      },
      {
        id: "TimeID",
        label: "TimeID",
        icon: <Column />,
        type: "level",
        actions: [],
      },
    ],
  },
];

const DimTableNode = (props: NodeProps) => (
  <Node
    groupId="dimensionTable"
    hierarchyData={dimensionTableDataObject}
    {...props}
  />
);

const FactTableNode = (props: NodeProps) => (
  <Node groupId="factTable" hierarchyData={factTableDataObject} {...props} />
);

const CubeNodeGroup = (props: NodeProps) => (
  <NodeGroup {...props} groupId="groupNode" />
);

const nodeGroups = {
  dimensionTable: {
    label: "Dimension Table",
    color: "cat3",
    icon: <Leaf />,
    items: [{ nodeType: "dimensionTable", label: "Dimension Table" }],
  },
  factTable: {
    label: "Fact Table",
    color: "cat2",
    icon: <Table />,
    items: [{ nodeType: "factTable", label: "Fact Table" }],
  },
  groupNode: {
    label: "Group Node",
    color: "primaryDimmed",
    icon: <Cube />,
    items: [{ nodeType: "group", label: "Group Node" }],
  },
} satisfies HvFlowProps["nodeGroups"];

const nodeTypes = {
  dimensionTable: DimTableNode,
  factTable: FactTableNode,
  group: CubeNodeGroup,
} satisfies HvFlowProps["nodeTypes"];

// Classes
export const classes = {
  root: css({ height: "100vh" }),
  globalActions: css({ paddingBottom: theme.space.md }),
  flow: css({
    height: "calc(100% - 90px)",
  }),
  customAction: css({ display: "flex", flexDirection: "row" }),
};

export const SubFlow = () => {
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
