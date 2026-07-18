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
import { unstable_useId as useId } from "@mui/material/utils";

import type {
  TreeViewInstance,
  TreeViewPlugin,
  TreeViewPluginSignature,
} from "../../types";
import type { UseTreeViewNodesSignature } from "./useTreeViewNodes";
import type { UseTreeViewSelectionSignature } from "./useTreeViewSelection";

export interface UseTreeViewContextValueBuilderParameters {
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
  /**
   * The default icon used to collapse the node.
   */
  defaultCollapseIcon?: React.ReactNode;
  /**
   * The default icon displayed next to a end node. This is applied to all
   * tree nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultEndIcon?: React.ReactNode;
  /**
   * The default icon used to expand the node.
   */
  defaultExpandIcon?: React.ReactNode;
  /**
   * The default icon displayed next to a parent node. This is applied to all
   * parent nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultParentIcon?: React.ReactNode;
}

export type UseTreeViewContextValueBuilderDefaultizedParameters =
  UseTreeViewContextValueBuilderParameters;

export type UseTreeViewContextValueBuilderSignature = TreeViewPluginSignature<
  UseTreeViewContextValueBuilderParameters,
  UseTreeViewContextValueBuilderDefaultizedParameters,
  {},
  {},
  {},
  never,
  [UseTreeViewNodesSignature, UseTreeViewSelectionSignature<any>]
>;

export const useTreeViewContextValueBuilder: TreeViewPlugin<
  UseTreeViewContextValueBuilderSignature
> = ({ instance, params }) => {
  const treeId = useId(params.id);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
    contextValue: {
      treeId,
      instance: instance as TreeViewInstance<any>,
      multiSelect: params.multiSelect,
      disabledItemsFocusable: params.disabledItemsFocusable,
      icons: {
        defaultCollapseIcon: params.defaultCollapseIcon,
        defaultEndIcon: params.defaultEndIcon,
        defaultExpandIcon: params.defaultExpandIcon,
        defaultParentIcon: params.defaultParentIcon,
      },
    },
  };
};
