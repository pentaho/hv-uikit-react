import preview from "../../../../../.storybook/preview";
import { HvCharCounter } from "./CharCounter";

const meta = preview.meta({
  title: "Components/Form Element Blocks/Char Counter",
  component: HvCharCounter,
  decorators: [
    (Story) => (
      <div style={{ display: "flex", flexDirection: "row" }}>{Story()}</div>
    ),
  ],
});

export const Main = meta.story({
  args: {
    separator: "/",
    maxCharQuantity: 20,
    currentCharQuantity: 5,
    disabled: false,
    disableGutter: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvCharCounter {...args}>List</HvCharCounter>;
  },
});
