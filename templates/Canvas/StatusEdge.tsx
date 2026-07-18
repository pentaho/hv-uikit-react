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
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";
import {
  HvDropDownMenu,
  type HvDropDownMenuProps,
} from "@hitachivantara/uikit-react-core";
import { useFlowInstance } from "@hitachivantara/uikit-react-lab";

import { flowStatusesSpecs, type FlowStatus } from "./utils";

export type StatusEdgeData =
  | undefined
  | {
      status?: FlowStatus;
    };

export const StatusEdge = (props: EdgeProps<StatusEdgeData>) => {
  const {
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    data,
  } = props;

  const instance = useFlowInstance();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const status = data?.status ? flowStatusesSpecs[data.status] : undefined;

  const handleClick: HvDropDownMenuProps["onClick"] = (event, value) => {
    if (value.id === "remove") {
      instance.setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }
  };

  return (
    <>
      <BaseEdge {...props} path={edgePath} />
      {status && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan nowheel" // ReactFlow specific classes to prevent drag on icon
          >
            <HvDropDownMenu
              icon={status.icon}
              dataList={[{ id: "remove", label: "Remove connection" }]}
              onClick={handleClick}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
