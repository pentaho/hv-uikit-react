import { renderStory, setupChromatic } from "@hitachivantara/internal";
import { HvSimpleGrid } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";
import { Test as BottomPanelTestStory } from "../Canvas/BottomPanel/BottomPanel.stories";
import { Test as ToolbarTabsTestStory } from "../Canvas/ToolbarTabs/ToolbarTabs.stories";

/** Visual tests for components from the Pentaho package */
const meta = preview.meta({
  title: "Tests/Pentaho",
  tags: ["skipTestRunner"],
});

/**
 * Visual tests for:
 * - Bottom panel
 * - Toolbar tabs
 */
export const Test = meta.story({
  parameters: {
    ...setupChromatic("pentaho", 5000),
  },
  render: (args, context: any) => (
    <HvSimpleGrid
      cols={2}
      style={{ alignItems: "start", justifyContent: "start" }}
    >
      {renderStory(BottomPanelTestStory, context)}
      {renderStory(ToolbarTabsTestStory, context)}
    </HvSimpleGrid>
  ),
});
