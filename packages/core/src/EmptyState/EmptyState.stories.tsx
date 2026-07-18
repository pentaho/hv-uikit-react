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
  HvEmptyState,
  HvTypography,
  type HvEmptyStateProps,
} from "@hitachivantara/uikit-react-core";
import { BarChart, Info } from "@hitachivantara/uikit-react-icons";

const meta: Meta<typeof HvEmptyState> = {
  title: "Components/Empty State",
  component: HvEmptyState,
};
export default meta;

export const Main: StoryObj<HvEmptyStateProps> = {
  args: {
    title: "No data routes",
    message: "After you start adding Data Routes, they will appear here.",
    action: "Check the documentation for help.",
    icon: <Info />,
  },
  argTypes: {
    icon: { control: { disable: true } },
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvEmptyState {...args} />;
  },
};

export const WithAction: StoryObj<HvEmptyStateProps> = {
  render: () => {
    return (
      <HvEmptyState
        title="No data routes"
        message="After you start adding Data Routes, they will appear here."
        icon={<BarChart />}
        action={
          <HvTypography link component="a" href="#" target="_blank">
            Create a new data route
          </HvTypography>
        }
      />
    );
  },
};

export const Minimal: StoryObj<HvEmptyStateProps> = {
  render: () => {
    return <HvEmptyState message="No data to display" icon={<Info />} />;
  },
};
