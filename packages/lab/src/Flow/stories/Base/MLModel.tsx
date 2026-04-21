import type { HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

// The code for these components are available here: https://github.com/pentaho/hv-uikit-react/tree/master/packages/lab/src/components/Flow/stories/Base
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
