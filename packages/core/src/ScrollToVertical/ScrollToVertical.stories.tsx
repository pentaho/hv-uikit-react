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
  HvContainer,
  HvPanel,
  HvScrollToVertical,
  HvTypography,
  type HvScrollToVerticalProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvScrollToVertical> = {
  title: "Components/ScrollToVertical",
  component: HvScrollToVertical,
};
export default meta;

export const Main: StoryObj<HvScrollToVerticalProps> = {
  args: {
    navigationMode: "push",
    position: "absolute",
    tooltipPosition: "left",
    offset: 20,
  },
  argTypes: {
    classes: { control: { disable: true } },
    options: { control: { disable: true } },
  },
  render: (args) => {
    const options = [
      { label: "Server status summary", value: "mainId1" },
      { label: "Optimization", value: "mainId2" },
      { label: "Performance analysis", value: "mainId3" },
      { label: "Insights", value: "mainId4" },
    ];

    return (
      <div className="relative">
        <HvScrollToVertical
          {...args}
          scrollElementId="pageContentId"
          options={options}
        />
        <HvContainer
          id="pageContentId"
          tabIndex={0}
          className="grid gap-md max-h-400px overflow-auto py-md w-90%"
        >
          {options.map((option) => (
            <HvPanel
              key={option.value}
              id={option.value}
              className="min-h-400px"
            >
              <HvTypography variant="title1">{option.label}</HvTypography>
              <HvTypography>Content</HvTypography>
            </HvPanel>
          ))}
        </HvContainer>
      </div>
    );
  },
};
