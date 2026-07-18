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
import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { HvFlowNodeAction, HvFlowNodeGroups } from "../types";
import { HvFlowNodeMetaProvider } from "./NodeMetaContext";

export interface HvFlowContextValue<NodeGroups extends keyof any = string> {
  /** Flow nodes groups. */
  nodeGroups?: HvFlowNodeGroups<NodeGroups>;
  /** Flow nodes groups expanded on sidebar. */
  expandedNodeGroups?: string[];
  /** Flow default actions. */
  defaultActions?: HvFlowNodeAction[];
  /** Function to set `expandedNodeGroups`. */
  setExpandedNodeGroups?: Dispatch<SetStateAction<string[]>>;
}

export const HvFlowContext = createContext<HvFlowContextValue>({});

export interface HvFlowProviderProps<NodeGroups extends keyof any = string> {
  /** Flow nodes groups. */
  nodeGroups?: HvFlowContextValue<NodeGroups>["nodeGroups"];
  /** Flow default actions. */
  defaultActions?: HvFlowNodeAction[];
  /** Children. */
  children?: React.ReactNode;
}

export const HvFlowProvider = ({
  nodeGroups,
  defaultActions,
  children,
}: HvFlowProviderProps) => {
  const [expandedNodeGroups, setExpandedNodeGroups] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      nodeGroups,
      defaultActions,
      expandedNodeGroups,
      setExpandedNodeGroups,
    }),
    [nodeGroups, defaultActions, expandedNodeGroups],
  );

  return (
    <HvFlowNodeMetaProvider>
      <HvFlowContext.Provider value={value}>{children}</HvFlowContext.Provider>
    </HvFlowNodeMetaProvider>
  );
};
