import { useCallback, useRef, useState } from "react";
import { useDndMonitor, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { Global } from "@emotion/react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowProps,
} from "reactflow";
import { uid } from "uid";
import {
  useUniqueId,
  type ExtractNames,
} from "@hitachivantara/uikit-react-core";

import { flowStyles } from "./base";
import { staticClasses, useClasses } from "./Flow.styles";
import { useNodeMetaRegistry } from "./FlowContext/NodeMetaContext";
import { useFlowInstance } from "./hooks";
import type {
  HvFlowNodeInputGroup,
  HvFlowNodeMetaRegistry,
  HvFlowNodeOutputGroup,
  HvFlowNodeTypes,
} from "./types";

export { staticClasses as flowClasses };

export type HvFlowClasses = ExtractNames<typeof useClasses>;

export interface HvDroppableFlowProps<
  NodeType extends string | undefined = string | undefined,
  NodeData = any,
> extends Omit<ReactFlowProps, "nodes" | "edges" | "nodeTypes"> {
  /** Flow content: background, controls, and minimap. */
  children?: React.ReactNode;
  /** Flow nodes types. */
  nodeTypes?: HvFlowNodeTypes<NodeData>;
  /** Flow nodes. */
  nodes?: Node<NodeData, NodeType>[];
  /** Flow edges. */
  edges?: Edge[];
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFlowClasses;
  /** Callback called when the flow changes. Returns the updated nodes and edges. */
  onFlowChange?: (nodes: Node<NodeData, NodeType>[], edges: Edge[]) => void;
  /**
   * Callback called when a node is dropped in the flow.
   *
   * This callback should be used to override the custom UI Kit drop event.
   * Thus, when defined, the user is responsible for adding nodes to the flow.
   *
   * This callback is called when `HvFlowSidebar` is used or a custom sidebar was created using Dnd Kit.
   * When a custom sidebar was created using the native HTML drag and drop API, refer to the `onDrop` callback.
   *
   * Returns the event and the node to be added to the flow.
   */
  onDndDrop?: (event: DragEndEvent, node: Node) => void;
}

export const getNode = (nodes: Node[], nodeId: string) => {
  return nodes.find((n) => n.id === nodeId);
};

const validateEdge = (
  nodes: Node[],
  edges: Edge[],
  connection: Connection,
  nodeMetaRegistry: HvFlowNodeMetaRegistry,
) => {
  const {
    source: sourceId,
    sourceHandle,
    target: targetId,
    targetHandle,
  } = connection;

  if (!sourceHandle || !targetHandle || !sourceId || !targetId) return false;

  const sourceNode = getNode(nodes, sourceId);
  const targetNode = getNode(nodes, targetId);

  if (!sourceNode || !targetNode) return false;

  const sourceType = sourceNode.type;
  const targetType = targetNode.type;

  if (!sourceType || !targetType) return false;

  const inputs = nodeMetaRegistry[targetId]?.inputs || [];
  const outputs = nodeMetaRegistry[sourceId]?.outputs || [];

  const source = outputs
    .flatMap((out) => (out as HvFlowNodeOutputGroup).outputs || out)
    .find((out) => out.id === sourceHandle);
  const target = inputs
    .flatMap((inp) => (inp as HvFlowNodeInputGroup).inputs || inp)
    .find((inp) => inp.id === targetHandle);

  const sourceProvides = source?.provides || "";
  const targetAccepts = target?.accepts || [];
  const sourceMaxConnections = source?.maxConnections;
  const targetMaxConnections = target?.maxConnections;

  let isValid =
    targetAccepts.length === 0 || targetAccepts.includes(sourceProvides);

  if (isValid && targetMaxConnections != null) {
    const targetConnections = edges.filter(
      (edg) => edg.target === targetId && edg.targetHandle === targetHandle,
    ).length;

    isValid = targetConnections < targetMaxConnections;
  }

  if (isValid && sourceMaxConnections != null) {
    const sourceConnections = edges.filter(
      (edg) => edg.source === sourceId && edg.sourceHandle === sourceHandle,
    ).length;

    isValid = sourceConnections < sourceMaxConnections;
  }

  return isValid;
};

