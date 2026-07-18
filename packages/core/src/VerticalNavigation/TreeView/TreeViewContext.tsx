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
import { createContext } from "react";

export type NavigationMode = "treeview" | "navigation" | "slider";

const TreeViewControlContext = createContext<TreeViewControlContextValue>({});
TreeViewControlContext.displayName = "TreeViewControlContext";

const TreeViewStateContext = createContext<TreeviewStateContextValue>({});
TreeViewStateContext.displayName = "TreeViewStateContext";

export { TreeViewControlContext, TreeViewStateContext };

interface TreeviewStateContextValue {
  isExpanded?: (id: any) => boolean;
  isSelected?: (id: any) => boolean;
  isFocused?: (id: any) => boolean;
  isDisabled?: (id: any) => boolean;
  isChildSelected?: (id: any) => boolean;
}

interface TreeViewControlContextValue {
  treeId?: any;
  mode?: NavigationMode;
  collapsible?: boolean;
  toggleExpansion?: (event: any, value?: any) => void;
  multiSelect?: boolean;
  selectNode?: (event: any, id: any, multiple?: any) => boolean;
  selectRange?: (event: any, nodes: any, stacked?: boolean) => void;
  disabledItemsFocusable?: boolean;
  registerNode?: (node: any) => void;
  unregisterNode?: (id: any) => void;
  mapFirstChar?: (id: any, firstChar: any) => void;
  unMapFirstChar?: (id: any, firstChar?: any) => void;
  focus?: (id: any, firstChar: any) => void;
}
