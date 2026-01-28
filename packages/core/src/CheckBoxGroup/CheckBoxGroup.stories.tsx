import { HvCheckBox, HvCheckBoxGroup } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Checkbox Group",
  component: HvCheckBoxGroup,
});

export const Main = meta.story({
  args: {
    showSelectAll: true,
    label: "Choose your favorite checkboxes",
    name: "favorite",
    description: "This is a checkbox group",
  },
  argTypes: {
    classes: { control: { disable: true } },
    value: { control: { disable: true } },
    defaultValue: { control: { disable: true } },
    status: { control: { disable: true } },
    statusMessage: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvCheckBoxGroup {...args}>
        <HvCheckBox label="Checkbox 1" value="1" />
        <HvCheckBox label="Checkbox 2" value="2" checked />
        <HvCheckBox label="Checkbox 3" value="3" />
      </HvCheckBoxGroup>
    );
  },
});

export const Variants = meta.story({
  decorators: [(Story) => <div className="flex gap-sm">{Story()}</div>],
  render: () => {
    return (
      <>
        <HvCheckBoxGroup showSelectAll required label="Required">
          <HvCheckBox label="Checkbox 1" value="1" />
          <HvCheckBox label="Checkbox 2" value="2" checked />
          <HvCheckBox label="Checkbox 3" value="3" />
        </HvCheckBoxGroup>
        <HvCheckBoxGroup showSelectAll disabled label="Disabled">
          <HvCheckBox label="Checkbox 1" value="1" />
          <HvCheckBox label="Checkbox 2" value="2" checked />
          <HvCheckBox label="Checkbox 3" value="3" />
        </HvCheckBoxGroup>
        <HvCheckBoxGroup showSelectAll readOnly label="Readonly">
          <HvCheckBox label="Checkbox 1" value="1" />
          <HvCheckBox label="Checkbox 2" value="2" checked />
          <HvCheckBox label="Checkbox 3" value="3" />
        </HvCheckBoxGroup>
        <HvCheckBoxGroup
          showSelectAll
          status="invalid"
          statusMessage="Oh no!"
          label="Invalid"
        >
          <HvCheckBox label="Checkbox 1" value="1" />
          <HvCheckBox label="Checkbox 2" value="2" checked />
          <HvCheckBox label="Checkbox 3" value="3" />
        </HvCheckBoxGroup>
      </>
    );
  },
});

export const Horizontal = meta.story({
  parameters: {
    docs: {
      description: { story: "Layout checkboxes horizontally." },
    },
  },
  render: () => {
    return (
      <HvCheckBoxGroup
        orientation="horizontal"
        label="Choose your favorite checkboxes"
        description="Horizontally, this time"
      >
        <HvCheckBox label="Checkbox 1" value="1" />
        <HvCheckBox label="Checkbox 2" value="2" checked />
        <HvCheckBox label="Checkbox 3" value="3" />
      </HvCheckBoxGroup>
    );
  },
});
