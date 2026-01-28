import { HvNumberInput } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Number Input",
  component: HvNumberInput,
});

export const Main = meta.story({
  args: {
    label: "Value",
    description: "Please enter a number",
    placeholder: "Enter a number here...",
    disabled: false,
    readOnly: false,
    required: true,
    status: "valid",
    statusMessage: "My status message",
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvNumberInput {...args} />;
  },
});
