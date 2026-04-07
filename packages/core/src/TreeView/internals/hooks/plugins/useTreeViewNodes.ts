import * as React from "react";
import { useEventCallback } from "@mui/material/utils";

import type {
  DefaultizedProps,
  TreeViewNode,
  TreeViewPlugin,
  TreeViewPluginSignature,
} from "../../types";
import { publishTreeViewEvent } from "../../utils/publishTreeViewEvent";
import { populateInstance } from "../utils";

export interface UseTreeViewNodesInstance {
  getNode: (nodeId: string) => TreeViewNode;
  updateNode: (node: TreeViewNode) => void;
  removeNode: (nodeId: string) => void;
  getChildrenIds: (nodeId: string | null) => string[];
  getNavigableChildrenIds: (nodeId: string | null) => string[];
  isNodeDisabled: (nodeId: string | null) => nodeId is string;
}

export interface UseTreeViewNodesParameters {
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable?: boolean;
}

export type UseTreeViewNodesDefaultizedParameters = DefaultizedProps<
  UseTreeViewNodesParameters,
  "disabledItemsFocusable"
>;

interface UseTreeViewNodesEventLookup {
  removeNode: {
    params: { id: string };
  };
}

export type UseTreeViewNodesSignature = TreeViewPluginSignature<
  UseTreeViewNodesParameters,
  UseTreeViewNodesDefaultizedParameters,
  UseTreeViewNodesInstance,
  UseTreeViewNodesEventLookup,
  {},
  never,
  []
>;

export const useTreeViewNodes: TreeViewPlugin<UseTreeViewNodesSignature> = ({
  instance,
  params,
}) => {
  const nodeMap = React.useRef<Record<string, TreeViewNode>>({});

  const getNode = React.useCallback(
    (nodeId: string) => nodeMap.current[nodeId],
    [],
  );

  const insertNode = React.useCallback((node: TreeViewNode) => {
    nodeMap.current[node.id] = node;
  }, []);

  const removeNode = React.useCallback(
    (nodeId: string) => {
      const newMap = { ...nodeMap.current };
      delete newMap[nodeId];
      nodeMap.current = newMap;
      publishTreeViewEvent(instance as any, "removeNode", { id: nodeId });
    },
    [instance],
  );

  const isNodeDisabled = React.useCallback(
    (nodeId: string | null): nodeId is string => {
      if (nodeId == null) {
        return false;
      }

      let node = instance.getNode(nodeId);

      // This can be called before the node has been added to the node map.
      if (!node) {
        return false;
      }

      if (node.disabled) {
        return true;
      }

      while (node.parentId != null) {
        node = instance.getNode(node.parentId);
        if (node.disabled) {
          return true;
        }
      }

      return false;
    },
    [instance],
  );

  const getChildrenIds = useEventCallback((nodeId: string | null) =>
    Object.values(nodeMap.current)
      .filter((node) => node.parentId === nodeId)
      .toSorted((a, b) => a.index - b.index)
      .map((child) => child.id),
  );

  const getNavigableChildrenIds = (nodeId: string | null) => {
    let childrenIds = instance.getChildrenIds(nodeId);

    if (!params.disabledItemsFocusable) {
      childrenIds = childrenIds.filter(
        (node) => !instance.isNodeDisabled(node),
      );
    }
    return childrenIds;
  };

  populateInstance<UseTreeViewNodesSignature>(instance, {
    getNode,
    updateNode: insertNode,
    removeNode,
    getChildrenIds,
    getNavigableChildrenIds,
    isNodeDisabled,
  });
};
