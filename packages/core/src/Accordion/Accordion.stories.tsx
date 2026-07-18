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
  HvAccordion,
  HvListContainer,
  HvListItem,
  type HvAccordionProps,
} from "@hitachivantara/uikit-react-core";

const classes = {
  listContainer: "[&>li]:pl-32px",
  formContainer: "px-32px [&>*]:mb-sm",
};

const meta: Meta<typeof HvAccordion> = {
  title: "Components/Accordion",
  component: HvAccordion,
};
export default meta;

export const Main: StoryObj<HvAccordionProps> = {
  args: {
    label: "Analytics",
    headingLevel: 1,
    disabled: false,
    defaultExpanded: false,
    labelVariant: "label",
  },
  argTypes: {
    classes: { control: { disable: true } },
    containerProps: { control: { disable: true } },
    children: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvAccordion {...args}>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Views</HvListItem>
          <HvListItem>Parameters</HvListItem>
        </HvListContainer>
      </HvAccordion>
    );
  },
};

export const Disabled: StoryObj<HvAccordionProps> = {
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <HvAccordion label="Analytics" headingLevel={3} disabled>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Views</HvListItem>
          <HvListItem>Parameters</HvListItem>
        </HvListContainer>
      </HvAccordion>
      <HvAccordion label="System" headingLevel={3}>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Settings</HvListItem>
          <HvListItem>Network</HvListItem>
        </HvListContainer>
      </HvAccordion>
      <HvAccordion label="Data" headingLevel={3} disabled>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Storage</HvListItem>
          <HvListItem>Memory</HvListItem>
        </HvListContainer>
      </HvAccordion>
    </div>
  ),
};
