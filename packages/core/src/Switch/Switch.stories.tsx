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
import { useRef, useState } from "react";
import { css } from "@emotion/css";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBaseSwitch,
  HvInfoMessage,
  HvLabel,
  HvSwitch,
  type HvSwitchProps,
} from "@hitachivantara/uikit-react-core";

const decorator: Decorator = (Story) => (
  <div className="flex flex-wrap items-center gap-md">{Story()}</div>
);

const meta: Meta<typeof HvSwitch> = {
  title: "Components/Switch",
  component: HvSwitch,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvBaseSwitch },
};

export default meta;

export const Main: StoryObj<HvSwitchProps> = {
  args: {
    size: "small",
    value: "on",
    label: "Main Switch",
    required: false,
    readOnly: false,
    disabled: false,
    checked: false,
    defaultChecked: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    labelProps: { control: { disable: true } },
    status: { control: { disable: true } },
    inputProps: { control: { disable: true } },
  },
  render: (args) => {
    return <HvSwitch {...args} />;
  },
};

export const Variants: StoryObj<HvSwitchProps> = {
  decorators: [decorator],
  render: () => {
    const styles = {
      group: "flex items-end",
    };

    return (
      <>
        <div className={styles.group}>
          <HvSwitch required aria-label="Engine 1" label="Required" />
          <HvSwitch defaultChecked required aria-label="Engine 2" />
        </div>
        <div className={styles.group}>
          <HvSwitch disabled aria-label="Engine 1" label="Disabled" />
          <HvSwitch defaultChecked disabled aria-label="Engine 2" />
        </div>
        <div className={styles.group}>
          <HvSwitch readOnly aria-label="Engine 1" label="Readonly" />
          <HvSwitch defaultChecked readOnly aria-label="Engine 2" />
        </div>
        <div className={styles.group}>
          <HvSwitch
            status="invalid"
            statusMessage="On no!"
            aria-label="Engine 1"
            label="Invalid"
          />
          <HvSwitch
            defaultChecked
            status="invalid"
            statusMessage="On no!"
            aria-label="Engine 2"
          />
        </div>
        <div className={styles.group}>
          <HvSwitch label="Left" labelPosition="left" defaultChecked />
        </div>
        <div className={styles.group}>
          <HvSwitch label="Right" labelPosition="right" />
        </div>
      </>
    );
  },
};

export const WithLabels: StoryObj<HvSwitchProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Sample showing usage of custom switch labels and description, built using `HvBaseSwitch`. The labels can also be clicked to trigger the switch",
      },
    },
  },
  render: () => {
    const inputRef = useRef<HTMLButtonElement>(null);

    const ToggleLabel = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        aria-hidden
        style={{ cursor: "pointer" }}
        onClick={() => inputRef.current?.click()}
        {...props}
      />
    );

    return (
      <>
        <div className={css({ display: "flex", alignItems: "flex-start" })}>
          <HvLabel
            id="switch-label"
            label="Engine Control"
            htmlFor="switch-input"
          />
          <HvInfoMessage id="switch-description">
            This is a custom description
          </HvInfoMessage>
        </div>
        <div className={css({ display: "flex", alignItems: "center", gap: 8 })}>
          <ToggleLabel>Off</ToggleLabel>
          <HvBaseSwitch inputRef={inputRef} id="switch-input" defaultChecked />
          <ToggleLabel>On</ToggleLabel>
        </div>
      </>
    );
  },
};

export const LabelPosition: StoryObj<HvSwitchProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "The label can be positioned in different locations relative to the switch using the `labelPosition` prop. Available options are `top` (default), `left`, and `right`.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex flex-col gap-lg">
        <div className="flex flex-col gap-sm">
          <h4>Label on Top (default)</h4>
          <HvSwitch label="Engine Control" labelPosition="top" defaultChecked />
        </div>
        <div className="flex flex-col gap-sm">
          <h4>Label on Left</h4>
          <HvSwitch
            label="Engine Control"
            labelPosition="left"
            defaultChecked
          />
        </div>
        <div className="flex flex-col gap-sm">
          <h4>Label on Right</h4>
          <HvSwitch
            label="Engine Control"
            labelPosition="right"
            defaultChecked
          />
        </div>
        <div className="flex flex-col gap-sm">
          <h4>Multiple switches with different positions</h4>
          <div className="flex flex-wrap gap-lg">
            <HvSwitch label="Top Position" labelPosition="top" />
            <HvSwitch label="Left Position" labelPosition="left" />
            <HvSwitch label="Right Position" labelPosition="right" />
          </div>
        </div>
      </div>
    );
  },
};

export const WithCustomColors: StoryObj<HvSwitchProps> = {
  parameters: {
    docs: {
      description: { story: "With custom colors." },
    },
  },
  decorators: [decorator],
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <HvSwitch
        checked={checked}
        aria-label="Engine Control"
        onChange={(_evt, newChecked) => setChecked(newChecked)}
        color={checked ? "positive" : "negative"}
      />
    );
  },
};
