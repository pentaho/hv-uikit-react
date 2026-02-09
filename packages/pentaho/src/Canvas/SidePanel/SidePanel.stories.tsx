import { HvCanvasSidePanel } from "@hitachivantara/uikit-react-pentaho";
import { theme } from "@hitachivantara/uikit-styles";

import preview from "../../../../../.storybook/preview";

const meta = preview.meta({
  title: "Pentaho/Canvas/Side Panel",
  component: HvCanvasSidePanel,
});

export const Main = meta.story({
  args: { defaultOpen: true },
  argTypes: {
    classes: { control: { disable: true } },
    tabs: { control: { disable: true } },
    tab: { control: { disable: true } },
    labels: { control: { disable: true } },
    children: { control: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: theme.colors.bgPage,
          margin: 0,
          padding: 0,
        }}
      >
        {Story()}
      </div>
    ),
  ],
  render: (args) => (
    <HvCanvasSidePanel {...args}>Some content</HvCanvasSidePanel>
  ),
});
