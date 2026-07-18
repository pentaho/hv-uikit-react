/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type { Meta, StoryObj } from "@storybook/react-vite";
import { renderStory, setupChromatic } from "@hitachivantara/internal";
import { HvSimpleGrid } from "@hitachivantara/uikit-react-core";

import { Test as BottomPanelTestStory } from "../Canvas/BottomPanel/BottomPanel.stories";
import { Main as SidePanelMainStory } from "../Canvas/SidePanel/SidePanel.stories";
import { Test as ToolbarTabsTestStory } from "../Canvas/ToolbarTabs/ToolbarTabs.stories";

/** Visual tests for components from the Pentaho package */
const meta: Meta = {
  title: "Tests/Pentaho",
  tags: ["skipTestRunner"],
};
export default meta;

/**
 * Visual tests for:
 * - Bottom panel
 * - Toolbar tabs
 */
export const Test: StoryObj = {
  parameters: {
    ...setupChromatic("pentaho", 5000),
  },
  render: (args, context) => (
    <HvSimpleGrid
      cols={2}
      style={{ alignItems: "start", justifyContent: "start" }}
    >
      {renderStory(BottomPanelTestStory, context)}
      {renderStory(ToolbarTabsTestStory, context)}
      {renderStory(SidePanelMainStory, context)}
    </HvSimpleGrid>
  ),
};
