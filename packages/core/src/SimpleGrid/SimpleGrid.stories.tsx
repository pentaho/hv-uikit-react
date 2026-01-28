import { HvSimpleGrid } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Simple Grid",
  component: HvSimpleGrid,
});

export const Main = meta.story({
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
});

export const BreakpointsGrid = meta.story({
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
});
