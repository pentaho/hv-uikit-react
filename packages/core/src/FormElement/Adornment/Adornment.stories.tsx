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
import { useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvAdornment,
  HvBaseInput,
  HvButton,
  HvFormElement,
  HvLabel,
  type HvAdornmentProps,
  type HvFormStatus,
} from "@hitachivantara/uikit-react-core";
import {
  Fail,
  Preview,
  PreviewOff,
  Success,
} from "@hitachivantara/uikit-react-icons";

const classes = {
  button: css({ width: "250px", height: "50px", margin: "10px" }),
};

const meta: Meta<typeof HvAdornment> = {
  title: "Components/Form Element Blocks/Adornment",
  component: HvAdornment,
};
export default meta;

export const Main: StoryObj<HvAdornmentProps> = {
  args: {
    showWhen: "valid",
    icon: <Preview />,
    isVisible: true,
    onClick: () => alert("Clicked the icon"),
  },
  argTypes: {
    classes: { control: { disable: true } },
    icon: { control: { disable: true } },
  },
  render: (args) => {
    return <HvAdornment {...args}>List</HvAdornment>;
  },
};

export const InputAdornment: StoryObj<HvAdornmentProps> = {
  render: () => {
    const [isPassword, setPasswordType] = useState(true);
    const toggleType = () => {
      setPasswordType(!isPassword);
    };

    return (
      <HvFormElement status="standBy">
        <HvLabel id="controlled-input-label" label="Password">
          <HvBaseInput
            id="controlled-input"
            defaultValue="p455w0rd"
            type={isPassword ? "password" : "text"}
            placeholder="Insert your password"
            endAdornment={
              <HvAdornment
                aria-label="show password"
                icon={isPassword ? <Preview /> : <PreviewOff />}
                onClick={toggleType}
              />
            }
          />
        </HvLabel>
      </HvFormElement>
    );
  },
};

export const DynamicAdornments: StoryObj<HvAdornmentProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Adornment showcasing the ability to react to the form element status.",
      },
    },
  },
  render: () => {
    const [status, setStatus] = useState<HvFormStatus>("valid");

    return (
      <>
        <HvFormElement status={status}>
          <HvLabel label="First name">
            <HvBaseInput
              id="valid-controlled-input"
              defaultValue="content"
              placeholder="Insert your name"
              endAdornment={
                <>
                  <HvAdornment
                    showWhen="invalid"
                    icon={<Fail color="negative" />}
                  />
                  <HvAdornment
                    showWhen="valid"
                    icon={<Success color="positive" />}
                  />
                </>
              }
            />
          </HvLabel>
        </HvFormElement>
        <HvButton
          className={classes.button}
          onClick={() => {
            setStatus("valid");
          }}
        >
          Set valid
        </HvButton>
        <HvButton
          className={classes.button}
          onClick={() => {
            setStatus("invalid");
          }}
        >
          Set invalid
        </HvButton>
      </>
    );
  },
};
