"use client";

import { HvTypography } from "@hitachivantara/uikit-react-core";

import { OverflowingTabs, OverflowTab } from "./OverflowingTabs";

const tabs: OverflowTab[] = [
  {
    id: "summary",
    label: "1 Summary",
    icon: <div className="i-ph-read-cv-logo" />,
  },
  { id: "details", label: "2 Details", icon: <div className="i-ph-article" /> },
  {
    id: "custom-properties",
    label: "3 Custom Properties",
    icon: <div className="i-ph-file-text" />,
  },
  {
    id: "contents",
    label: "4 Contents",
    icon: <div className="i-ph-arrow-square-in" />,
  },
  {
    id: "metrics",
    label: "5 Metrics",
    icon: <div className="i-ph-fingerprint" />,
  },
  { id: "rating", label: "6 Rating", icon: <div className="i-ph-star" /> },
  {
    id: "comments",
    label: "7 Comments",
    icon: <div className="i-ph-text-align-center" />,
  },
];

export default function DefaultTabs() {
  return (
    <div className="p-xs flex flex-col w-full gap-md min-w-170px max-w-900px w-535px resize-x overflow-auto border-1 border-border">
      <OverflowingTabs floating size="lg" iconPosition="top" tabs={tabs} />
      <HvTypography>Resize the container to see the tabs overflow</HvTypography>
    </div>
  );
}
