import type { Meta, StoryObj } from "@storybook/react-vite";
import { loadArrow } from "arquero";
import {
  HvBoxplot,
  type HvBoxplotProps,
} from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../../BaseChart/stories/utils";

const meta: Meta<typeof HvBoxplot> = {
  title: "Visualizations/Boxplot",
  component: HvBoxplot,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

export const Main: StoryObj<HvBoxplotProps> = {
  args: {
    groupBy: "Territory",
    measures: ["Sales"],
  },
  argTypes: {
    tooltip: { control: { disable: true } },
    classes: { control: { disable: true } },
    groupBy: {
      control: { type: "select" },
      options: ["Territory", "Country", "State Province", "City"],
    },
  },
  loaders: [
    async () => ({
      // @ts-ignore
      data: await loadArrow(
        "https://pentaho.github.io/assets/steelwheels.arrow",
      ),
    }),
  ],
  render: (args, { loaded: { data } }) => {
    return <HvBoxplot {...args} name="Steel Wheels" data={data} />;
  },
};
