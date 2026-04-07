import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvCharCounter,
  type HvCharCounterProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvCharCounter> = {
  title: "Components/Form Element Blocks/Char Counter",
  component: HvCharCounter,
  decorators: [
    (Story) => (
      <div style={{ display: "flex", flexDirection: "row" }}>{Story()}</div>
    ),
  ],
};
export default meta;

export const Main: StoryObj<HvCharCounterProps> = {
  args: {
    separator: "/",
    maxCharQuantity: 20,
    currentCharQuantity: 5,
    disabled: false,
    disableGutter: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvCharCounter {...args}>List</HvCharCounter>;
  },
};
