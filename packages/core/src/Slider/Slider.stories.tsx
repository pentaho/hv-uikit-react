import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvSlider, type HvSliderProps } from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvSlider> = {
  title: "Components/Slider",
  component: HvSlider,
  decorators: [(Story) => <div className="pt-md pb-md">{Story()}</div>],
};

export default meta;

export const Main: StoryObj<HvSliderProps> = {
  args: {
    label: "Failure Rate",
    hideInput: false,
    defaultValues: [10],
  },
  argTypes: {
    classes: { control: { disable: true } },
    sliderProps: { control: { disable: true } },
    status: { control: { disable: true } },
    statusMessage: { control: { disable: true } },
    values: { control: { disable: true } },
    knobProperties: { control: { disable: true } },
    markProperties: { control: { disable: true } },
    inputProps: { control: { disable: true } },
    knobProps: { control: { disable: true } },
  },
  render: (args) => {
    return <HvSlider {...args} />;
  },
};

export const Variants: StoryObj<HvSliderProps> = {
  parameters: {
    docs: {
      description: {
        story: "Sliders in their various state variants.",
      },
    },
  },
  decorators: [(Story) => <div className="grid gap-md">{Story()}</div>],
  render: () => {
    const values = [10];

    return (
      <>
        <HvSlider label="Default" defaultValues={values} />
        <HvSlider required label="Required" defaultValues={values} />
        <HvSlider disabled label="Disabled" defaultValues={values} />
        <HvSlider readOnly label="Read-only" defaultValues={values} />
        <HvSlider
          label="Invalid"
          status="invalid"
          statusMessage="Invalid because I said so"
          defaultValues={values}
        />
      </>
    );
  },
};

export const RangeVariants: StoryObj<HvSliderProps> = {
  parameters: {
    docs: {
      description: {
        story: "Range sliders in their various state variants.",
      },
    },
  },
  decorators: [(Story) => <div className="grid gap-md">{Story()}</div>],
  render: () => {
    const values = [10, 40];

    return (
      <>
        <HvSlider label="Default" defaultValues={values} />
        <HvSlider required label="Required" defaultValues={values} />
        <HvSlider disabled label="Disabled" defaultValues={values} />
        <HvSlider readOnly label="Read-only" defaultValues={values} />
        <HvSlider
          label="Invalid"
          status="invalid"
          statusMessage="Invalid because I said so"
          defaultValues={values}
        />
      </>
    );
  },
};
