import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

export const MLModelPrediction: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      description="Anomaly Prediction description"
      disableInlineEdit
      groupId="models"
      inputs={[
        {
          label: "Sensor Data",
          isMandatory: true,
          accepts: ["sensorData"],
          maxConnections: 1,
        },
      ]}
      outputs={[
        {
          label: "Prediction",
          isMandatory: true,
          provides: "prediction",
        },
      ]}
      {...props}
    />
  );
};
