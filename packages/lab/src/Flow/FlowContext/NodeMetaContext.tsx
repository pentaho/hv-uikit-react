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
import { createContext, useCallback, useContext, useMemo, useRef } from "react";

import type { HvFlowNodeMeta } from "../types";

interface HvFlowNodeMetaContextType {
  registerNode: (id: string, nodeInfo: HvFlowNodeMeta) => void;
  unregisterNode: (id: string) => void;
  getRegistry: () => Record<string, HvFlowNodeMeta>;
}

const HvFlowNodeMetaContext = createContext<
  HvFlowNodeMetaContextType | undefined
>(undefined);

export const HvFlowNodeMetaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const registryRef = useRef<Record<string, HvFlowNodeMeta>>({});

  const registerNode = useCallback((id: string, nodeInfo: HvFlowNodeMeta) => {
    registryRef.current[id] = nodeInfo;
  }, []);

  const unregisterNode = useCallback((id: string) => {
    delete registryRef.current[id];
  }, []);

  const getRegistry = useCallback(() => {
    return registryRef.current;
  }, []);

  const value = useMemo<HvFlowNodeMetaContextType>(
    () => ({
      registerNode,
      unregisterNode,
      getRegistry,
    }),
    [registerNode, unregisterNode, getRegistry],
  );

  return (
    <HvFlowNodeMetaContext.Provider value={value}>
      {children}
    </HvFlowNodeMetaContext.Provider>
  );
};

export function useNodeMetaRegistry() {
  const context = useContext(HvFlowNodeMetaContext);

  if (context === undefined) {
    throw new Error(
      "useNodeRegistry must be used within a HvFlowNodeMetaProvider",
    );
  }

  return {
    registerNode: context.registerNode,
    unregisterNode: context.unregisterNode,
    registry: context.getRegistry(),
  };
}
