import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DndContextProps,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ReactFlowProvider } from "reactflow";

import { HvDroppableFlow, type HvDroppableFlowProps } from "./DroppableFlow";
import { HvFlowProvider } from "./FlowContext";
import type { HvFlowNodeAction, HvFlowNodeGroups } from "./types";

export interface HvFlowProps<
  NodeGroups extends keyof any = string,
  NodeType extends string | undefined = string | undefined,
  NodeData = any,
> extends HvDroppableFlowProps<NodeType, NodeData> {
  /** Flow nodes groups. */
  nodeGroups?: HvFlowNodeGroups<NodeGroups>;
  /** Flow sidebar. */
  sidebar?: React.ReactNode;
  /** Flow default actions. */
  defaultActions?: HvFlowNodeAction[];
  /**
   * Dnd Kit context props. This should be used for accessibility purposes.
   *
   * More information can be found on the [Dnd Kit documentation](https://docs.dndkit.com/guides/accessibility)
   */
  dndContextProps?: Pick<DndContextProps, "accessibility">;
}

/**
 * Flow component to build interactive node-based UIs.
 *
 * This implementation leverages [React Flow](https://reactflow.dev).
 * The drag and drop functionality leverages [Dnd Kit](https://docs.dndkit.com)
 *
 * Take a look at the [usage page](https://lumada-design.github.io/uikit/master/?path=/docs/lab-flow-usage--docs) to learn more about this component.
 *
 * DISCLAIMER: This component is a work in progress and there might be breaking changes.
 */
export const HvFlow = ({
  nodeGroups,
  sidebar,
  defaultActions,
  dndContextProps,
  ...others
}: HvFlowProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  // We're wrapping the main Flow component with the ReactFlowProvider to access the react flow instance.
  // HvFlowContext is our custom internal context.
  return (
    <ReactFlowProvider>
      <HvFlowProvider nodeGroups={nodeGroups} defaultActions={defaultActions}>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToWindowEdges]}
          {...dndContextProps}
        >
          <HvDroppableFlow {...others} />
          {sidebar}
        </DndContext>
      </HvFlowProvider>
    </ReactFlowProvider>
  );
};
