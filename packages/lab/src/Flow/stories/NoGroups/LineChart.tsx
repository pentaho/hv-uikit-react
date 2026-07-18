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
import { LineChartAlt } from "@hitachivantara/uikit-react-icons";
import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

export const LineChart: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      title="Visualization"
      subtitle="Line Chart"
      icon={<LineChartAlt />}
      description="LineChart description"
      color="cat12_80"
      inputs={[
        {
          label: "Data",
          isMandatory: true,
          accepts: ["prediction", "detection"],
        },
      ]}
      {...props}
    />
  );
};
