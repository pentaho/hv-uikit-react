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
import { Cluster } from "@hitachivantara/uikit-react-icons";
import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

export const Asset: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      title="Asset"
      subtitle="Asset"
      icon={<Cluster />}
      description="Asset description"
      color="cat11_80"
      expanded
      params={[
        {
          id: "asset",
          label: "Asset option",
          type: "select",
          options: [
            { id: "option1", label: "Option 1" },
            { id: "option2", label: "Option 2" },
          ],
        },
      ]}
      outputs={[
        {
          label: "Sensor Group 1",
          isMandatory: true,
          provides: "sensorData",
        },
        {
          label: "Sensor Group 2",
          isMandatory: true,
          provides: "sensorData",
        },
      ]}
      {...props}
    />
  );
};
