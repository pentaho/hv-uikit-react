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
import { useNodeId as useReactNodeId } from "reactflow";

/** Retrieves the node id. INTERNAL USE ONLY */
export function useNodeId(id?: string) {
  const currentNodeId = useReactNodeId();
  return id ?? currentNodeId;
}
