import { useContext } from "react";

import { DescendantContext } from "../internals/DescendantProvider";
import type { DefaultTreeViewPlugins } from "../internals/hooks/plugins";
import { useTreeViewContext } from "../internals/TreeViewProvider";

export function useHvTreeItem(nodeId: string) {
  const { instance, multiSelect } =
    useTreeViewContext<DefaultTreeViewPlugins>();
  const { level = 0 } = useContext(DescendantContext);

  const expandable = instance ? instance.isNodeExpandable(nodeId) : false;
  const expanded = instance ? instance.isNodeExpanded(nodeId) : false;
  const focused = instance ? instance.isNodeFocused(nodeId) : false;
  const selected = instance ? instance.isNodeSelected(nodeId) : false;
  const disabled = instance ? instance.isNodeDisabled(nodeId) : false;

  const handleExpansion = (event: React.MouseEvent) => {
    if (!instance || disabled) return;

    if (!focused) {
      instance.focusNode(event, nodeId);
    }

    const multiple =
      multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

    // If already expanded and trying to toggle selection don't close
    if (expandable && !(multiple && instance.isNodeExpanded(nodeId))) {
      instance.toggleNodeExpansion(event, nodeId);
    }
  };

  const handleSelection = (event: React.MouseEvent) => {
    if (!instance || disabled) return;

    if (!focused) {
      instance.focusNode(event, nodeId);
    }

    const multiple =
      multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

    if (multiple) {
      if (event.shiftKey) {
        instance.selectRange(event, { end: nodeId });
      } else {
        instance.selectNode(event, nodeId, true);
      }
    } else {
      instance.selectNode(event, nodeId);
    }
  };

  const preventSelection = (event: React.MouseEvent) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey || disabled) {
      // Prevent text selection
      event.preventDefault();
    }
  };

  return {
    instance,
    level,
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  };
}
