import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvConfusionMatrix,
  type HvConfusionMatrixProps,
} from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../BaseChart/stories/utils";

const meta: Meta<typeof HvConfusionMatrix> = {
  title: "Visualizations/Confusion Matrix",
  component: HvConfusionMatrix,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

const mockData = {
  prediction: [
    "Beaver",
    "Beaver",
    "Beaver",
    "Beaver",
    "Lion",
    "Lion",
    "Lion",
    "Lion",
    "Seal",
    "Seal",
    "Seal",
    "Seal",
    "Dog",
    "Dog",
    "Dog",
    "Dog",
  ],
  expected: [
    "Beaver",
    "Lion",
    "Seal",
    "Dog",
    "Beaver",
    "Lion",
    "Seal",
    "Dog",
    "Beaver",
    "Lion",
    "Seal",
    "Dog",
    "Beaver",
    "Lion",
    "Seal",
    "Dog",
  ],
  matches: [95, 15, 1, 20, 10, 97, 8, 40, 6, 12, 100, 16, 2, 9, 12, 90],
};

export const Main: StoryObj<HvConfusionMatrixProps> = {
  args: {
    format: "square",
  },
  argTypes: {
    measure: { control: { disable: true } },
    splitBy: { control: { disable: true } },
    data: { control: { disable: true } },
    delta: { control: { disable: true } },
    xAxis: { control: { disable: true } },
    yAxis: { control: { disable: true } },
    tooltip: { control: { disable: true } },
    valuesProps: { control: { disable: true } },
    classes: { control: { disable: true } },
    groupBy: { control: { disable: true } },
    sortBy: { control: { disable: true } },
    legend: { control: { disable: true } },
    grid: { control: { disable: true } },
    onEvents: { control: { disable: true } },
  },
  render: (params) => {
    return (
      <HvConfusionMatrix
        {...params}
        data={mockData}
        measure="matches"
        groupBy="prediction"
        splitBy="expected"
      />
    );
  },
};
