import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { setupChromatic } from "@pentaho/internal";
import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationSlider,
  HvVerticalNavigationTree,
  HvVerticalNavigationTreeView,
  HvVerticalNavigationTreeViewItem,
  type HvVerticalNavigationProps,
} from "@pentaho/uikit-react-core";

import { CollapsibleIcons as CollapsibleIconsStory } from "./stories/CollapsibleIcons";
import { Main as MainStory } from "./stories/Main";
import { SliderMode as SliderModeStory } from "./stories/SliderMode";
import { Test as TestStory } from "./stories/Test";

const meta: Meta<typeof HvVerticalNavigation> = {
  title: "Components/Vertical Navigation",
  component: HvVerticalNavigation,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: {
    HvVerticalNavigationHeader,
    HvVerticalNavigationTree,
    HvVerticalNavigationActions,
    HvVerticalNavigationAction,
    HvVerticalNavigationTreeView,
    HvVerticalNavigationTreeViewItem,
    HvVerticalNavigationSlider,
  },
  decorators: [
    (Story) => <div style={{ display: "flex", height: 530 }}>{Story()}</div>,
  ],
};

export default meta;

export const Main: StoryObj<HvVerticalNavigationProps> = {
  args: {
    open: true,
    slider: false,
  },
  argTypes: {},
  render: (args) => <MainStory {...args} />,
};

export const Test: StoryObj<HvVerticalNavigationProps> = {
  parameters: {
    ...setupChromatic("all", 5000),
  },
  play: async ({ canvas, userEvent }) => {
    // expand the last navigation: it grows rightward, so it doesn't move the
    // popup anchor below — the popup measures its anchor once, and a moving
    // anchor leaves it at a stale position
    const buttons = canvas.getAllByRole("button", { name: "collapseButton" });
    await userEvent.click(buttons[buttons.length - 1]);

    const hwButtons = canvas.getAllByRole("button", { name: /hardware/i });
    expect(hwButtons).toHaveLength(2);
    await userEvent.click(hwButtons[0]);
  },
  render: () => (
    <div className="flex gap-sm">
      <TestStory />
      <TestStory mode="treeview" collapsible defaultExpanded />
      <SliderModeStory />
      <CollapsibleIconsStory />
      <CollapsibleIconsStory />
    </div>
  ),
};
