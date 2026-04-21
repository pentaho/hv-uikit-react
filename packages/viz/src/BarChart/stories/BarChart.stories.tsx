import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBarChart,
  type HvBarChartProps,
} from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../../BaseChart/stories/utils";

const meta: Meta<typeof HvBarChart> = {
  title: "Visualizations/Bar Chart",
  component: HvBarChart,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

export const Main: StoryObj<HvBarChartProps> = {
  args: {
    stack: undefined,
    horizontal: false,
  },
  argTypes: {
    legend: { control: { disable: true } },
    data: { control: { disable: true } },
    xAxis: {
      control: { disable: true },
      description:
        "Options for the xAxis, i.e. the horizontal axis. The default `type` for this axis is `continuous` or `categorical` whether the bar chart is horizontal or not, respectively.",
    },
    yAxis: {
      control: { disable: true },
      description:
        "Options for the yAxis, i.e. the vertical axis. The default `type` for this axis is `categorical` or `continuous` whether the bar chart is horizontal or not, respectively.",
    },
    groupBy: { control: { disable: true } },
    splitBy: { control: { disable: true } },
    measures: { control: { disable: true } },
    sortBy: { control: { disable: true } },
    tooltip: { control: { disable: true } },
    seriesNameFormatter: { control: { disable: true } },
    horizontalRangeSlider: { control: { disable: true } },
    classes: { control: { disable: true } },
    grid: { control: { disable: true } },
    onEvents: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvBarChart
        {...args}
        data={{
          Month: ["January", "February", "March"],
          "Sales Target": [2300, 1000, 6700],
        }}
        groupBy="Month"
        measures="Sales Target"
      />
    );
  },
};
