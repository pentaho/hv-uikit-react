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
import {
  HvButton,
  HvGlobalActions,
  HvIconButton,
  theme,
  useTheme,
} from "@hitachivantara/uikit-react-core";
import {
  Add,
  Backwards,
  DataSource,
  LineChartAlt,
  Operation,
} from "@hitachivantara/uikit-react-icons";
import {
  HvFlow,
  HvFlowControls,
  HvFlowSidebar,
  type HvFlowProps,
} from "@hitachivantara/uikit-react-lab";

// The code for these values are available here: https://github.com/pentaho/hv-uikit-react/tree/master/packages/lab/src/components/Flow/stories/Base/index.tsx
import { restrictToSample } from "../Base";
// The code for these components are available here: https://github.com/pentaho/hv-uikit-react/tree/master/packages/lab/src/components/Flow/stories/Visualizations
import { BarChart } from "./BarChart";
import { data } from "./data";
import { Filter } from "./Filter";
import { JsonInput } from "./JsonInput";
import { LineChart } from "./LineChart";

// Note types
const nodeTypes = {
  jsonInput: JsonInput,
  filter: Filter,
  lineChart: LineChart,
  barChart: BarChart,
} satisfies HvFlowProps["nodeTypes"];

type NodeType = keyof typeof nodeTypes;

// Node groups
const nodeGroups = {
  inputs: {
    label: "Input",
    color: "cat3",
    description: "Find here all the available inputs.",
    icon: <DataSource />,
    items: [
      {
        nodeType: "jsonInput",
        label: "JSON Input",
        data: { jsonData: data },
      },
    ],
  },
  transformations: {
    label: "Transformation",
    color: "cat5",
    description: "Find here all the available transformations.",
    icon: <Operation />,
    items: [
      {
        nodeType: "filter",
        label: "Filter",
      },
    ],
  },
  visualizations: {
    label: "Visualization",
    color: "cat1",
    description: "Find here all the available visualizations.",
    icon: <LineChartAlt />,
    items: [
      { nodeType: "lineChart", label: "Line Chart" },
      { nodeType: "barChart", label: "Bar Chart" },
    ],
  },
} satisfies HvFlowProps["nodeGroups"];

export type NodeGroup = keyof typeof nodeGroups;

// Flow
const nodes = [
  {
    id: "jsonInput",
    type: "jsonInput",
    position: {
      x: 20,
      y: 500,
    },
    data: {
      jsonData: data,
      nodeLabel: "JSON Input",
    },
  },
  {
    id: "lineChart",
    type: "lineChart",
    position: { x: 380, y: 20 },
    data: { nodeLabel: "Line Chart" },
  },
  {
    id: "barChart",
    type: "barChart",
    position: { x: 980, y: 20 },
    data: { nodeLabel: "Bar Chart" },
  },
  {
    id: "filter",
    type: "filter",
    position: { x: 630, y: 600 },
    data: {
      jsonData: [],
      nodeLabel: "Filter",
    },
  },
  {
    id: "barChartFiltered",
    type: "barChart",
    position: { x: 980, y: 600 },
    data: { nodeLabel: "Bar Chart" },
  },
] satisfies HvFlowProps<NodeGroup, NodeType>["nodes"];

const edges = [
  {
    id: "jsonInput-lineChart",
    source: "jsonInput",
    sourceHandle: "0",
    target: "lineChart",
    targetHandle: "0",
  },
  {
    id: "jsonInput-barChart",
    source: "jsonInput",
    sourceHandle: "0",
    target: "barChart",
    targetHandle: "0",
  },
  {
    id: "jsonInput-filter",
    source: "jsonInput",
    sourceHandle: "0",
    target: "filter",
    targetHandle: "0",
  },
  {
    id: "filter-barChartFiltered",
    source: "filter",
    sourceHandle: "0",
    target: "barChartFiltered",
    targetHandle: "0",
  },
] satisfies HvFlowProps<NodeGroup, NodeType>["edges"];

// Classes
export const classes = {
  root: css({ height: "100vh" }),
  globalActions: css({ paddingBottom: theme.space.md }),
  flow: css({
    height: "calc(100% - 90px)",
  }),
};

export const Visualizations = () => {
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
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodeGroups={nodeGroups}
          defaultViewport={{
            zoom: 0.7,
            x: 0,
            y: 0,
          }}
          defaultEdgeOptions={{ animated: true }}
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
          <HvFlowControls />
        </HvFlow>
      </div>
    </div>
  );
};
