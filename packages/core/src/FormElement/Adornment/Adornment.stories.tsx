import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvAdornment, type HvAdornmentProps } from "@pentaho/uikit-react-core";
import { Preview } from "@pentaho/uikit-react-icons";

const meta: Meta<typeof HvAdornment> = {
  title: "Components/Form Element Blocks/Adornment",
  component: HvAdornment,
};
export default meta;

export const Main: StoryObj<HvAdornmentProps> = {
  args: {
    showWhen: "valid",
    icon: <Preview />,
    isVisible: true,
    onClick: () => alert("Clicked the icon"),
  },
  argTypes: {
    classes: { control: { disable: true } },
    icon: { control: { disable: true } },
  },
  render: (args) => {
    return <HvAdornment {...args}>List</HvAdornment>;
  },
};
