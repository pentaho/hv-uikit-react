import { setupChromatic } from "@hitachivantara/internal";
import {
  HvControls,
  HvLeftControl,
  HvRightControl,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";
import { Controls as ControlsStory } from "./stories/Controls";

const meta = preview.meta({
  title: "Components/Controls",
  component: HvControls,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvLeftControl, HvRightControl },
});

export const Main = meta.story({
  parameters: {
    ...setupChromatic(),
  },
  render: () => <ControlsStory />,
});
