import { MachineLearning } from "@hitachivantara/uikit-react-icons";
import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

export const MLModelPrediction: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      title="ML Model"
      subtitle="ML Model Prediction"
      icon={<MachineLearning />}
      description="Anomaly Prediction description"
      color="cat10_80"
      outputs={[
        {
          label: "Prediction",
          isMandatory: true,
          provides: "prediction",
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