export const HvDroppableFlow = ({
  id,
  className,
  children,
  onFlowChange,
  onDndDrop,
  classes: classesProp,
  nodes: initialNodes = [],
  edges: initialEdges = [],
  onConnect: onConnectProp,
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
  defaultEdgeOptions: defaultEdgeOptionsProp,
  nodeTypes,
  ...others
}: HvDroppableFlowProps) => {
  const { classes, cx } = useClasses(classesProp);

  const elementId = useUniqueId(id);

  const reactFlowInstance = useFlowInstance();

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  // Keeping track of nodes and edges for onFlowChange since useState is async
  const nodesRef = useRef(initialNodes);
  const edgesRef = useRef(initialEdges);

  const updateNodes = (nds: Node[]) => {
    setNodes(nds);
    nodesRef.current = nds;
  };

  const updateEdges = (eds: Edge[]) => {
    setEdges(eds);
    edgesRef.current = eds;
  };

  const { setNodeRef } = useDroppable({
    id: elementId,
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.over?.id !== elementId) return;

      const hvFlow = event.active.data.current?.hvFlow;
      const type = hvFlow?.type;

      // Only known node types can be dropped in the canvas
      if (!type || !nodeTypes?.[type]) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error(
            `Could not add node to the flow because of unknown type ${type}. Use nodeTypes to define all the node types.`,
          );
        }
        return;
      }

      // Position node in the flow
      const position = reactFlowInstance.screenToFlowPosition({
        x: hvFlow?.x || 0,
        y: hvFlow?.y || 0,
      });

      // Node data
      const data = {
        nodeLabel: hvFlow?.label,
        ...hvFlow?.data,
      };

      // Node to add
      const newNode: Node = {
        id: uid(),
        position,
        data,
        type,
      };

      // Drop override
      if (onDndDrop) {
        onDndDrop(event, newNode);
        return;
      }

      updateNodes(nodes.concat(newNode));
    },
    [elementId, nodeTypes, nodes, onDndDrop, reactFlowInstance],
  );

  useDndMonitor({
    onDragEnd: handleDragEnd,
  });

  const handleFlowChange = useCallback(
    (nds: Node[], eds: Edge[]) => {
      // The new flow is returned if the user is not dragging nodes
      // This avoids triggering this handler too many times
      const isDragging = nds.find((node) => node.dragging);
      if (!isDragging) {
        onFlowChange?.(nds, eds);
      }
    },
    [onFlowChange],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const eds = addEdge(connection, edgesRef.current);
      updateEdges(eds);

      handleFlowChange(nodesRef.current, eds);
      onConnectProp?.(connection);
    },
    [handleFlowChange, onConnectProp],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const nds = applyNodeChanges(changes, nodesRef.current);
      updateNodes(nds);

      handleFlowChange(nds, edgesRef.current);
      onNodesChangeProp?.(changes);
    },
    [handleFlowChange, onNodesChangeProp],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const eds = applyEdgeChanges(changes, edgesRef.current);
      updateEdges(eds);

      handleFlowChange(nodesRef.current, eds);
      onEdgesChangeProp?.(changes);
    },
    [handleFlowChange, onEdgesChangeProp],
  );

  const { registry } = useNodeMetaRegistry();

  const isValidConnection: ReactFlowProps["isValidConnection"] = (connection) =>
    validateEdge(nodes, edges, connection, registry);

  const defaultEdgeOptions = {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 20,
      width: 20,
    },
    type: "smoothstep",
    pathOptions: {
      borderRadius: 40,
    },
    ...defaultEdgeOptionsProp,
  };

  return (
    <>
      <Global styles={flowStyles} />
      <div
        id={elementId}
        ref={setNodeRef}
        className={cx(classes.root, className)}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          isValidConnection={isValidConnection}
          defaultEdgeOptions={defaultEdgeOptions}
          snapGrid={[1, 1]}
          snapToGrid
          onError={(code, message) => {
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.error(message);
            }
          }}
          {...others}
        >
          {children}
        </ReactFlow>
      </div>
    </>
  );
};
