import { useState } from "react";
import {
  HvButton,
  HvInput,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import { HvBlade } from "@hitachivantara/uikit-react-lab";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Lab/Blades/Blade",
  component: HvBlade,
});

export const Main = meta.story({
  args: {
    label: "Show answer",
    labelVariant: "label",
    headingLevel: undefined,
    expanded: undefined,
    defaultExpanded: false,
    fullWidth: false,
    disabled: false,
    children: (
      <div style={{ padding: theme.spacing("xs") }}>
        To get to the other side
      </div>
    ),
  },
  argTypes: {
    classes: { control: { disable: true } },
    buttonProps: { control: { disable: true } },
    containerProps: { control: { disable: true } },
    children: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <>
        <HvTypography variant="label" component="h2">
          Question
        </HvTypography>
        <p style={{ marginBottom: 15 }}>Why did the chicken cross the road?</p>
        <div style={{ display: "flex" }}>
          <HvBlade
            {...args}
            containerProps={{ style: { whiteSpace: "nowrap" } }}
          />
        </div>
      </>
    );
  },
});

export const Variants = meta.story({
  render: () => {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <HvBlade label="Click me">
          <div style={{ whiteSpace: "nowrap", padding: theme.spacing("xs") }}>
            Boo!
          </div>
        </HvBlade>
        <HvBlade label="Default Expanded" labelVariant="title4" defaultExpanded>
          <div
            style={{
              whiteSpace: "nowrap",
              padding: theme.spacing("xs"),
            }}
          >
            Close me!
          </div>
        </HvBlade>
        <HvBlade label="Disabled" disabled>
          <div style={{ whiteSpace: "nowrap" }}>Content never shown</div>
        </HvBlade>
      </div>
    );
  },
});

export const Controlled = meta.story({
  render: () => {
    const [expandedState, setExpandedState] = useState(true);
    const handleToggle = (newState?: boolean) => {
      setExpandedState(newState ?? ((oldState) => !oldState));
    };

    return (
      <>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <HvButton variant="secondarySubtle" onClick={() => handleToggle()}>
            Toggle
          </HvButton>
          <HvButton
            variant="secondarySubtle"
            onClick={() => handleToggle(true)}
          >
            Open
          </HvButton>
          <HvButton
            variant="secondarySubtle"
            onClick={() => handleToggle(false)}
          >
            Close
          </HvButton>
        </div>
        <div style={{ display: "flex", maxHeight: 300 }}>
          <HvBlade
            label="Contact form"
            onChange={(e, state) => handleToggle(state)}
            expanded={expandedState}
            fullWidth
          >
            <form style={{ padding: theme.spacing("xs", "sm") }}>
              <HvInput label="Name" placeholder="Insert first name" required />
              <HvInput label="Email" placeholder="Insert your email" required />
              <HvInput label="Phone" placeholder="Insert your phone number" />
              <HvInput label="Extension" placeholder="Insert phone extension" />
              <HvInput label="Country" placeholder="Insert country name" />
              <HvInput
                label="City/Province"
                placeholder="Insert province name"
              />
            </form>
          </HvBlade>
        </div>
      </>
    );
  },
});
