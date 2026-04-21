import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

export const MLModelDetection: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      description="Anomaly Detection description"
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
          label: "Detection",
          isMandatory: true,
          provides: "detection",
        },
      ]}
      {...props}
    />
  );
};
