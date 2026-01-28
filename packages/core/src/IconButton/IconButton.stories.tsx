import {
  HvIconButton,
  HvIconButtonProps,
  theme,
} from "@hitachivantara/uikit-react-core";
import {
  Add,
  Delete,
  Download,
  DropLeft,
} from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Icon Button",
  component: HvIconButton,
});

export const Main = meta.story({
  args: {
    title: "Download",
  },
  argTypes: {
    tooltipProps: { control: { disable: true } },
    component: { control: { disable: true } },
    ref: { control: { disable: true } },
  },
  render: (args) => (
    <HvIconButton {...(args as HvIconButtonProps)}>
      <Download />
    </HvIconButton>
  ),
});

export const Disabled = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "For accessibility purposes, when disabled the button will be focusable and the tooltip will be shown when the button is hovered.",
      },
    },
  },
  render: () => (
    <HvIconButton disabled title="Add">
      <Add />
    </HvIconButton>
  ),
});

export const Variants = meta.story({
  decorators: [
    (Story) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: theme.space.sm }}>
        {Story()}
      </div>
    ),
  ],
  render: () => (
    <>
      <HvIconButton title="Go back" variant="primary">
        <DropLeft />
      </HvIconButton>
      <HvIconButton title="Add" variant="primaryGhost">
        <Add />
      </HvIconButton>
      <HvIconButton title="Delete" size="xl" variant="secondarySubtle">
        <Delete />
      </HvIconButton>
      <HvIconButton title="Download" variant="primarySubtle" size="xl" disabled>
        <Download />
      </HvIconButton>
    </>
  ),
});
