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
  HvActionBar,
  HvButton,
  theme,
  type HvActionBarProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvActionBar> = {
  title: "Components/Action Bar",
  component: HvActionBar,
  decorators: [
    (Story) => (
      <div className="relative m-auto bg-bgContainer h-150px w-400px flex items-end">
        {Story()}
      </div>
    ),
  ],
};

export default meta;

export const Main: StoryObj<HvActionBarProps> = {
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => (
    <HvActionBar style={{ gap: theme.space.xs }}>
      <HvButton variant="secondaryGhost">Help</HvButton>
      <div style={{ flex: 1 }} aria-hidden="true" />
      <HvButton variant="secondaryGhost">Save</HvButton>
      <HvButton variant="secondaryGhost">Cancel</HvButton>
    </HvActionBar>
  ),
};
