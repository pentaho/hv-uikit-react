import type { Node, NodeProps, ReactFlowInstance } from "reactflow";
import type {
  HvActionGeneric,
  HvSliderProps,
} from "@hitachivantara/uikit-react-core";
import type { HvColorAny } from "@hitachivantara/uikit-styles";

import type { HvFlowNodeProps } from "./Node";

// Node types

/** HvFlowNode component type. @extends React.FC */
export interface HvFlowNodeFC<NodeData = any> extends React.FC<
  NodeProps<NodeData>
> {}

export type HvFlowNodeTypes<NodeData = any> = Record<
  string,
  HvFlowNodeFC<NodeData>
>;

export interface HvFlowGroupItem<NodeData = any> extends Pick<
  HvFlowNodeProps,
  "params" | "subtitle"
> {
  /** The node identifier registered in `nodeTypes` */
  nodeType: string;
  label: string;
  data?: NodeData;
}

/** Node groups */
export interface HvFlowNodeGroup {
  label: string;
  description?: string;
  color?: HvColorAny;
  icon?: React.ReactNode;
  items?: HvFlowGroupItem[];
}
export type HvFlowNodeGroups<GroupId extends keyof any = string> = Record<
  GroupId,
  HvFlowNodeGroup
>;

export interface HvFlowNodeMeta {
  label: string;
  inputs?: (HvFlowNodeInput | HvFlowNodeInputGroup)[];
  outputs?: (HvFlowNodeOutput | HvFlowNodeOutputGroup)[];
}

export interface HvFlowNodeInput {
  id?: string;
  label: React.ReactNode;
  isMandatory?: boolean;
  accepts?: string[];
  maxConnections?: number;
}

export interface HvFlowNodeInputGroup {
  label: React.ReactNode;
  inputs: HvFlowNodeInput[];
}

export interface HvFlowNodeOutput {
  id?: string;
  label: React.ReactNode;
  isMandatory?: boolean;
  provides?: string;
  maxConnections?: number;
}

export interface HvFlowNodeOutputGroup {
  label: React.ReactNode;
  outputs: HvFlowNodeOutput[];
}

export interface HvFlowNodeSharedParam {
  id: string;
  label: string;
}

export interface HvFlowNodeTextParam extends HvFlowNodeSharedParam {
  type: "text";
}

export interface HvFlowNodeSelectParam extends HvFlowNodeSharedParam {
  type: "select";
  multiple?: boolean;
  options?: string[] | { id: string; label: string }[]; // v6 - only allow objects
}

export interface HvFlowNodeSliderParam
  extends
    HvFlowNodeSharedParam,
    Omit<HvSliderProps, keyof HvFlowNodeSharedParam> {
  type: "slider";
}

export type HvFlowNodeParam =
  | HvFlowNodeSelectParam
  | HvFlowNodeTextParam
  | HvFlowNodeSliderParam;

export interface HvFlowNodeAction extends HvActionGeneric {
  callback?: (node: Node) => void;
}

export type HvFlowBuiltInAction = "delete" | "duplicate";

export type HvFlowBuiltInActions = Omit<HvFlowNodeAction, "id" | "callback"> & {
  id: HvFlowBuiltInAction;
};

export type HvFlowNodeMetaRegistry = Record<string, HvFlowNodeMeta>;

export type HvFlowInstance<NodeData = any, EdgeData = any> = ReactFlowInstance<
  NodeData,
  EdgeData
>;
