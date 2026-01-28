import { expect } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvTimePicker,
  HvTimePickerValue,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Time Picker",
  component: HvTimePicker,
});

export const Main = meta.story({
  args: {
    label: "Time Picker",
    description: "",
    placeholder: "Select a date",
    timeFormat: "24",
  },
  argTypes: {
    classes: { control: { disable: true } },
    value: { control: { disable: true } },
    defaultValue: { control: { disable: true } },
    dropdownProps: { control: { disable: true } },
  },
  decorators: [(Story) => <div className="min-h-200px w-200px">{Story()}</div>],
  render: (args) => {
    return <HvTimePicker {...args} />;
  },
});

export const Variants = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Time Pickers in their various form state variants. `defaultValue` is used to configure the _uncontrolled_ initial value.",
      },
    },
    ...setupChromatic("light"),
  },
  // For a11y
  play: async ({ canvas, userEvent }) => {
    const picker = canvas.getByRole("combobox", { name: /required/i });
    await userEvent.click(picker);
  },
  decorators: [
    (Story) => (
      <div className="flex flex-wrap gap-sm [&>*]:w-200px">{Story()}</div>
    ),
  ],
  render: () => {
    const value: HvTimePickerValue = { hours: 5, minutes: 30, seconds: 14 };

    return (
      <>
        <HvTimePicker required label="Required" defaultValue={value} />
        <HvTimePicker disabled label="Disabled" defaultValue={value} />
        <HvTimePicker readOnly label="Read-only" defaultValue={value} />
        <HvTimePicker
          label="Invalid"
          status="invalid"
          statusMessage="This is an invalid time"
          defaultValue={value}
        />
        <HvTimePicker
          showSeconds={false}
          label="Hide Seconds"
          defaultValue={value}
        />
      </>
    );
  },
});

export const Format12Hours = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Use the `timeFormat` prop to force either the 12-hour or 24-hour clock format.",
      },
    },
    ...setupChromatic(),
  },
  decorators: [(Story) => <div className="min-h-200px w-220px">{Story()}</div>],
  // For visual testing and a11y
  play: async ({ canvas, userEvent }) => {
    const picker = canvas.getByRole("combobox", { name: /time picker/i });
    await userEvent.click(picker);
    await expect(
      canvas.getByRole("button", { name: /pm/i }),
    ).toBeInTheDocument();
  },
  render: () => {
    return (
      <HvTimePicker
        timeFormat="12"
        label="Time Picker"
        defaultValue={{ hours: 19, minutes: 30, seconds: 14 }}
      />
    );
  },
});
