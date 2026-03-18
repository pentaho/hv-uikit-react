import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { HvButton } from "@hitachivantara/uikit-react-core";
import { Favorite, Heart } from "@hitachivantara/uikit-react-icons";
import {
  HvCanvasBottomPanel,
  HvCanvasBottomPanelProps,
} from "@hitachivantara/uikit-react-pentaho";

const meta: Meta<typeof HvCanvasBottomPanel> = {
  title: "Pentaho/Canvas/Bottom Panel",
  component: HvCanvasBottomPanel,
  parameters: {
    a11y: {
      config: {
        rules: [
          // Using experimental actions inside tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-actions/
          // Still better UX/a11y than having "unrelated floating" action buttons outside the tabs
          { id: "aria-required-children", enabled: false },
        ],
      },
    },
  },
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
  play: async ({ canvas, userEvent }) => {
    // press tab & arrow right to select next tab
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(
      canvas.getByRole("tab", { name: "Tab 2", selected: true }),
    ).toBeInTheDocument();

    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(
      canvas.getByRole("tab", { name: "Tab 1", selected: true }),
    ).toBeInTheDocument();
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

export const InteractionTest: StoryObj = {
  globals: {
    viewport: { value: "split" },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    // Test: opens and closes by controlling the component
    const toggleOpenBtn = canvas.getByRole("button", { name: "Toggle Open" });
    await userEvent.click(toggleOpenBtn);
    expect(canvas.queryByRole("tablist")).not.toBeInTheDocument();

    // Reopen for next tests
    await userEvent.click(toggleOpenBtn);

    // Test: minimizes and maximizes the tabs
    expect(canvas.getByRole("tablist")).toBeInTheDocument();
    expect(canvas.getByRole("tabpanel")).toBeInTheDocument();

    const toggleMinimizeBtn = canvas.getByRole("button", { name: /minimize/i });
    await userEvent.click(toggleMinimizeBtn);

    expect(canvas.getByRole("tablist")).toBeInTheDocument();
    expect(canvas.queryByRole("tabpanel")).not.toBeInTheDocument();

    // Restore for next tests
    await userEvent.click(toggleMinimizeBtn);

    // Test: renders the correct number of right and left actions
    const dropdownMenus = canvas.getAllByRole("button", {
      name: "Dropdown menu",
    });
    expect(dropdownMenus).toHaveLength(4);

    const action1Buttons = canvas.getAllByRole("button", { name: "Action 1" });
    expect(action1Buttons).toHaveLength(2);

    const action3Buttons = canvas.getAllByRole("button", { name: "Action 3" });
    expect(action3Buttons).toHaveLength(2);

    const action4Buttons = canvas.getAllByRole("button", { name: "Action 4" });
    expect(action4Buttons).toHaveLength(2);

    // Click left action for first tab
    await userEvent.click(dropdownMenus[0]);
    const menu1 = within(canvasElement.parentElement!).getByRole("menu");
    expect(menu1).toBeInTheDocument();
    expect(within(menu1).getAllByRole("menuitem")).toHaveLength(1);
    expect(
      within(menu1).getByRole("menuitem", { name: "Action 2" }),
    ).toBeVisible();

    // Close menu by clicking elsewhere
    await userEvent.click(document.body);

    // Click right action for first tab
    await userEvent.click(dropdownMenus[1]);
    const menu2 = within(canvasElement.parentElement!).getByRole("menu");
    expect(menu2).toBeInTheDocument();
    expect(within(menu2).getAllByRole("menuitem")).toHaveLength(1);
    expect(
      within(menu2).getByRole("menuitem", { name: "Action 5" }),
    ).toBeVisible();
    // Close menu

    const tab2 = canvas.getByRole("tab", { name: "Tab 2" });
    await userEvent.click(tab2);
    const tab1 = canvas.getByRole("tab", { name: "Tab 1", selected: false });
    expect(tab1).toBeVisible();
  },
  render: () => {
    const [minimize, setMinimize] = useState(false);
    const [open, setOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState(tabs[0].id);

    return (
      <>
        <div className="flex gap-xs mb-xs">
          <HvButton onClick={() => setOpen((prev) => !prev)}>
            Toggle Open
          </HvButton>
          <HvButton onClick={() => setMinimize((prev) => !prev)}>
            Toggle Minimize
          </HvButton>
        </div>
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
  render: () => (
    <div className="flex flex-col gap-xs">
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
    </div>
  ),
};
