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
  HvInfoMessage,
  type HvInfoMessageProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvInfoMessage> = {
  title: "Components/Form Element Blocks/Info Message",
  component: HvInfoMessage,
};
export default meta;

export const Main: StoryObj<HvInfoMessageProps> = {
  args: {
    disabled: false,
    disableGutter: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvInfoMessage {...args}>Info Message</HvInfoMessage>;
  },
};

export const DisabledInfoMessage: StoryObj<HvInfoMessageProps> = {
  parameters: {
    docs: {
      description: {
        story: "Info message showcasing the disabled state.",
      },
    },
  },
  render: () => {
    return (
      <HvInfoMessage id="infoMessage-disabled" disabled>
        Info message
      </HvInfoMessage>
    );
  },
};
