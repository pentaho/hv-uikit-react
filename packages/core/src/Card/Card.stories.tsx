import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  HvTypography,
  type HvCardProps,
} from "@pentaho/uikit-react-core";
import { Level2Average } from "@pentaho/uikit-react-icons";

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
  render: (args) => (
    <HvCard style={{ width: 360 }} {...args}>
      <HvCardHeader
        title="Asset Avatar L90"
        subheader="Compressor"
        icon={<Level2Average color={args?.statusColor} />}
      />
      <HvCardMedia
        component="img"
        alt="Compressor"
        height={140}
        image="https://i.imgur.com/bxPPTD3.png"
      />
      <HvCardContent>
        <div style={{ paddingTop: "20px" }}>
          <HvTypography variant="label">ID</HvTypography>
          <HvTypography>2101cad3-7cd4-1000-bdp95-d8c497176e7c</HvTypography>
        </div>
        <div style={{ marginTop: "20px" }}>
          <HvTypography variant="label">Last connected</HvTypography>
          <HvTypography>Aug 30, 2017 12:27:53 PM</HvTypography>
        </div>
      </HvCardContent>
    </HvCard>
  ),
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
