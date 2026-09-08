import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvWarningText,
  type HvWarningTextProps,
} from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvWarningText> = {
  title: "Components/Form Element Blocks/Warning Text",
  component: HvWarningText,
  decorators: [(storyFn) => <div style={{ width: "400px" }}>{storyFn()}</div>],
};
export default meta;

export const Main: StoryObj<HvWarningTextProps> = {
  args: {
    isVisible: true,
    disabled: false,
    disableAdornment: false,
    disableBorder: false,
    disableGutter: false,
    hideText: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvWarningText {...args}>List</HvWarningText>;
  },
};
