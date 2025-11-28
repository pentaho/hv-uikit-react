import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBaseRadio,
  HvRadio,
  HvRadioProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvRadio> = {
  title: "Components/Radio",
  component: HvRadio,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvBaseRadio },
};
export default meta;

export const Main: StoryObj<HvRadioProps> = {
  args: {
    name: "main",
    label: "Radio 1",
    value: "on",
    required: false,
    readOnly: false,
    disabled: false,
    checked: false,
    defaultChecked: false,
    semantic: false,
    status: "standBy",
    statusMessage: "This is Invalid",
  },
  argTypes: {
    classes: { control: { disable: true } },
    labelProps: { control: { disable: true } },
    inputProps: { control: { disable: true } },
  },
  render: (args) => {
    return <HvRadio {...args} />;
  },
};

export const Variants: StoryObj<HvRadioProps> = {
  decorators: [
    (Story) => <div className="flex flex-wrap gap-sm">{Story()}</div>,
  ],
  render: () => {
    return (
      <>
        <HvRadio name="radio" label="Radio" value="1" />
        <HvRadio required name="required" label="Required" value="1" />
        <HvRadio disabled name="disabled" label="Disabled" value="1" />
        <HvRadio readOnly name="readonly" label="Readonly" value="1" />
        <HvRadio
          status="invalid"
          statusMessage="Oh no!"
          name="invalid"
          label="Invalid"
          value="1"
        />
      </>
    );
  },
};

export const Test: StoryObj<HvRadioProps> = {
  render: () => (
    <>
      <HvRadio disabled label="Disabled" />
      <HvRadio disabled defaultChecked label="Disabled" />
      <HvRadio readOnly label="Readonly" />
      <HvRadio readOnly defaultChecked label="Readonly" />
      <HvRadio required label="Required" />
      <HvRadio required defaultChecked label="Required" />
      <HvRadio status="invalid" statusMessage="Oh no!" label="Invalid" />
      <HvRadio
        status="invalid"
        statusMessage="Oh no!"
        defaultChecked
        label="Invalid"
      />
      <HvRadio semantic label="Semantic" />
      <HvRadio semantic defaultChecked label="Semantic" />
      <HvRadio aria-label="radio" />
      <HvRadio defaultChecked aria-label="radio" />
      <HvRadio defaultChecked disabled aria-label="radio" />
      <HvRadio color="warning" aria-label="radio" />
      <HvRadio defaultChecked color="warning" aria-label="radio" />
      <HvRadio className="w-120px" label="Left" labelPosition="left" />
      <HvRadio
        className="w-120px"
        label="Right"
        labelPosition="right"
        defaultChecked
      />
    </>
  ),
};
