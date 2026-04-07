import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvLabel, type HvLabelProps } from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvLabel> = {
  title: "Components/Form Element Blocks/Label",
  component: HvLabel,
};
export default meta;

export const Main: StoryObj<HvLabelProps> = {
  args: {
    label: "My label",
    required: true,
    disabled: false,
    htmlFor: "my-label",
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvLabel {...args} />;
  },
};
