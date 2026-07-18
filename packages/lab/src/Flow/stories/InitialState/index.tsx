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
import { useCallback, useRef, useState } from "react";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { css } from "@emotion/css";
import {
  HvButton,
  HvDialog,
  HvDialogContent,
  HvDialogTitle,
  HvGlobalActions,
  HvIconButton,
  HvTypography,
  theme,
  useTheme,
} from "@hitachivantara/uikit-react-core";
import { Add, Backwards } from "@hitachivantara/uikit-react-icons";
import {
  HvFlow,
  HvFlowControls,
  HvFlowSidebar,
  type HvFlowInstance,
  type HvFlowProps,
} from "@hitachivantara/uikit-react-lab";

// The code for these values are available here: https://github.com/pentaho/hv-uikit-react/tree/master/packages/lab/src/components/Flow/stories/Base/index.tsx
import { nodeGroups, nodeTypes, restrictToSample } from "../Base";
import {
  LayoutsProvider,
  useLayoutsContext,
  type Layouts,
} from "../Base/LayoutsContext";

// Initial state
const initialState = {
  nodes: [
    {
      width: 250,
      height: 365,
      id: "1caf2381eaf",
      position: { x: 194, y: -160 },
      data: { asset: "option1", nodeLabel: "Custom Label" },
      type: "asset",
    },
    {
      width: 250,
      height: 274,
      id: "caf2381eaf3",
      position: { x: 637, y: -367 },
      data: { type: "prediction", nodeLabel: "ML Model Prediction" },
      type: "model",
    },
    {
      width: 250,
      height: 274,
      id: "af2381eaf37",
      position: { x: 643, y: 314 },
      data: { type: "detection", nodeLabel: "ML Model Detection" },
      type: "model",
    },
    {
      width: 250,
      height: 274,
      id: "f2381eaf379",
      position: { x: 1146, y: -444 },
      data: { nodeLabel: "KPI" },
      type: "kpi",
    },
    {
      width: 250,
      height: 274,
      id: "2381eaf3791",
      position: { x: 1144, y: -133 },
      data: { nodeLabel: "KPI" },
      type: "kpi",
    },
    {
      width: 250,
      height: 274,
      id: "381eaf37916",
      position: { x: 1142, y: 246 },
      data: { nodeLabel: "LineChart" },
      type: "lineChart",
    },
    {
      width: 250,
      height: 274,
      id: "81eaf379163",
      position: { x: 1146, y: 552 },
      data: { nodeLabel: "Table" },
      type: "table",
    },
    {
      width: 250,
      height: 479,
      id: "1eaf3791634",
      position: { x: 1716, y: -129 },
      data: {
        nodeLabel: "Dashboard",
        config: {
          items: [
            {
              id: "kpi1",
              type: "kpi",
              label: "KPI 1",
              predefined: true,
              connected: true,
            },
            {
              id: "kpi2",
              type: "kpi",
              label: "KPI 2",
              predefined: true,
              connected: true,
            },
            { id: "kpi3", type: "kpi", label: "KPI 3", predefined: true },
            {
              id: "lineChart1",
              type: "lineChart",
              label: "Line Chart 1",
              predefined: true,
              connected: true,
            },
            {
              id: "lineChart2",
              type: "lineChart",
              label: "Line Chart 2",
              predefined: true,
            },
            { id: "table1", type: "table", label: "Table 1", predefined: true },
            {
              id: "table2",
              type: "table",
              label: "Table 2",
              predefined: true,
              connected: true,
            },
          ],
          layout: [
            { w: 4, h: 1, x: 0, y: 0, i: "kpi1" },
            { w: 4, h: 1, x: 4, y: 0, i: "kpi2" },
            { w: 4, h: 1, x: 8, y: 0, i: "kpi3" },
            { w: 6, h: 2, x: 0, y: 1, i: "lineChart1" },
            { w: 6, h: 2, x: 6, y: 1, i: "lineChart2" },
            { w: 6, h: 2, x: 0, y: 3, i: "table1" },
            { w: 6, h: 2, x: 6, y: 3, i: "table2" },
          ],
          cols: 12,
        },
      },
      type: "dashboard",
    },
  ],
  edges: [
    {
      source: "1caf2381eaf",
      sourceHandle: "0",
      target: "caf2381eaf3",
      targetHandle: "0",
      id: "reactflow__edge-1caf2381eaf0-caf2381eaf30",
    },
    {
      source: "1caf2381eaf",
      sourceHandle: "1",
      target: "af2381eaf37",
      targetHandle: "0",
      id: "reactflow__edge-1caf2381eaf1-af2381eaf370",
    },
    {
      source: "caf2381eaf3",
      sourceHandle: "0",
      target: "f2381eaf379",
      targetHandle: "0",
      id: "reactflow__edge-caf2381eaf30-f2381eaf3790",
    },
    {
      source: "caf2381eaf3",
      sourceHandle: "0",
      target: "2381eaf3791",
      targetHandle: "0",
      id: "reactflow__edge-caf2381eaf30-2381eaf37910",
    },
    {
      source: "af2381eaf37",
      sourceHandle: "0",
      target: "381eaf37916",
      targetHandle: "0",
      id: "reactflow__edge-af2381eaf370-381eaf379160",
    },
    {
      source: "af2381eaf37",
      sourceHandle: "0",
      target: "81eaf379163",
      targetHandle: "0",
      id: "reactflow__edge-af2381eaf370-81eaf3791630",
    },
    {
      source: "2381eaf3791",
      sourceHandle: "0",
      target: "1eaf3791634",
      targetHandle: "kpi2",
      id: "reactflow__edge-2381eaf37910-1eaf3791634kpi2",
    },
    {
      source: "381eaf37916",
      sourceHandle: "0",
      target: "1eaf3791634",
      targetHandle: "lineChart1",
      id: "reactflow__edge-381eaf379160-1eaf3791634lineChart1",
    },
    {
      source: "81eaf379163",
      sourceHandle: "0",
      target: "1eaf3791634",
      targetHandle: "table2",
      id: "reactflow__edge-81eaf3791630-1eaf3791634table2",
    },
    {
      source: "f2381eaf379",
      sourceHandle: "0",
      target: "1eaf3791634",
      targetHandle: "kpi1",
      id: "reactflow__edge-f2381eaf3790-1eaf3791634kpi1",
    },
  ],
  viewport: { x: 150, y: 300, zoom: 0.6 },
};

