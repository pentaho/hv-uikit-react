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
import { createContext, useContext } from "react";

import { DescendantProvider } from "./DescendantProvider";
import type { TreeViewAnyPluginSignature, TreeViewInstance } from "./types";

export interface TreeViewContextValue<
  TPlugins extends readonly TreeViewAnyPluginSignature[],
> {
  treeId: string | undefined;
  instance: TreeViewInstance<TPlugins> | null;
  multiSelect: boolean;
  disabledItemsFocusable: boolean;
  icons: {
    defaultCollapseIcon: React.ReactNode;
    defaultExpandIcon: React.ReactNode;
    defaultParentIcon: React.ReactNode;
    defaultEndIcon: React.ReactNode;
  };
}

export const DEFAULT_TREE_VIEW_CONTEXT_VALUE: TreeViewContextValue<any> = {
  instance: null,
  multiSelect: false,
  disabledItemsFocusable: false,
  treeId: undefined,
  icons: {
    defaultCollapseIcon: null,
    defaultExpandIcon: null,
    defaultParentIcon: null,
    defaultEndIcon: null,
  },
};

/**
 * @ignore - internal component.
 */
export const TreeViewContext = createContext<TreeViewContextValue<any>>(
  DEFAULT_TREE_VIEW_CONTEXT_VALUE,
);

export interface TreeViewProviderProps<
  TPlugins extends readonly TreeViewAnyPluginSignature[],
> {
  value: TreeViewContextValue<TPlugins>;
  children: React.ReactNode;
}

/**
 * Sets up the contexts for the underlying TreeItem components.
 *
 * @ignore - do not document.
 */
export const TreeViewProvider = <
  TPlugins extends readonly TreeViewAnyPluginSignature[],
>(
  props: TreeViewProviderProps<TPlugins>,
) => {
  const { value, children } = props;

  return (
    <TreeViewContext.Provider value={value}>
      <DescendantProvider>{children}</DescendantProvider>
    </TreeViewContext.Provider>
  );
};

export const useTreeViewContext = <
  TPlugins extends readonly TreeViewAnyPluginSignature[],
>() => useContext(TreeViewContext) as TreeViewContextValue<TPlugins>;
