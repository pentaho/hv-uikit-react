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
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvTreemapChart,
  type HvTreemapChartProps,
} from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../../BaseChart/stories/utils";
import { data as testData } from "./data";

const meta: Meta<typeof HvTreemapChart> = {
  title: "Visualizations/Treemap",
  component: HvTreemapChart,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

export const Main: StoryObj<HvTreemapChartProps> = {
  args: {},
  argTypes: {
    data: { control: { disable: true } },
    tooltip: { control: { disable: true } },
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvTreemapChart name="Public Spending" data={testData} {...args} />;
  },
};
