import { HvButton } from "@hitachivantara/uikit-react-core";
import { HvCanvasToolbar } from "@hitachivantara/uikit-react-pentaho";

import preview from "../../../../../.storybook/preview";

const meta = preview.meta({
  title: "Pentaho/Canvas/Toolbar",
  component: HvCanvasToolbar,
  decorators: [(Story) => <div className="h-54px">{Story()}</div>],
});

export const Main = meta.story({
  args: {
    title: "Toolbar Title",
  },
  argTypes: {
    backButton: { control: { disable: true } },
    classes: { control: { disable: true } },
    labels: { control: { disable: true } },
    backButtonProps: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvCanvasToolbar {...args} className="relative">
        <HvButton variant="primary">Save</HvButton>
        <HvButton variant="primaryGhost">Cancel</HvButton>
      </HvCanvasToolbar>
    );
  },
});
