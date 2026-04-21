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
