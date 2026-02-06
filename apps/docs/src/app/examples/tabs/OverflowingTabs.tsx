"use client";

import {
  HvBaseDropdown,
  HvIconContainer,
  HvListContainer,
  HvListItem,
  HvPanel,
  HvTab,
  HvTabs,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";

import { OverflowComponent } from "./OverflowComponent";
import { useTabs } from "./useTabs";

const tabs = [
  { id: "summary", label: "1 Summary" },
  { id: "details", label: "2 Details", icon: <div className="i-ph-gear" /> },
  { id: "custom-properties", label: "3 Custom Properties" },
  { id: "contents", label: "4 Contents" },
  { id: "metrics", label: "5 Metrics" },
  { id: "rating", label: "6 Rating" },
  { id: "comments", label: "7 Comments" },
];

export default function OverflowingTabs() {
  const {
    value,
    setValue,
    moreOpen,
    setMoreOpen,
    tabOrder,
    visibleCount,
    rootRef,
    measureRef,
    handleDropdownClick,
  } = useTabs({
    tabs,
  });

  return (
    <>
      <div
        ref={rootRef}
        className="p-xs flex flex-col w-full gap-md min-w-170px max-w-900px w-535px resize-x overflow-auto border-1 border-border"
      >
        <HvTabs value={value} onChange={(_, val) => setValue(val)}>
          {tabOrder.slice(0, visibleCount).map((tab) => (
            <HvTab
              key={tab.id}
              iconPosition="start"
              {...tab}
              icon={<HvIconContainer>{tab.icon}</HvIconContainer>}
            />
          ))}
          {visibleCount < tabOrder.length && (
            <HvBaseDropdown
              headerComponent={OverflowComponent}
              {...({ count: tabOrder.length - visibleCount } as any)}
              variableWidth
              placement="left"
              expanded={moreOpen}
              onToggle={() => setMoreOpen((p) => !p)}
            >
              <HvPanel>
                <HvListContainer interactive>
                  {tabOrder.slice(visibleCount).map((tab) => (
                    <HvListItem
                      key={tab.id}
                      value={tab.label}
                      onClick={() => handleDropdownClick(tab.id)}
                      style={{
                        color:
                          value === tabOrder.findIndex((t) => t.id === tab.id)
                            ? theme.colors.primary
                            : "inherit",
                        fontWeight:
                          value === tabOrder.findIndex((t) => t.id === tab.id)
                            ? theme.fontWeights.semibold
                            : "inherit",
                      }}
                    >
                      {tab.label}
                    </HvListItem>
                  ))}
                </HvListContainer>
              </HvPanel>
            </HvBaseDropdown>
          )}
        </HvTabs>
        <HvTypography>{`Selected tab: ${tabs[value].label}`}</HvTypography>
      </div>
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          height: 0,
          overflow: "hidden",
        }}
      >
        <HvTabs value={0}>
          {tabOrder.map((tab) => (
            <HvTab
              key={tab.id}
              iconPosition="start"
              {...tab}
              icon={<HvIconContainer>{tab.icon}</HvIconContainer>}
            />
          ))}
        </HvTabs>
      </div>
    </>
  );
}
