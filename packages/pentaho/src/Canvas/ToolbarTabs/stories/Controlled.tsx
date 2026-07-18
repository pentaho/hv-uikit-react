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
import { useState } from "react";
import { css } from "@emotion/css";
import {
  HvButton,
  HvEmptyState,
  HvPanel,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import { Info } from "@hitachivantara/uikit-react-icons";
import {
  HvCanvasToolbar,
  HvCanvasToolbarTabs,
  type HvCanvasToolbarTabsProps,
} from "@hitachivantara/uikit-react-pentaho";

const classes = {
  panel: css({
    position: "relative",
    height: 250,
    backgroundColor: theme.colors.bgPageSecondary,
    padding: theme.space.sm,
  }),
  content: css({
    paddingTop: `calc(54px + 32px + 2 * ${theme.space.sm})`,
  }),
  toolbarTabs: css({
    position: "absolute",
    top: `calc(54px + ${theme.space.sm})`,
    width: `calc(100% - 2 * ${theme.space.sm})`,
    right: 0,
    left: 0,
    marginLeft: "auto",
    marginRight: "auto",
  }),
  toolbar: css({
    zIndex: theme.zIndices.sticky,
    top: theme.space.sm,
    width: `calc(100% - 2 * ${theme.space.sm})`,
    borderRadius: "32px 32px 0px 0px",
    boxShadow: "0px 2px 4px -1px rgba(51, 65, 85, 0.08)",
    right: 0,
    left: 0,
    marginLeft: "auto",
    marginRight: "auto",
  }),
  toolbarBack: css({ borderRadius: "32px 0px 0px 0px" }),
};

export const ControlledStory = () => {
  const [tabs, setTabs] = useState<HvCanvasToolbarTabsProps["tabs"]>([]);
  const [selectedTab, setSelectedTab] = useState("none");

  return (
    <HvPanel
      className={classes.panel}
      role={selectedTab !== "none" ? "tabpanel" : undefined}
      aria-labelledby={selectedTab !== "none" ? selectedTab : undefined}
    >
      <HvCanvasToolbar
        className={classes.toolbar}
        classes={{ back: classes.toolbarBack }}
        title="My App"
      >
        <HvButton variant="primary">Save</HvButton>
        <HvButton variant="primaryGhost">Cancel</HvButton>
      </HvCanvasToolbar>
      <HvCanvasToolbarTabs
        className={classes.toolbarTabs}
        selectedTabId={selectedTab}
        tabs={tabs}
        onChange={(event, newTabs) => setTabs(newTabs)}
        onTabChange={(event, tabId) => setSelectedTab(tabId ?? "none")}
      />

      <div className={classes.content}>
        {selectedTab !== "none" ? (
          <HvTypography>Content for tab {selectedTab}</HvTypography>
        ) : (
          <HvEmptyState
            icon={<Info />}
            title="Ops! No content available."
            message="Please, create a new tab."
          />
        )}
      </div>
    </HvPanel>
  );
};
