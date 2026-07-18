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
import { MachineLearning } from "@hitachivantara/uikit-react-icons";
import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

export const MLModelDetection: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      title="ML Model"
      subtitle="ML Model Detection"
      icon={<MachineLearning />}
      description="Anomaly Detection description"
      color="cat8"
      outputs={[
        {
          label: "Detection",
          isMandatory: true,
          provides: "detection",
        },
      ]}
      inputs={[
        {
          label: "Sensor Data",
          isMandatory: true,
          accepts: ["sensorData"],
        },
      ]}
      {...props}
    />
  );
};
