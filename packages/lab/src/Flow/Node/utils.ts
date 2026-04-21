import { isValidElement } from "react";
import type { Edge } from "reactflow";
import type { HvActionGeneric } from "@hitachivantara/uikit-react-core";

import type {
  HvFlowNodeInput,
  HvFlowNodeInputGroup,
  HvFlowNodeOutput,
  HvFlowNodeOutputGroup,
} from "../types";

export const isInputGroup = (
  input: HvFlowNodeInput | HvFlowNodeInputGroup,
): input is HvFlowNodeInputGroup => {
  return "inputs" in input;
};

export const isOutputGroup = (
  output: HvFlowNodeOutput | HvFlowNodeOutputGroup,
): output is HvFlowNodeOutputGroup => {
  return "outputs" in output;
};

export const isConnected = (
  id: string,
  type: "target" | "source",
  handleId: string,
  edges: Edge[],
) => {
  if (type === "target") {
    return edges.some((e) => e.target === id && e.targetHandle === handleId);
  }
  if (type === "source") {
    return edges.some((e) => e.source === id && e.sourceHandle === handleId);
  }

  return false;
};

export const renderedIcon = (actionIcon: HvActionGeneric["icon"]) =>
  isValidElement(actionIcon) ? actionIcon : (actionIcon as Function)?.();

export const identifyHandles = (
  handles?:
    | (HvFlowNodeInput | HvFlowNodeInputGroup)[]
    | (HvFlowNodeOutput | HvFlowNodeOutputGroup)[],
) => {
  let idx = 0;

  return handles?.map(
    (
      handle:
        | HvFlowNodeOutput
        | HvFlowNodeOutputGroup
        | HvFlowNodeInput
        | HvFlowNodeInputGroup,
    ) => {
      if (isInputGroup(handle)) {
        return {
          ...handle,
          inputs: handle.inputs.map((x) => {
            const identifiedHandle =
              x.id != null ? x : { ...x, id: String(idx) };
            idx += 1;
            return identifiedHandle;
          }),
        } satisfies HvFlowNodeInputGroup;
      }

      if (isOutputGroup(handle)) {
        return {
          ...handle,
          outputs: handle.outputs.map((x) => {
            const identifiedHandle =
              x.id != null ? x : { ...x, id: String(idx) };
            idx += 1;
            return identifiedHandle;
          }),
        } satisfies HvFlowNodeOutputGroup;
      }

      const identifiedHandle =
        handle.id != null ? handle : { ...handle, id: String(idx) };
      idx += 1;
      return identifiedHandle;
    },
  );
};
