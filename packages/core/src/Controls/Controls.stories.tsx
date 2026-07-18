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
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvControls,
  HvLeftControl,
  HvRightControl,
} from "@hitachivantara/uikit-react-core";

import { Controls as ControlsStory } from "./stories/Controls";

const meta: Meta<typeof HvControls> = {
  title: "Components/Controls",
  component: HvControls,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvLeftControl, HvRightControl },
};

export default meta;

export const Main: StoryObj = {
  parameters: {
    ...setupChromatic(),
  },
  render: () => <ControlsStory />,
};
