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
  HvScatterPlot,
  type HvScatterPlotProps,
} from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../../BaseChart/stories/utils";

const meta: Meta<typeof HvScatterPlot> = {
  title: "Visualizations/Scatter Plot",
  component: HvScatterPlot,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

const temperatureFormatter = (x?: string | number) => `${x}ºC`;

export const Main: StoryObj<HvScatterPlotProps> = {
  argTypes: {
    legend: { control: { disable: true } },
    data: { control: { disable: true } },
    xAxis: {
      control: { disable: true },
      description:
        "Options for the xAxis, i.e. the horizontal axis. The default `type` for this axis is `continuous`.",
    },
    yAxis: {
      control: { disable: true },
      description:
        "Options for the yAxis, i.e. the vertical axis. The default `type` for this axis is `continuous`.",
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
  render: (args) => (
    <HvScatterPlot
      {...args}
      data={{
        Temperature: [
          20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48,
        ],
        Sales: [
          560, 498, 502, 536, 575, 753, 786, 983, 1025, 1286, 1822, 2150, 2200,
          1920, 1856,
        ],
      }}
      groupBy="Temperature"
      measures="Sales"
      yAxis={{
        name: "Number of Sales",
      }}
      xAxis={{
        minValue: 20,
        name: "Temperature",
        labelFormatter: temperatureFormatter,
      }}
      tooltip={{
        titleFormatter: temperatureFormatter,
      }}
    />
  ),
};
