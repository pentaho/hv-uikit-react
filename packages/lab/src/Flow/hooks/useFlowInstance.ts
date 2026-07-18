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
import { useReactFlow } from "reactflow";

import type { HvFlowInstance } from "../types";

/** Retrieves the React Flow instance */
export function useFlowInstance<
  NodeData = any,
  EdgeData = any,
>(): HvFlowInstance<NodeData, EdgeData> {
  return useReactFlow<NodeData, EdgeData>();
}
