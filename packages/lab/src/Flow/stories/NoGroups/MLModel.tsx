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
import type { HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

// The code for these components are available here: https://github.com/pentaho/hv-uikit-react/tree/master/packages/lab/src/components/Flow/stories/NoGroups
import { MLModelDetection } from "./MLModelDetection";
import { MLModelPrediction } from "./MLModelPrediction";

interface MLModelData {
  type: "prediction" | "detection";
}

export const MLModel: HvFlowNodeFC<MLModelData> = (props) => {
  const {
    data: { type },
  } = props;

  switch (type) {
    case "detection":
      return <MLModelDetection {...props} />;
    case "prediction":
      return <MLModelPrediction {...props} />;
    default:
      break;
  }
  return null;
};
