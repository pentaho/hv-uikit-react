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
import { useMemo } from "react";
import {
  HvFlowNode,
  useFlowInputNodes,
  type HvFlowNodeFC,
  type HvFlowNodeProps,
} from "@hitachivantara/uikit-react-lab";

import type { NodeData } from "../types";

export const Kpi: HvFlowNodeFC = (props) => {
  const inputNodes = useFlowInputNodes<NodeData>();

  const params: HvFlowNodeProps["params"] = useMemo(() => {
    const columns = inputNodes[0]?.data.columns;

    return columns
      ? [
          { label: "Title", id: "title", type: "text" },
          { label: "Unit", id: "unit", type: "text" },
          {
            label: "Aggregation",
            id: "aggregation",
            type: "select",
            options: [
              {
                id: "sum",
                label: "Sum",
              },
              { id: "distinct", label: "Distinct" },
            ],
          },
          {
            label: "Measure",
            id: "measure",
            type: "select",
            options: columns,
          },
        ]
      : undefined;
  }, [inputNodes]);

  return (
    <HvFlowNode
      description="KPI"
      groupId="visualization"
      params={params}
      expanded
      inputs={[
        {
          label: "Dataset",
          isMandatory: true,
          accepts: ["dataset"],
          maxConnections: 1,
        },
      ]}
      outputs={[
        {
          label: "Visualization",
          isMandatory: true,
          provides: "visualizations",
        },
      ]}
      {...props}
    />
  );
};
