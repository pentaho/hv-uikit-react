import { useState } from "react";
import { CaretLeftIcon } from "@phosphor-icons/react/CaretLeft";
import { GearIcon } from "@phosphor-icons/react/Gear";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvBreadCrumb,
  HvButton,
  HvDropDownMenu,
  HvIconButton,
  HvIconContainer,
  HvStatusIcon,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { OverflowTabs, type OverflowTab } from "../OverflowTabs";
import { PageTitle } from "./PageTitle";

const breadcrumbs = [
  { label: "Analytics", path: "/" },
  { label: "Data Management", path: "/data" },
  { label: "Datasets", path: "/data/datasets" },
  { label: "Sales Performance Q4 2026", path: "/data/datasets/sales" },
];

const icon = (
  <HvIconContainer>
    <GearIcon />
  </HvIconContainer>
);

const createTabs = (labels: string[]): OverflowTab[] =>
  labels.map((label) => ({ label, icon }));

const meta: Meta<typeof PageTitle> = {
  title: "Pentaho/Page Title",
  component: PageTitle,
};

export default meta;

/** Full-featured page header with all elements. Resize the window to see tabs overflow into a dropdown. */
export const Default: StoryObj<typeof PageTitle> = {
  parameters: {
    ...setupChromatic("pentaho"),
  },
  render: () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = createTabs([
      "Overview",
      "Trends",
      "Segments",
      "Forecast",
      "History",
      "Reports",
      "Settings",
      "Permissions",
    ]);

    return (
      <PageTitle
        backButton={
          <HvIconButton title="Back" onClick={fn()}>
            <CaretLeftIcon size={20} />
          </HvIconButton>
        }
        breadcrumb={<HvBreadCrumb listRoute={breadcrumbs} />}
        icon={<HvStatusIcon size="md" customIcon={<GearIcon />} />}
        title="Sales Performance Q4 2026"
        description={
          <>
            <HvTag label="Live Data" />
            <HvTypography variant="caption1" className="text-textSubtle">
              Real-time sales metrics and revenue
            </HvTypography>
          </>
        }
        actions={
          <>
            <HvButton variant="secondarySubtle">Export</HvButton>
            <HvButton variant="primary">Schedule</HvButton>
            <HvDropDownMenu
              placement="left"
              dataList={[
                { label: "Share" },
                { label: "Configure" },
                { label: "Download" },
              ]}
            />
          </>
        }
        tabs={
          <OverflowTabs
            tabs={tabs}
            iconPosition="start"
            value={activeTab}
            onChange={(_, value) => setActiveTab(value as number)}
          />
        }
      />
    );
  },
};

/** Minimal page header with only essential elements. Demonstrates title truncation with long text. */
export const Compact: StoryObj<typeof PageTitle> = {
  render: () => {
    const [activeTab, setActiveTab] = useState("summary");

    const tabsWithValues: OverflowTab[] = [
      { label: "Summary", value: "summary" },
      { label: "Custom Properties", value: "custom" },
      { label: "Related", value: "related" },
    ];

    return (
      <PageTitle
        backButton={
          <HvIconButton title="Back" onClick={fn()}>
            <CaretLeftIcon size={16} />
          </HvIconButton>
        }
        icon={<HvStatusIcon size="md" customIcon={<GearIcon />} />}
        title="Q4 2024 Sales Dataset this is a long title that should be truncated eventually"
        tabs={
          <OverflowTabs
            tabs={tabsWithValues}
            iconPosition="start"
            value={activeTab}
            onChange={(_, value) => setActiveTab(value as string)}
          />
        }
      />
    );
  },
};
