import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvButton } from "@hitachivantara/uikit-react-core";
import { Favorite, Heart } from "@hitachivantara/uikit-react-icons";
import {
  HvCanvasBottomPanel,
  HvCanvasBottomPanelProps,
} from "@hitachivantara/uikit-react-pentaho";

const meta: Meta<typeof HvCanvasBottomPanel> = {
  title: "Pentaho/Canvas/Bottom Panel",
  component: HvCanvasBottomPanel,
};
export default meta;

export const Main: StoryObj<HvCanvasBottomPanelProps> = {
  args: {
    open: true,
    tabs: [
      { id: 0, title: "Tab 1" },
      { id: 1, title: "Tab 2" },
    ],
  },
  argTypes: {
    tabs: { control: { disable: true } },
    classes: { control: { disable: true } },
    selectedTabId: { control: { disable: true } },
    leftActions: { control: { disable: true } },
    rightActions: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvCanvasBottomPanel {...args} className="relative">
        Content
      </HvCanvasBottomPanel>
    );
  },
};

const leftActions = [
  { id: "action1", label: "Action 1", icon: <Favorite /> },
  { id: "action2", label: "Action 2", icon: <Favorite /> },
];
const rightActions = [
  { id: "action3", label: "Action 3", icon: <Heart /> },
  { id: "action4", label: "Action 4", icon: <Heart /> },
  { id: "action5", label: "Action 5", icon: <Heart /> },
];

const tabs: HvCanvasBottomPanelProps["tabs"] = [
  { id: 0, title: (overflow) => (overflow ? "Tab 1 Overflowing" : "Tab 1") },
  { id: 1, title: "Tab 2" },
];

export const PlaywrightTest: StoryObj = {
  tags: ["skipTestRunner"],
  render: () => {
    const [minimize, setMinimize] = useState(false);
    const [open, setOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState(tabs[0].id);

    return (
      <>
        <HvButton onClick={() => setOpen((prev) => !prev)}>
          Toggle Open
        </HvButton>
        <HvButton onClick={() => setMinimize((prev) => !prev)}>
          Toggle Minimize
        </HvButton>
        <HvCanvasBottomPanel
          open={open}
          className="relative"
          tabs={tabs}
          leftActions={leftActions}
          rightActions={rightActions}
          overflowActions={[...leftActions, ...rightActions]}
          onAction={(event, action, tabId) => {
            alert(`You clicked action ${action.label} for ${tabId}.`);
          }}
          minimize={minimize}
          selectedTabId={selectedTab}
          onTabChange={(event, id) => setSelectedTab(id as number)}
        >
          Content
        </HvCanvasBottomPanel>
      </>
    );
  },
};

export const Test: StoryObj = {
  tags: ["skipTestRunner"],
  render: () => (
    <>
      <HvCanvasBottomPanel
        open
        className="relative"
        tabs={tabs}
        leftActions={leftActions}
        rightActions={rightActions}
        overflowActions={[...leftActions, ...rightActions]}
      >
        Content
      </HvCanvasBottomPanel>
      <HvCanvasBottomPanel
        open
        className="relative"
        tabs={tabs}
        leftActions={[leftActions[0]]}
        rightActions={[rightActions[0], rightActions[1]]}
      >
        Content
      </HvCanvasBottomPanel>
      <HvCanvasBottomPanel
        open
        className="relative"
        tabs={[{ id: 1, title: "Tab 2" }]}
        leftActions={[leftActions[0]]}
        rightActions={[rightActions[0], rightActions[1]]}
      >
        Content
      </HvCanvasBottomPanel>
      <HvCanvasBottomPanel
        open
        minimize
        className="relative"
        tabs={tabs}
        leftActions={[leftActions[0]]}
        rightActions={[rightActions[0], rightActions[1]]}
      >
        Content
      </HvCanvasBottomPanel>
      <HvCanvasBottomPanel
        open
        minimize
        className="relative"
        tabs={[{ id: 1, title: "Tab 2" }]}
        leftActions={[leftActions[0]]}
        rightActions={[rightActions[0], rightActions[1]]}
      >
        Content
      </HvCanvasBottomPanel>
    </>
  ),
};
