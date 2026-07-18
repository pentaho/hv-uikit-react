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
  HvNumberInput,
  type HvNumberInputProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvNumberInput> = {
  title: "Components/Number Input",
  component: HvNumberInput,
};
export default meta;

export const Main: StoryObj<HvNumberInputProps> = {
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
};
