import { useState } from "react";
import {
  HvButton,
  HvMultiButton,
  HvSimpleGrid,
} from "@hitachivantara/uikit-react-core";
import { Abacus, LocationPin, Map } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";
import { SplitButton as SplitButtonStory } from "./stories/SplitButton";
import { VerticalOrientation as VerticalOrientationStory } from "./stories/VerticalOrientation";

const meta = preview.meta({
  title: "Components/Multi Button",
  component: HvMultiButton,
});

export const Main = meta.story({
  args: {
    disabled: false,
    vertical: false,
    size: undefined,
  },
  argTypes: {
    classes: { control: { disable: true } },
    variant: { control: { disable: true } },
  },
  render: (args) => {
    const [val, setVal] = useState(1);

    return (
      <HvMultiButton style={{ width: "400px" }} {...args}>
        <HvButton
          startIcon={<Map />}
          selected={val === 0}
          onClick={() => setVal(0)}
        >
          Map
        </HvButton>
        <HvButton
          selected={val === 1}
          onClick={() => setVal(1)}
          startIcon={<LocationPin />}
        >
          Satellite
        </HvButton>
        <HvButton
          startIcon={<Abacus />}
          selected={val === 2}
          onClick={() => setVal(2)}
        >
          Abacus
        </HvButton>
      </HvMultiButton>
    );
  },
});

export const VerticalOrientation = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "MultiButton combinations with **vertical orientation** and **multiple selection**.",
      },
    },
  },
  render: () => <VerticalOrientationStory />,
});

export const SplitButton = meta.story({
  parameters: {
    docs: {
      description: {
        story: "MultiButton component used to create a **Split Button**.",
      },
    },
  },
  render: () => <SplitButtonStory />,
});

export const Test = meta.story({
  render: () => (
    <>
      <SplitButtonStory />
      <br />
      <HvSimpleGrid
        cols={3}
        style={{ alignItems: "start", justifyContent: "start" }}
      >
        <div className="grid gap-xs">
          <HvMultiButton>
            <HvButton>Label 1</HvButton>
            <HvButton>Label 2</HvButton>
            <HvButton>Label 3</HvButton>
          </HvMultiButton>
          <HvMultiButton>
            <HvButton selected>Label 1</HvButton>
            <HvButton selected>Label 2</HvButton>
            <HvButton>Label 3</HvButton>
          </HvMultiButton>
          <HvMultiButton size="sm">
            <HvButton selected>Label 1</HvButton>
            <HvButton disabled>Label 2</HvButton>
            <HvButton>Label 3</HvButton>
          </HvMultiButton>
          <HvMultiButton size="lg">
            <HvButton selected>Label 1</HvButton>
            <HvButton disabled>Label 2</HvButton>
            <HvButton>Label 3</HvButton>
          </HvMultiButton>
        </div>
        <div className="grid gap-xs">
          <HvMultiButton disabled>
            {["Label 1", "Label 2", "Label 3"].map((button) => (
              <HvButton key={button}>{button}</HvButton>
            ))}
          </HvMultiButton>
          <HvMultiButton disabled>
            {["Label 1", "Label 2", "Label 3"].map((button, i) => (
              <HvButton key={button} selected={i === 2}>
                {button}
              </HvButton>
            ))}
          </HvMultiButton>
          <HvMultiButton>
            {["Label 1", "Label 2", "Label 3", "Label 4"].map((button, i) => (
              <HvButton
                key={button}
                selected={i === 0}
                disabled={i === 2}
                endIcon={<LocationPin />}
              >
                {button}
              </HvButton>
            ))}
          </HvMultiButton>
          <div className="flex flex-1 [&>*]:flex-1 gap-xs">
            <HvMultiButton style={{ width: "fit-content" }}>
              {["Label 1", "Label 2", "Label 3", "Label 4"].map((name, i) => (
                <HvButton
                  key={name}
                  icon
                  aria-label={name}
                  selected={i === 1}
                  disabled={i === 2}
                >
                  <LocationPin />
                </HvButton>
              ))}
            </HvMultiButton>
            <HvMultiButton>
              <HvButton>Label 1</HvButton>
            </HvMultiButton>
            <HvMultiButton>
              <HvButton selected>Label 1</HvButton>
            </HvMultiButton>
            <HvMultiButton>
              <HvButton disabled>Label 1</HvButton>
            </HvMultiButton>
          </div>
        </div>
        <div className="flex gap-xs items-start">
          <HvMultiButton vertical style={{ width: "120px" }}>
            {["Label 1", "Label 2", "Label 3", "Label 4"].map((button) => (
              <HvButton key={button}>{button}</HvButton>
            ))}
          </HvMultiButton>
          <HvMultiButton vertical style={{ width: "120px" }}>
            {["Label 1", "Label 2", "Label 3", "Label 4"].map((button, i) => (
              <HvButton
                key={button}
                selected={i === 0 || i === 2}
                startIcon={<LocationPin />}
              >
                {button}
              </HvButton>
            ))}
          </HvMultiButton>
          <HvMultiButton vertical style={{ width: "fit-content" }}>
            {["Label 1", "Label 2", "Label 3", "Label 4"].map((name, i) => (
              <HvButton
                key={name}
                icon
                aria-label={name}
                selected={i === 1 || i === 2}
              >
                <LocationPin />
              </HvButton>
            ))}
          </HvMultiButton>
        </div>
      </HvSimpleGrid>
    </>
  ),
});
