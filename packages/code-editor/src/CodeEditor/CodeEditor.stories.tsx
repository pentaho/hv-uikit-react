import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvCodeEditor,
  HvCodeEditorProps,
} from "@hitachivantara/uikit-react-code-editor";

import { MainStory } from "./stories/Main";

const meta: Meta<typeof HvCodeEditor> = {
  title: "Components/Code Editor",
  component: HvCodeEditor,
};
export default meta;

export const Main: StoryObj<HvCodeEditorProps> = {
  parameters: {
    ...setupChromatic("default", 5000),
  },
  render: () => <MainStory />,
};
