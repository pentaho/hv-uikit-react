import { setupChromatic } from "@hitachivantara/internal";
import { HvCodeEditor } from "@hitachivantara/uikit-react-code-editor";

import preview from "../../../../.storybook/preview";
import { MainStory } from "./stories/Main";

const meta = preview.meta({
  title: "Components/Code Editor",
  component: HvCodeEditor,
});

export const Main = meta.story({
  parameters: {
    ...setupChromatic(["DS5 dawn"], 5000),
  },
  render: () => <MainStory />,
});
