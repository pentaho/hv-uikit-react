import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvCanvasSidePanel,
  HvCanvasSidePanelProps,
} from "@hitachivantara/uikit-react-pentaho";

const meta: Meta<typeof HvCanvasSidePanel> = {
  title: "Pentaho/Canvas/Side Panel",
  component: HvCanvasSidePanel,
};
export default meta;

export const Main: StoryObj<HvCanvasSidePanelProps> = {
  args: { defaultOpen: true },
  argTypes: {
    classes: { control: { disable: true } },
    tabs: { control: { disable: true } },
    tab: { control: { disable: true } },
    labels: { control: { disable: true } },
    children: { control: { disable: true } },
  },

  render: (args) => (
    <div className="w-full h-lg bg-bgPage relative">
      <HvCanvasSidePanel {...args}>Some content</HvCanvasSidePanel>
      <p>Main content</p>
    </div>
  ),
};
