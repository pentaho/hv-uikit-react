import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvProgressBar,
  HvTypography,
  type HvProgressBarProps,
} from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvProgressBar> = {
  title: "Components/Progress Bar",
  component: HvProgressBar,
  decorators: [(Story) => <div className="pl-sm">{Story()}</div>],
};
export default meta;

export const Main: StoryObj<HvProgressBarProps> = {
  args: {
    value: 0,
    hideLabel: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    labelProps: { control: { disable: true } },
    value: { control: { type: "range" } },
  },
  render: (args) => <HvProgressBar aria-label="Status" {...args} />,
};

export const Variants: StoryObj<HvProgressBarProps> = {
  decorators: [
    (Story) => (
      <div className="grid items-center gap-sm [&>span]:text-center">
        {Story()}
      </div>
    ),
  ],
  render: () => {
    return (
      <>
        <HvTypography variant="label">Start</HvTypography>
        <HvProgressBar value={0} aria-label="Example Determined Progress Bar" />
        <HvTypography variant="label">Success</HvTypography>
        <HvProgressBar
          value={100}
          status="completed"
          aria-label="Example Determined Progress Bar"
        />
        <HvTypography variant="label">Loading</HvTypography>
        <HvProgressBar
          value={40}
          aria-label="Example Determined Loading Progress Bar"
        />
        <HvTypography variant="label">Error</HvTypography>
        <HvProgressBar
          value={30}
          status="error"
          aria-label="Example Determined Error Progress Bar"
        />
      </>
    );
  },
};
