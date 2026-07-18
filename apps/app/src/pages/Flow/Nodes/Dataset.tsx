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
import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

export const Dataset: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      title="Dataset"
      groupId="dataset"
      outputs={[{ label: "Dataset", isMandatory: true, provides: "dataset" }]}
      {...props}
    />
  );
};
