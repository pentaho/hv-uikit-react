import { LineChartAlt } from "@pentaho/uikit-react-icons";
import { HvFlowNode, type HvFlowNodeFC } from "@pentaho/uikit-react-lab";

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
