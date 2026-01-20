import { useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import { HvButton } from "@hitachivantara/uikit-react-core";
import { HvLineChart, HvLineChartProps } from "@hitachivantara/uikit-react-viz";

import { vizDecorator } from "../BaseChart/stories/utils";
import { emptyCellMode } from "../types/generic";

const meta: Meta<typeof HvLineChart> = {
  title: "Visualizations/Line Chart",
  component: HvLineChart,
  decorators: [vizDecorator],
  tags: ["skipTestRunner"],
};
export default meta;

export const Main: StoryObj<HvLineChartProps> = {
  args: {
    area: false,
    stack: undefined,
    emptyCellMode: "connect",
    areaOpacity: 0.5,
  },
  argTypes: {
    legend: { control: { disable: true } },
    data: { control: { disable: true } },
    xAxis: {
      control: { disable: true },
      description:
        "Options for the xAxis, i.e. the horizontal axis. The default `type` for this axis is `categorical`.",
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
    emptyCellMode: {
      control: { type: "radio" },
      options: emptyCellMode,
    },
    classes: { control: { disable: true } },
    grid: { control: { disable: true } },
    onEvents: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvLineChart
        {...args}
        data={{
          Month: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          "Sales Target": [
            5929, 2393, 1590, 7817, 4749, 1702, 2381, 2909, 6732, 3098, 2119,
            2146,
          ],
        }}
        groupBy="Month"
        measures="Sales Target"
      />
    );
  },
};

/** This tests if the horizontal slider resets when removed */
export const Test: StoryObj = {
  parameters: {
    ...setupChromatic("default", { delay: 5000, diffThreshold: 0.8 }),
  },
  decorators: [
    (Story) => (
      <div className={css({ height: 500, padding: 20 })}>{Story()}</div>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const hideBtn = canvas.getByRole("button", { name: "Hide" });
    await userEvent.click(hideBtn);
    const showBtn = canvas.getByRole("button", { name: "Show" });
    expect(showBtn).toBeInTheDocument();
  },
  render: () => {
    const [show, setShow] = useState(true);

    return (
      <>
        <HvButton onClick={() => setShow((prev) => !prev)}>
          {show ? "Hide" : "Show"}
        </HvButton>
        <HvLineChart
          data={{
            Month: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            "Sales Target": [
              5929, 2393, 1590, 7817, 4749, 1702, 2381, 2909, 6732, 3098, 2119,
              2146,
            ],
          }}
          groupBy="Month"
          measures="Sales Target"
          onOptionChange={(option) => {
            if (show) {
              option.dataZoom = [
                { ...option.dataZoom[0], end: 80, start: 50 }, // Setting data zoom because it was not possible through "play"
                option.dataZoom[1],
              ];
            }
            return option;
          }}
          horizontalRangeSlider={{ show }}
        />
      </>
    );
  },
};
