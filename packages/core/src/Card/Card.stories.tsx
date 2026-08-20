import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  type HvCardProps,
} from "@pentaho/uikit-react-core";

import { Main as MainStory } from "./stories/Main";
import { Variants as VariantsStory } from "./stories/Variants";

const meta: Meta<typeof HvCard> = {
  title: "Components/Card",
  component: HvCard,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvCardHeader, HvCardContent, HvCardMedia },
  decorators: [(Story) => <div style={{ margin: 20 }}>{Story()}</div>],
};
export default meta;

export const Main: StoryObj<HvCardProps> = {
  args: {
    bgcolor: "bgContainer",
    statusColor: "negative",
    selectable: false,
    selected: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    icon: { control: { disable: true } },
  },
  render: (args) => <MainStory {...args} />,
};

export const Variants: StoryObj<HvCardProps> = {
  parameters: {
    docs: {
      description: {
        story: `The \`Card\` component can be constructed by composing several sub-components, like \`HvCardHeader\`, \`HvCardContent\`, \`HvCardMedia\`, and \`HvActionsBar\`. 
        This sample showcases how these modular pieces can be combined to create a wide variety of card layouts and styles.`,
      },
    },
  },
  render: () => <VariantsStory />,
};
