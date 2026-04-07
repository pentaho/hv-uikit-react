import { useReactFlow } from "reactflow";

import type { HvFlowInstance } from "../types";

/** Retrieves the React Flow instance */
export function useFlowInstance<
  NodeData = any,
  EdgeData = any,
>(): HvFlowInstance<NodeData, EdgeData> {
  return useReactFlow<NodeData, EdgeData>();
}
