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
  HvHeatmap,
  type HvHeatmapProps,
} from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../../BaseChart/stories/utils";
import { data as customData, days, hours } from "./data";

const meta: Meta<typeof HvHeatmap> = {
  title: "Visualizations/Heatmap",
  component: HvHeatmap,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

export const Main: StoryObj<HvHeatmapProps> = {
  args: {
    min: 0,
    max: 12,
    colorScale: ["#2D4B87", "#E7EDF9"],
  },
  argTypes: {
    data: { control: { disable: true } },
    tooltip: { control: { disable: true } },
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvHeatmap
        name="My Heatmap"
        data={customData}
        xAxis={{ data: hours }}
        yAxis={{ data: days }}
        {...args}
      />
    );
  },
};
