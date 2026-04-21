import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvSimpleGrid,
  type HvSimpleGridProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvSimpleGrid> = {
  title: "Components/Simple Grid",
  component: HvSimpleGrid,
};
export default meta;

export const Main: StoryObj<HvSimpleGridProps> = {
  args: {
    spacing: "sm",
    cols: 2,
  },
  argTypes: {
    breakpoints: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvSimpleGrid {...args}>
        {[...Array(5).keys()].map((i) => (
          <div
            key={i}
            className="grid place-items-center text-textDark bg-infoDimmed min-h-80px"
          >
            {i + 1}
          </div>
        ))}
      </HvSimpleGrid>
    );
  },
};

export const BreakpointsGrid: StoryObj<HvSimpleGridProps> = {
  args: {
    spacing: "sm",
    cols: 2,
    breakpoints: [
      { minWidth: 980, cols: 3, spacing: "md" },
      { minWidth: 755, cols: 2, spacing: "sm" },
      { minWidth: 600, cols: 1, spacing: "sm" },
    ],
  },
  render: (args) => {
    return (
      <HvSimpleGrid {...args}>
        {[...Array(5).keys()].map((i) => (
          <div
            key={i}
            className="grid place-items-center text-textDark bg-infoDimmed min-h-80px"
          >
            {i + 1}
          </div>
        ))}
      </HvSimpleGrid>
    );
  },
};
