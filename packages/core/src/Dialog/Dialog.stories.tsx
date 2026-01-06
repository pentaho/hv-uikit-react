import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { expect, userEvent, within } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogProps,
  HvDialogTitle,
} from "@hitachivantara/uikit-react-core";

import { FormStory } from "./stories/FormStory";
import { LongContentStory } from "./stories/LongContentStory";
import { MainStory } from "./stories/MainStory";
import { SemanticVariantsStory } from "./stories/SemanticVariantsStory";

const meta: Meta<typeof HvDialog> = {
  title: "Components/Dialog",
  component: HvDialog,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvDialogTitle, HvDialogContent, HvDialogActions },
  decorators: [
    (Story) => (
      <div style={{ minHeight: isChromatic() ? 768 : 250 }}>{Story()}</div>
    ),
  ],
};
export default meta;

export const Main: StoryObj<HvDialogProps> = {
  args: {
    fullscreen: false,
    disableBackdropClick: false,
    buttonTitle: "Close",
    maxWidth: "sm",
    fullWidth: false,
  },
  argTypes: {
    maxWidth: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    classes: { control: { disable: true } },
  },
  render: (args) => <MainStory {...args} />,
};

export const SemanticVariants: StoryObj<HvDialogProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "The `HvDialog` component can receive a `variant` prop to set the status of the dialog. `HvDialogTitle` also accepts a `variant` prop that changes the icon. Alternatively, the `customIcon` prop allows for any custom icon",
      },
    },
    ...setupChromatic(["DS5 dawn", "Pentaho dawn"]),
  },
  decorators: [
    (Story) => (
      <div
        style={{ minHeight: isChromatic() ? 768 : undefined }}
        className="flex flex-col gap-sm"
      >
        {Story()}
      </div>
    ),
  ],
  // For visual testing and a11y
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /success/i });
    await userEvent.click(button);
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
  render: () => <SemanticVariantsStory />,
};

export const Form: StoryObj<HvDialogProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "An example of using a `form` in `HvDialog`. The sample uses the `autofocus` attribute to focus the Title input by default.<br /> \
          Accessibility-wise, `HvDialogTitle` automatically labels the dialog. A `aria-describedby` can be used to describe the content.",
      },
    },
    chromatic: {
      modes: {
        md: { viewport: 1200 },
      },
    },
  },
  // For visual testing and a11y
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /create a post/i });
    await userEvent.click(button);
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
  decorators: [(Story) => <div style={{ minHeight: 440 }}>{Story()}</div>],
  render: () => <FormStory />,
};

export const LongContent: StoryObj<HvDialogProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "With very long content the dialog grows in height, up to a maximum where a margin of 100px is left on top and bottom.",
      },
    },
    ...setupChromatic(["DS5 dawn", "Pentaho dawn"]),
  },
  // For visual testing and a11y
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /open dialog/i });
    await userEvent.click(button);
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
  decorators: [(Story) => <div style={{ minHeight: 400 }}>{Story()}</div>],
  render: () => <LongContentStory />,
};
