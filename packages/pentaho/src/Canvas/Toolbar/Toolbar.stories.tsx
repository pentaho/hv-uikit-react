import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvButton } from "@hitachivantara/uikit-react-core";
import {
  HvCanvasToolbar,
  type HvCanvasToolbarProps,
} from "@hitachivantara/uikit-react-pentaho";

const meta: Meta<typeof HvCanvasToolbar> = {
  title: "Pentaho/Canvas/Toolbar",
  component: HvCanvasToolbar,
  decorators: [(Story) => <div className="h-54px">{Story()}</div>],
};
export default meta;

export const Main: StoryObj<HvCanvasToolbarProps> = {
  args: {
    title: "Toolbar Title",
  },
  argTypes: {
    backButton: { control: { disable: true } },
    classes: { control: { disable: true } },
    labels: { control: { disable: true } },
    backButtonProps: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvCanvasToolbar {...args} className="relative">
        <HvButton variant="primary">Save</HvButton>
        <HvButton variant="primaryGhost">Cancel</HvButton>
      </HvCanvasToolbar>
    );
  },
};
