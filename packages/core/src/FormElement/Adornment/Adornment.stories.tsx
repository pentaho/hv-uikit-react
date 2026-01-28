import { useState } from "react";
import { css } from "@emotion/css";
import {
  HvAdornment,
  HvBaseInput,
  HvButton,
  HvFormElement,
  HvFormStatus,
  HvLabel,
} from "@hitachivantara/uikit-react-core";
import {
  Fail,
  Preview,
  PreviewOff,
  Success,
} from "@hitachivantara/uikit-react-icons";

import preview from "../../../../../.storybook/preview";

const classes = {
  button: css({ width: "250px", height: "50px", margin: "10px" }),
};

const meta = preview.meta({
  title: "Components/Form Element Blocks/Adornment",
  component: HvAdornment,
});

export const Main = meta.story({
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
});

export const InputAdornment = meta.story({
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
});

export const DynamicAdornments = meta.story({
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
});
