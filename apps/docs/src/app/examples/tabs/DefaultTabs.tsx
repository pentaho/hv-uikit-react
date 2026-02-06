"use client";

import { HvTypography } from "@hitachivantara/uikit-react-core";

import { OverflowingTabs, OverflowTab } from "./OverflowingTabs";

const tabs: OverflowTab[] = [
  { id: "summary", label: "1 Summary" },
  { id: "details", label: "2 Details", icon: <div className="i-ph-gear" /> },
  { id: "custom-properties", label: "3 Custom Properties" },
  { id: "contents", label: "4 Contents" },
  { id: "metrics", label: "5 Metrics" },
  { id: "rating", label: "6 Rating" },
  { id: "comments", label: "7 Comments" },
];

export default function DefaultTabs() {
  return (
    <div className="p-xs flex flex-col w-full gap-md min-w-170px max-w-900px w-535px resize-x overflow-auto border-1 border-border">
      <OverflowingTabs tabs={tabs} />
      <HvTypography>Resize the container to see the tabs overflow</HvTypography>
    </div>
  );
}
