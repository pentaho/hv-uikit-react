import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvTagsInput, type HvTagsInputProps } from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvTagsInput> = {
  title: "Components/Tags Input",
  component: HvTagsInput,
  decorators: [
    (storyFn) => <div style={{ maxWidth: "600px" }}>{storyFn()}</div>,
  ],
};
export default meta;

export const Main: StoryObj<HvTagsInputProps> = {
  args: {
    label: "Enter your tags",
    description: "This is where you enter your tags",
    placeholder: "Enter value",
    disabled: false,
    readOnly: false,
    required: false,
    multiline: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    inputProps: { control: { disable: true } },
    countCharProps: { control: { disable: true } },
    suggestionListCallback: { control: { disable: true } },
  },
  render: (args) => {
    return <HvTagsInput {...args} />;
  },
};

export const Variants: StoryObj<HvTagsInputProps> = {
  decorators: [(Story) => <div className="grid gap-sm">{Story()}</div>],
  render: () => {
    return (
      <>
        <HvTagsInput
          label="Required"
          placeholder="Enter value"
          required
          value={[{ label: "tag 1" }, { label: "tag 2" }, { label: "tag 3" }]}
        />
        <HvTagsInput
          label="Disabled"
          placeholder="Enter value"
          disabled
          value={[
            { label: "tag 4", disabled: true },
            { label: "tag 5", disabled: true },
            { label: "tag 6", disabled: true },
          ]}
        />
        <HvTagsInput
          label="Readonly"
          placeholder="Enter value"
          readOnly
          value={[{ label: "tag 7" }, { label: "tag 8" }, { label: "tag 9" }]}
        />
        <HvTagsInput
          label="Invalid"
          placeholder="Enter value"
          status="invalid"
          statusMessage="Oh no!"
          value={[
            { label: "tag 10" },
            { label: "tag 11" },
            { label: "tag 12" },
          ]}
        />
      </>
    );
  },
};
