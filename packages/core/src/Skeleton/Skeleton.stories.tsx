import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvAvatar,
  HvSkeleton,
  HvTypography,
  type HvSkeletonProps,
} from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvSkeleton> = {
  title: "Components/Skeleton",
  component: HvSkeleton,
};
export default meta;

export const Main: StoryObj<HvSkeletonProps> = {
  args: {
    width: 150,
    hidden: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: ({ hidden, ...args }) => {
    return (
      <HvTypography>
        {!hidden ? <HvSkeleton {...args} /> : "This is my text"}
      </HvTypography>
    );
  },
};

export const Variants: StoryObj<HvSkeletonProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "The `HvSkeleton` component can have different variants to represent different shapes and sizes.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex flex-col gap-sm">
        <HvSkeleton variant="square" width={100} animation="wave">
          <HvTypography>Test</HvTypography>
        </HvSkeleton>

        <HvSkeleton variant="text" width={100} animation="wave">
          <HvTypography>Test</HvTypography>
        </HvSkeleton>

        <HvSkeleton variant="circle" animation="wave">
          <HvAvatar alt="Beatrice" src="https://i.imgur.com/bE7vg3N.png" />
        </HvSkeleton>
      </div>
    );
  },
};
