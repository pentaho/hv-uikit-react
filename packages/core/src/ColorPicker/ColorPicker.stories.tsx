import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvColorPicker,
  type HvColorPickerProps,
} from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvColorPicker> = {
  title: "Components/Color Picker",
  component: HvColorPicker,
};
export default meta;

export const Main: StoryObj<HvColorPickerProps> = {
  args: {
    label: "Color",
    showSavedColors: true,
    showCustomColors: true,
  },
  argTypes: {
    classes: { control: { disable: true } },
    description: { control: { disable: true } },
    "aria-label": { table: { disable: true } },
    "aria-describedby": { table: { disable: true } },
    "aria-labelledby": { table: { disable: true } },
  },
  render: (args) => {
    return (
      <HvColorPicker
        onChangeComplete={(value) => console.log(value)}
        {...args}
      />
    );
  },
};

export const Test: StoryObj = {
  decorators: [(Story) => <div className="flex gap-xs">{Story()}</div>],
  render: () => (
    <>
      <HvColorPicker className="w-268px" label="Color" defaultExpanded />
      <HvColorPicker
        className="w-134px"
        label="Color"
        showSavedColors={false}
        showCustomColors={false}
        defaultValue="#F6941E"
        defaultExpanded
      />
      <HvColorPicker label="Color" iconOnly />
      <HvColorPicker label="Color" iconOnly defaultValue="#59941B" />
    </>
  ),
};
