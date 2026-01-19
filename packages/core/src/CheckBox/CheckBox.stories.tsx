import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import {
  HvBaseCheckBox,
  HvCheckBox,
  HvCheckBoxProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvCheckBox> = {
  title: "Components/Checkbox",
  component: HvCheckBox,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvBaseCheckBox },
  decorators: [
    (Story) => (
      <div className="flex flex-wrap items-center gap-xs">{Story()}</div>
    ),
  ],
};

export default meta;

export const Main: StoryObj<HvCheckBoxProps> = {
  args: { label: "Checkbox 0" },
  argTypes: {
    classes: { control: { disable: true } },
    statusMessage: { control: { disable: true } },
    status: { control: { disable: true } },
    labelProps: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <>
        <HvCheckBox {...args} />
        <HvCheckBox label="Checkbox 1" />
        <HvCheckBox defaultChecked label="Checkbox 2" />
        <HvCheckBox indeterminate label="Checkbox 3" />
      </>
    );
  },
};

export const Test: StoryObj<HvCheckBoxProps> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("anchor"));
    const checkbox = canvas.getByRole("checkbox", { name: /left/i });
    expect(checkbox).toBeChecked();
  },
  render: () => (
    <>
      <HvCheckBox disabled label="Checkbox 1" />
      <HvCheckBox defaultChecked disabled label="Checkbox 2" />
      <HvCheckBox indeterminate disabled label="Checkbox 3" />
      <HvCheckBox readOnly label="Checkbox 1" />
      <HvCheckBox defaultChecked readOnly label="Checkbox 2" />
      <HvCheckBox indeterminate readOnly label="Checkbox 3" />
      <HvCheckBox required label="Checkbox 1" />
      <HvCheckBox required defaultChecked label="Checkbox 2" />
      <HvCheckBox required indeterminate label="Checkbox 3" />
      <HvCheckBox
        status="invalid"
        statusMessage="No way for this to be valid!"
        label="Checkbox 1"
      />
      <HvCheckBox
        status="invalid"
        statusMessage="No way for this to be valid!"
        defaultChecked
        label="Checkbox 2"
      />
      <HvCheckBox
        status="invalid"
        statusMessage="No way for this to be valid!"
        indeterminate
        label="Checkbox 3"
      />
      <HvCheckBox
        className="w-120px"
        label={
          <div className="flex justify-between">
            <span className="size-10px" data-testid="anchor" />
            Left
          </div>
        }
        labelPosition="left"
      />
      <HvCheckBox
        className="w-120px"
        label="Right"
        labelPosition="right"
        defaultChecked
      />
      <div>
        <HvCheckBox aria-label="Checkbox" />
        <HvCheckBox defaultChecked aria-label="Checkbox" />
        <HvCheckBox indeterminate aria-label="Checkbox" />
        <HvCheckBox semantic aria-label="Checkbox" />
        <HvCheckBox semantic defaultChecked aria-label="Checkbox" />
        <HvCheckBox semantic indeterminate aria-label="Checkbox" />
        <HvCheckBox color="warning" aria-label="Checkbox" />
        <HvCheckBox defaultChecked color="warning" aria-label="Checkbox" />
        <HvCheckBox defaultChecked color="purple" aria-label="Checkbox" />
      </div>
    </>
  ),
};
