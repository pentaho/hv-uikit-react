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
  HvDonutChart,
  type HvDonutChartProps,
} from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../BaseChart/stories/utils";

const meta: Meta<typeof HvDonutChart> = {
  title: "Visualizations/Donut Chart",
  component: HvDonutChart,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

export const Main: StoryObj<HvDonutChartProps> = {
  args: {
    type: "regular",
  },
  argTypes: {
    measure: { control: { disable: true } },
    slicesNameFormatter: { control: { disable: true } },
    data: { control: { disable: true } },
    groupBy: { control: { disable: true } },
    sortBy: { control: { disable: true } },
    tooltip: { control: { disable: true } },
    legend: { control: { disable: true } },
    grid: { control: { disable: true } },
    classes: { control: { disable: true } },
    onEvents: { control: { disable: true } },
  },
  render: (params) => {
    return (
      <HvDonutChart
        {...params}
        data={{
          Type: ["Uploads", "Downloads"],
          Music: [250, 800],
        }}
        groupBy="Type"
        measure="Music"
      />
    );
  },
};
