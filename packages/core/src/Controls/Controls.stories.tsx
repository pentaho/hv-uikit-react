import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@pentaho/internal";
import {
  HvControls,
  HvLeftControl,
  HvRightControl,
} from "@pentaho/uikit-react-core";

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
