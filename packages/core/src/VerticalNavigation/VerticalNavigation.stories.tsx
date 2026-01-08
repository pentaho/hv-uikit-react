import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationProps,
  HvVerticalNavigationSlider,
  HvVerticalNavigationTree,
  HvVerticalNavigationTreeView,
  HvVerticalNavigationTreeViewItem,
} from "@hitachivantara/uikit-react-core";

import { CollapsibleIcons as CollapsibleIconsStory } from "./stories/CollapsibleIcons";
import { Main as MainStory } from "./stories/Main";
import { SliderMode as SliderModeStory } from "./stories/SliderMode";
import { Test as TestStory } from "./stories/Test";
import { TreeViewMode as TreeViewModeStory } from "./stories/TreeViewMode";

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

export const TreeViewMode: StoryObj<HvVerticalNavigationProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Usage of the [Treeview Design Pattern](https://w3c.github.io/aria-practices/#TreeView) to build a navigation tree for a set of hierarchically organized web pages. " +
          "Instead of TAB, use the arrow keys to navigate through items. Enter performs its default action (i.e. open/close parent nodes, select otherwise).",
      },
    },
  },
  render: () => <TreeViewModeStory />,
};

export const CollapsibleIcons: StoryObj<HvVerticalNavigationProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "When collapsed in icon mode only the icons are visible, if an icon is not provided one will be generated based on the first letter of the label.",
      },
    },
  },
  render: () => <CollapsibleIconsStory />,
};

export const SliderMode: StoryObj<HvVerticalNavigationProps> = {
  render: () => <SliderModeStory />,
};

export const Test: StoryObj<HvVerticalNavigationProps> = {
  parameters: {
    ...setupChromatic(
      ["DS5 dawn", "DS5 wicked", "Pentaho dawn", "Pentaho wicked"],
      5000,
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button", { name: "collapseButton" });
    await userEvent.click(buttons[0]);
    const hwButtons = canvas.getAllByRole("button", { name: /hardware/i });
    expect(hwButtons).toHaveLength(2);
    await userEvent.click(hwButtons[1]);
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
