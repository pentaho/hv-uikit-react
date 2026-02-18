import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvOverflowTooltip,
  HvOverflowTooltipProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvOverflowTooltip> = {
  title: "Components/Overflow Tooltip",
  component: HvOverflowTooltip,
};
export default meta;

export const Main: StoryObj<HvOverflowTooltipProps> = {
  args: {
    open: true,
    placement: "top",
    data: "This is a very long text that should be cut because it so long that it doesn't fit",
    paragraphOverflow: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center mx-auto h-200px max-w-200px">
        {Story()}
      </div>
    ),
  ],
  render: (args) => {
    return <HvOverflowTooltip {...args} />;
  },
};

const makeText = (str: string) =>
  `This is a ${str} long text that should be cut because it doesn't fit`;

export const Test: StoryObj<HvOverflowTooltipProps> = {
  args: {
    data: makeText("extremely ".repeat(12)),
  },
  decorators: [
    (Story) => (
      <div className="grid gap-xs p-xs w-400px bg-infoDimmed overflow-auto resize">
        {Story()}
      </div>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByTestId("test"));
  },
  render: (args) => {
    return (
      <>
        <HvOverflowTooltip {...args} data={makeText("")} />
        <HvOverflowTooltip paragraphOverflow {...args} />
        <HvOverflowTooltip data-testid="test" {...args} placement="bottom" />
      </>
    );
  },
};
