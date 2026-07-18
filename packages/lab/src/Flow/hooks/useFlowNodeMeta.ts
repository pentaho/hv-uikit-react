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
import { useNodeMetaRegistry } from "../FlowContext/NodeMetaContext";
import { useNodeId } from "./useNodeId";

export function useFlowNodeMeta(id?: string) {
  const nodeId = useNodeId(id);
  const { registry } = useNodeMetaRegistry();

  return registry[nodeId!];
}
