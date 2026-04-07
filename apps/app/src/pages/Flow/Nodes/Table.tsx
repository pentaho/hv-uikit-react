import { useMemo } from "react";
import {
  HvFlowNode,
  type HvFlowNodeFC,
  type HvFlowNodeProps,
} from "@hitachivantara/uikit-react-lab";

export const Table: HvFlowNodeFC = (props) => {
  const params: HvFlowNodeProps["params"] = useMemo(() => {
    return [
      { label: "Title", id: "title", type: "text" },
      {
        label: "Territory",
        id: "measure",
        type: "select",
        options: [
          { id: "APAC", label: "APAC" },
          { id: "EMEA", label: "EMEA" },
          { id: "NA", label: "NA" },
          { id: "Japan", label: "Japan" },
        ],
      },
    ];
  }, []);

  return (
    <HvFlowNode
      description="Table"
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
