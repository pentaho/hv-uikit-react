import { useState } from "react";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { css } from "@emotion/css";
import {
  HvButton,
  HvGlobalActions,
  HvIconButton,
  HvTypography,
  theme,
  useTheme,
} from "@hitachivantara/uikit-react-core";
import { Add, Backwards, Fail } from "@hitachivantara/uikit-react-icons";
import {
  HvFlow,
  HvFlowControls,
  HvFlowEmpty,
  HvFlowSidebar,
  type HvFlowProps,
} from "@hitachivantara/uikit-react-lab";

// The code for these values are available here: https://github.com/pentaho/hv-uikit-react/tree/master/packages/lab/src/components/Flow/stories/Base/index.tsx
import {
  nodeGroups,
  nodeTypes,
  restrictToSample,
  type NodeType,
} from "../Base";
import { LayoutsProvider } from "../Base/LayoutsContext";

// Flow
const nodes: HvFlowProps<NodeType>["nodes"] = [];
const edges: HvFlowProps<NodeType>["edges"] = [];

// Classes
export const classes = {
  root: css({ height: "100vh" }),
  globalActions: css({ paddingBottom: theme.space.md }),
  flow: css({
    height: "calc(100% - 90px)",
  }),
};

export const Flow = () => {
  const { rootId } = useTheme();

  const [open, setOpen] = useState(false);

  const CustomAction = (
    <div className={css({ display: "flex", flexDirection: "row" })}>
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
  );

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
          // Keeping track of flow updates
          onFlowChange={(nds, eds) =>
            console.log("Flow updated: ", { nodes: nds, edges: eds })
          }
        >
          <HvFlowControls />
          <HvFlowEmpty
            title="Empty Flow"
            action={CustomAction}
            icon={<Fail />}
          />
        </HvFlow>
      </div>
    </div>
  );
};

export const Main = () => (
  <LayoutsProvider>
    <Flow />
  </LayoutsProvider>
);
