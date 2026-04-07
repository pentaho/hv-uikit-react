import * as React from "react";
import { useEventCallback } from "@mui/material/utils";

import type {
  DefaultizedProps,
  TreeViewPlugin,
  TreeViewPluginSignature,
} from "../../types";
import { populateInstance } from "../utils";
import type { UseTreeViewNodesSignature } from "./useTreeViewNodes";

export interface UseTreeViewExpansionInstance {
  isNodeExpanded: (nodeId: string) => boolean;
  isNodeExpandable: (nodeId: string) => boolean;
  toggleNodeExpansion: (event: React.SyntheticEvent, value: string) => void;
  expandAllSiblings: (
    event: React.KeyboardEvent<HTMLUListElement>,
    nodeId: string,
  ) => void;
}

export interface UseTreeViewExpansionParameters {
  /**
   * Expanded node ids.
   * Used when the item's expansion is controlled.
   */
  expanded?: string[];
  /**
   * Expanded node ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpanded?: string[];
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeIds The ids of the expanded nodes.
   */
  onNodeToggle?: (event: React.SyntheticEvent, nodeIds: string[]) => void;
}

export type UseTreeViewExpansionDefaultizedParameters = DefaultizedProps<
  UseTreeViewExpansionParameters,
  "defaultExpanded"
>;

export type UseTreeViewExpansionSignature = TreeViewPluginSignature<
  UseTreeViewExpansionParameters,
  UseTreeViewExpansionDefaultizedParameters,
  UseTreeViewExpansionInstance,
  {},
  {},
  "expanded",
  [UseTreeViewNodesSignature]
>;

export const useTreeViewExpansion: TreeViewPlugin<
  UseTreeViewExpansionSignature
> = ({ instance, params, models }) => {
  const isNodeExpanded = React.useCallback(
    (nodeId: string) => {
      return Array.isArray(models.expanded.value)
        ? models.expanded.value.indexOf(nodeId) !== -1
        : false;
    },
    [models.expanded.value],
  );

  const isNodeExpandable = React.useCallback(
    (nodeId: string) => !!instance.getNode(nodeId)?.expandable,
    [instance],
  );

  const toggleNodeExpansion = useEventCallback(
    (event: React.SyntheticEvent, nodeId: string | null) => {
      if (nodeId == null) {
        return;
      }

      let newExpanded: string[];

      if (models.expanded.value.indexOf(nodeId!) !== -1) {
        newExpanded = models.expanded.value.filter((id) => id !== nodeId);
      } else {
        newExpanded = [nodeId].concat(models.expanded.value);
      }

      if (params.onNodeToggle) {
        params.onNodeToggle(event, newExpanded);
      }

      models.expanded.setValue(newExpanded);
    },
  );

  const expandAllSiblings = (
    event: React.KeyboardEvent<HTMLUListElement>,
    nodeId: string,
  ) => {
    const node = instance.getNode(nodeId);
    const siblings = instance.getChildrenIds(node.parentId);

    const diff = siblings.filter(
      (child) =>
        instance.isNodeExpandable(child) && !instance.isNodeExpanded(child),
    );

    const newExpanded = models.expanded.value.concat(diff);

    if (diff.length > 0) {
      models.expanded.setValue(newExpanded);

      if (params.onNodeToggle) {
        params.onNodeToggle(event, newExpanded);
      }
    }
  };

  populateInstance<UseTreeViewExpansionSignature>(instance, {
    isNodeExpanded,
    isNodeExpandable,
    toggleNodeExpansion,
    expandAllSiblings,
  });
};

useTreeViewExpansion.models = {
  expanded: {
    controlledProp: "expanded",
    defaultProp: "defaultExpanded",
  },
};

const DEFAULT_EXPANDED: string[] = [];

useTreeViewExpansion.getDefaultizedParams = (params) => ({
  ...params,
  defaultExpanded: params.defaultExpanded ?? DEFAULT_EXPANDED,
});
