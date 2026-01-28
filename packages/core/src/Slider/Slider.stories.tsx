import { useState } from "react";

import preview from "../../../../.storybook/preview";
import { HvSlider } from "./Slider";

const meta = preview.meta({
  title: "Components/Slider",
  component: HvSlider,
  decorators: [(Story) => <div className="pt-md pb-md">{Story()}</div>],
});

export const Main = meta.story({
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
});

export const Variants = meta.story({
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
});

export const RangeVariants = meta.story({
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
});

export const FormattedMark = meta.story({
  parameters: {
    docs: {
      description: {
        story: "A slider with a formatted mark to show the Cº unit.",
      },
    },
  },
  render: () => {
    return (
      <HvSlider
        label="Temperature"
        formatMark={(mark) => `${mark} Cº`}
        defaultValues={[10]}
      />
    );
  },
});

export const DecimalValues = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "A slider with decimal values that illustrates how to use a scale other than 0 to 100.",
      },
    },
  },
  render: () => {
    return (
      <HvSlider
        minPointValue={0.01}
        maxPointValue={1}
        markStep={10}
        divisionQuantity={100}
        hideInput
        markDigits={2}
      />
    );
  },
});

export const CustomValues = meta.story({
  parameters: {
    docs: {
      description: {
        story: "A slider with custom values.",
      },
    },
  },
  render: () => {
    const [values, setValues] = useState([3]);
    const formattedLabel = (label: React.ReactNode) => {
      const labels = ["Very Low", "Low", "Medium", "High", "Very High"];
      return labels[Number(label) - 1];
    };

    return (
      <HvSlider
        minPointValue={1}
        maxPointValue={5}
        markStep={1}
        values={values}
        onChange={setValues}
        divisionQuantity={4}
        hideInput
        formatMark={(label) => formattedLabel(label)}
        formatTooltip={(label) => formattedLabel(label)}
      />
    );
  },
});
