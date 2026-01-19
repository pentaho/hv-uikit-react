import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvPanel,
  HvTreeItem,
  HvTreeView,
  HvTreeViewProps,
} from "@hitachivantara/uikit-react-core";

import { DataObject as DataObjectStory } from "./stories/DataObject";

// Function to emulate pausing between interactions
const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve("Time passed"), ms);
  });

export default {
  title: "Components/Tree View",
  component: HvTreeView,
  argTypes: {},
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvTreeItem },
} satisfies Meta<typeof HvTreeView>;

export const Main: StoryObj<HvTreeViewProps<false>> = {
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => (
    <HvPanel style={{ width: 300 }}>
      <HvTreeView aria-label="file system navigator">
        <HvTreeItem nodeId="1" label="Applications">
          <HvTreeItem nodeId="10" label="Calendar.app" />
          <HvTreeItem nodeId="11" label="Code.app" />
          <HvTreeItem nodeId="12" label="Firefox.app" />
        </HvTreeItem>
        <HvTreeItem nodeId="2" label="Documents">
          <HvTreeItem nodeId="20" label="private">
            <HvTreeItem nodeId="200" disabled label="secret.txt" />
          </HvTreeItem>
          <HvTreeItem nodeId="21" label="index.js" />
        </HvTreeItem>
      </HvTreeView>
    </HvPanel>
  ),
};

export const DataObject: StoryObj<HvTreeViewProps<false>> = {
  parameters: {
    docs: {
      description: {
        story:
          "Sometimes the tree data is in an object shape. These can be easily converted to `HvTreeItem` nodes using a recursive `renderItem` function.",
      },
    },
    ...setupChromatic(),
  },
  // For visual testing
  play: async ({ canvas, userEvent }) => {
    const item = canvas.getByText("User"); // Not able to get it by role treeitem
    await userEvent.click(item);
    // Wait before clicking the other item to avoid errors in visual tests
    await sleep(500);
    const subItem1 = canvas.getByText("Applications");
    await userEvent.click(subItem1);
    await sleep(500);
    const subItem2 = canvas.getByText("git");
    await userEvent.click(subItem2);
    await expect(canvas.getAllByRole("treeitem")).toHaveLength(9);
  },
  render: () => <DataObjectStory />,
};