// Classes
export const classes = {
  root: css({ height: "100vh" }),
  globalActions: css({ paddingBottom: theme.space.md }),
  flow: css({
    height: "calc(100% - 90px)",
  }),
};

const Flow = () => {
  const { rootId } = useTheme();

  const [instance, setInstance] = useState<HvFlowInstance>();
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [details, setDetails] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const firstRender = useRef(true);

  const { layouts } = useLayoutsContext();

  const handleSave = useCallback(() => {
    // Update dashboard nodes to add layout to dashboard nodes data
    instance?.setNodes((nodes) => {
      return nodes.map((n) => {
        if (layouts?.[n.id]) {
          return {
            ...n,
            data: {
              ...n.data,
              config: layouts[n.id],
            },
          };
        }
        return n;
      });
    });
    setDialogOpen(true);
  }, [instance, layouts]);

  const makeDirty: HvFlowProps["onFlowChange"] = (nds, eds) => {
    if (firstRender.current) return;
    setDirty(true);
    setDetails({ nodes: nds, edges: eds });
  };

  const onInit: HvFlowProps["onInit"] = (inst) => {
    setInstance(inst);
    firstRender.current = false;
  };

  return (
    <div className={classes.root}>
      <HvDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <HvDialogTitle>Flow Details</HvDialogTitle>
        <HvDialogContent>
          <HvTypography>{JSON.stringify(details)}</HvTypography>
        </HvDialogContent>
      </HvDialog>
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
        <HvButton
          variant="primarySubtle"
          disabled={!dirty}
          onClick={handleSave}
        >
          Save
        </HvButton>
      </HvGlobalActions>
      <div className={classes.flow}>
        <HvFlow
          nodes={initialState.nodes}
          edges={initialState.edges}
          nodeTypes={nodeTypes}
          nodeGroups={nodeGroups}
          defaultViewport={initialState.viewport}
          onFlowChange={makeDirty}
          onInit={onInit}
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

export const InitialState = () => {
  // Set up layouts
  const init = initialState.nodes.reduce<Layouts>((acc, cur) => {
    if (cur.type === "dashboard") {
      acc[cur.id] = cur.data.config;
    }
    return acc;
  }, {});

  return (
    <LayoutsProvider layouts={init}>
      <Flow />
    </LayoutsProvider>
  );
};
