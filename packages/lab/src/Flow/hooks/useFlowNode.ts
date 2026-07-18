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
import { useCallback, useMemo } from "react";
import {
  useEdges,
  useNodes,
  useStore,
  type CoordinateExtent,
  type Edge,
  type Node,
  type ReactFlowState,
  type XYPosition,
} from "reactflow";
import { shallow } from "zustand/shallow";

import { useFlowInstance } from "./useFlowInstance";
import { useNodeId } from "./useNodeId";

/** Uses coordinates to create the relative position vector */
function relativePosition(positionA?: XYPosition, positionB?: XYPosition) {
  if (positionA && positionB)
    return {
      x: positionB.x - positionA.x,
      y: positionB.y - positionA.y,
    };
  return { x: 0, y: 0 };
}

/** Retrieves the node instance */
export function useFlowNode<T extends Node = Node>(id?: string) {
  const nodeId = useNodeId(id);

  const nodeSelector = useCallback(
    (state: ReactFlowState) =>
      state.getNodes().find((n: Node): n is T => n.id === nodeId),
    [nodeId],
  );
  return useStore<T | undefined>(nodeSelector, shallow);
}

/** Provides the input edges connected to the node */
export function useFlowNodeInputEdges(id?: string) {
  const nodeId = useNodeId(id);

  const inputEdgesSelector = useCallback(
    (state: ReactFlowState) =>
      state.edges.filter((e: Edge) => e.target === nodeId),
    [nodeId],
  );
  return useStore(inputEdgesSelector, shallow);
}

/** Gives the output edges connected from the node */
export function useFlowNodeOutputEdges(id?: string) {
  const nodeId = useNodeId(id);

  const outputEdgesSelector = useCallback(
    (state: ReactFlowState) =>
      state.edges.filter((e: Edge) => e.source === nodeId),
    [nodeId],
  );
  return useStore(outputEdgesSelector, shallow);
}

/** Offers both input and output edges of the node */
export function useFlowNodeEdges(id?: string) {
  const nodeId = useNodeId(id);

  const edgesSelector = useCallback(
    (state: ReactFlowState) =>
      state.edges.filter(
        (e: Edge) => e.source === nodeId || e.target === nodeId,
      ),
    [nodeId],
  );
  return useStore(edgesSelector, shallow);
}

/** Gets the parent nodes of a specified node (nodes that have an output connected to one of the inputs of the node) */
export function useFlowNodeParents(id?: string) {
  const inputEdges = useFlowNodeInputEdges(id);
  const parentNodesSelector = useCallback(
    (state: ReactFlowState) => {
      return inputEdges
        .map((e) => state.getNodes().find((n: Node) => n.id === e.source))
        .filter((n): n is Node => n !== null);
    },
    [inputEdges],
  );
  return useStore(parentNodesSelector, shallow);
}

/** Retrieves the nodes connected to the inputs of the node */
export function useFlowInputNodes<T = any>(id?: string) {
  const nodeId = useNodeId(id);
  const nodes = useNodes();
  const edges = useEdges();

  return useMemo(() => {
    return edges
      .filter((e) => e.target === nodeId)
      .map((e) => nodes.find((n) => n.id === e.source))
      .filter((n): n is Node<T> => n !== null);
  }, [edges, nodeId, nodes]);
}

/** Retrieves the nodes connected to the outputs of the node */
export function useFlowOutputNodes<T = any>(id?: string) {
  const nodeId = useNodeId(id);
  const nodes = useNodes();
  const edges = useEdges();

  return useMemo(() => {
    return edges
      .filter((e) => e.source === nodeId)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter((n): n is Node<T> => n !== null);
  }, [edges, nodeId, nodes]);
}

/** Utilities to manipulate a node in the flow */
export function useFlowNodeUtils<NodeData = any>(id?: string) {
  const nodeId = useNodeId(id);
  const reactFlowInstance = useFlowInstance<NodeData>();

  /** Mutate the node's `.data` object */
  const setNodeData = useCallback(
    (setNewData: (newData?: NodeData) => NodeData) => {
      if (!nodeId) return;

      reactFlowInstance.setNodes((nodes) => {
        return nodes.map((n) => {
          if (n.id === nodeId) {
            return { ...n, data: setNewData(n.data) };
          }
          return n;
        });
      });
    },
    [nodeId, reactFlowInstance],
  );

  const setNodeParent = useCallback(
    (node?: Node<any>, extent?: "parent" | CoordinateExtent) => {
      if (!nodeId) return;

      reactFlowInstance.setNodes((nodes) => {
        return nodes.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              parentId: node ? node.id : undefined,
              extent,
              position: node
                ? relativePosition(node.position, n.position)
                : (n.positionAbsolute ?? n.position),
            };
          }
          return n;
        });
      });
    },
    [nodeId, reactFlowInstance],
  );

  return useMemo(
    () => ({
      setNodeData,
      setNodeParent,
    }),
    [setNodeData, setNodeParent],
  );
}

export function useFlowNodeIntersections<NodeData = any>(id?: string) {
  const nodeId = useNodeId(id);
  const node = useFlowNode(nodeId ?? "");
  const reactFlowInstance = useFlowInstance<NodeData>();

  return node ? reactFlowInstance.getIntersectingNodes(node, false) : [];
}
