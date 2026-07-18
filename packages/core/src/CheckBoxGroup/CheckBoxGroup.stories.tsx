/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvCheckBox,
  HvCheckBoxGroup,
  type HvCheckBoxGroupProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvCheckBoxGroup> = {
  title: "Components/Checkbox Group",
  component: HvCheckBoxGroup,
};

export default meta;

export const Main: StoryObj<HvCheckBoxGroupProps> = {
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
};

export const Variants: StoryObj<HvCheckBoxGroupProps> = {
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
};

export const Horizontal: StoryObj<HvCheckBoxGroupProps> = {
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
};
