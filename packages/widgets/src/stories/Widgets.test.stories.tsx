import type { Meta, StoryObj } from "@storybook/react-vite";
import { renderStory, setupChromatic } from "@pentaho/internal";

import { Test as BottomPanelTestStory } from "../Canvas/BottomPanel/BottomPanel.stories";
import { Main as SidePanelMainStory } from "../Canvas/SidePanel/SidePanel.stories";
import { Test as ToolbarTabsTestStory } from "../Canvas/ToolbarTabs/ToolbarTabs.stories";
import { Main as DashboardMainStory } from "../Dashboard/Dashboard.stories";

/** Visual tests for components from the widgets package */
const meta: Meta = {
  title: "Tests/Widgets",
  tags: ["skipTestRunner"],
};
export default meta;

export const Test: StoryObj = {
  parameters: {
    ...setupChromatic("pentaho", 5000),
  },
  render: (args, context) => (
    <div className="grid gap-sm grid-cols-2 items-start justify-start">
      {renderStory(BottomPanelTestStory, context)}
      {renderStory(ToolbarTabsTestStory, context)}
      {renderStory(SidePanelMainStory, context)}
      {renderStory(DashboardMainStory, context)}
    </div>
  ),
};
