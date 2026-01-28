import { HvLabel } from "@hitachivantara/uikit-react-core";

import preview from "../../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Form Element Blocks/Label",
  component: HvLabel,
});

export const Main = meta.story({
  args: {
    label: "My label",
    required: true,
    disabled: false,
    htmlFor: "my-label",
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvLabel {...args} />;
  },
});
