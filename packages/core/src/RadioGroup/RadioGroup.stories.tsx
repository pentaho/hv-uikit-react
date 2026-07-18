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
  HvRadio,
  HvRadioGroup,
  type HvRadioGroupProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvRadioGroup> = {
  title: "Components/Radio Group",
  component: HvRadioGroup,
};

export default meta;

export const Main: StoryObj<HvRadioGroupProps> = {
  args: {
    label: "Choose your favorite radio button",
    name: "favorite",
    description: "",
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
      <HvRadioGroup {...args}>
        <HvRadio label="Radio 1" value="1" />
        <HvRadio label="Radio 2" value="2" checked />
        <HvRadio label="Radio 3" value="3" />
      </HvRadioGroup>
    );
  },
};

export const Variants: StoryObj<HvRadioGroupProps> = {
  decorators: [
    (Story) => <div className="flex flex-wrap justify-around">{Story()}</div>,
  ],
  render: () => {
    return (
      <>
        <HvRadioGroup required label="Required">
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>
        <HvRadioGroup disabled label="Disabled">
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>
        <HvRadioGroup readOnly label="Readonly">
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>
        <HvRadioGroup status="invalid" statusMessage="Oh no!" label="Invalid">
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>
      </>
    );
  },
};

export const Horizontal: StoryObj<HvRadioGroupProps> = {
  parameters: {
    docs: {
      description: { story: "Layout radio buttons horizontally." },
    },
  },
  render: () => {
    return (
      <HvRadioGroup
        orientation="horizontal"
        label="Choose your favorite radio button"
        description="Horizontally, this time"
      >
        <HvRadio label="Radio 1" value="1" />
        <HvRadio label="Radio 2" value="2" checked />
        <HvRadio label="Radio 3" value="3" />
      </HvRadioGroup>
    );
  },
};
