import { HvStepNavigation } from "@hitachivantara/uikit-react-lab";

import preview from "../../../../.storybook/preview";
import { HvDefaultNavigation, HvStep, HvStepProps } from "./DefaultNavigation";
import { HvDot, HvSimpleNavigation } from "./SimpleNavigation";

type StepType = Pick<
  HvStepProps,
  "state" | "title" | "onClick" | "className" | "disabled"
> & {
  separatorClassName?: string;
  titleClassName?: string;
};

const steps: StepType[] = [
  { title: "Completed", state: "Completed" },
  { title: "Failed", state: "Failed" },
  { title: "Pending", state: "Pending" },
  { title: "Current", state: "Current" },
  { title: "Enabled", state: "Enabled" },
  { title: "Disabled", state: "Disabled" },
];

const meta = preview.meta({
  title: "Lab/Step Navigation",
  component: HvStepNavigation,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: {
    HvDefaultNavigation,
    HvStep,
    HvSimpleNavigation,
    HvDot,
  } as unknown,
});

export const Main = meta.story({
  args: {
    type: "Default",
    steps,
    stepSize: undefined,
  },
  argTypes: {
    classes: { control: { disable: true } },
    steps: { control: { disable: true } },
  },
  render: (args) => <HvStepNavigation {...args} />,
});

export const Variants = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Variants of the step navigation component with titles and with tooltips shown on hover.",
      },
    },
  },
  decorators: [(Story) => <div className="grid gap-lg">{Story()}</div>],
  render: () => (
    <div className="flex flex-col gap-md">
      <HvStepNavigation
        type="Default"
        steps={steps}
        aria-label="Default step navigation with tooltip"
      />
      <HvStepNavigation
        type="Simple"
        steps={steps}
        aria-label="Simple step navigation"
      />
      <HvStepNavigation
        type="Default"
        steps={steps}
        showTitles={false}
        aria-label="Default step navigation"
      />
      <HvStepNavigation
        type="Simple"
        steps={steps}
        showTitles={false}
        aria-label="Simple step navigation with tooltip"
      />
    </div>
  ),
});

export const Width = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Example of a step navigation with a customized width for each breakpoint ('200px', '400px', '600px', '800px', '1000px').",
      },
    },
  },
  render: () => (
    <HvStepNavigation
      steps={steps}
      width={{
        xs: 200,
        sm: 400,
        md: 600,
        lg: 800,
        xl: 1000,
      }}
    />
  ),
});
