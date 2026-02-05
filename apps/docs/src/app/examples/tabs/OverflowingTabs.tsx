"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
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

const tabs = [
  { id: "summary", label: "1 Summary" },
  { id: "details", label: "2 Details", icon: <div className="i-ph-gear" /> },
  { id: "custom-properties", label: "3 Custom Properties" },
  { id: "contents", label: "4 Contents" },
  { id: "metrics", label: "5 Metrics" },
  { id: "rating", label: "6 Rating" },
  { id: "comments", label: "7 Comments" },
];

const MORE_WIDTH = 128;

export default function OverflowingTabs() {
  const [value, setValue] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [tabOrder, setTabOrder] = useState(tabs);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [lastClickedTabId, setLastClickedTabId] = useState<string | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Root resize detector: to know when the tabs will overflow
  const { width: rootWidth = 0, ref: rootRef } = useResizeDetector({
    handleHeight: false,
  });

  const recalculate = useCallback(() => {
    const measureBox = measureRef.current;
    if (!measureBox || rootWidth === 0) return null;

    // Find all tab elements in the measurement container
    const tabsContainer = measureBox.querySelector('[role="tablist"]');
    if (!tabsContainer) return null;

    const tabEls = Array.from(tabsContainer.children).filter(
      (el) => el.getAttribute("role") === "tab",
    ) as HTMLElement[];

    // Measure each tab's actual width
    const tabWidths = tabEls.map((el) => el.offsetWidth);

    // Calculate how many tabs can fit
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < tabWidths.length; i++) {
      const tabWidth = tabWidths[i];

      // Will we need a dropdown button after this tab?
      const willNeedDropdown = i < tabOrder.length - 1;

      // Check if this tab + dropdown (if needed) fits
      const spaceNeeded =
        totalWidth + tabWidth + (willNeedDropdown ? MORE_WIDTH : 0);

      if (spaceNeeded > rootWidth) {
        break; // Doesn't fit, stop here
      }

      totalWidth += tabWidth;
      count++;
    }

    // If count increased (more space available), sort the visible tabs
    if (count > visibleCount) {
      const newVisibleTabs = tabOrder.slice(0, count);
      const sortedVisibleTabs = newVisibleTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newRemainingTabs = tabOrder.slice(count);
      const newOrder = [...sortedVisibleTabs, ...newRemainingTabs];

      setTabOrder(newOrder);

      // Update value to maintain selection
      const selectedTab = tabOrder[value];
      const newValue = newOrder.findIndex((t) => t.id === selectedTab?.id);
      if (newValue !== -1) {
        setValue(newValue);
      }
    }

    // If count decreased and selected tab is now hidden, move it into visible range
    if (count < visibleCount && value >= count && count > 0) {
      const selectedTab = tabOrder[value];
      const tabToSwapWith = tabOrder[count - 1];

      // Create new visible tabs with selected tab at the end
      const newVisibleTabs = [...tabOrder.slice(0, count - 1), selectedTab];

      // Sort visible tabs by original order
      const sortedVisibleTabs = newVisibleTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      // Create remaining tabs
      const newRemainingTabs = [
        tabToSwapWith,
        ...tabOrder.slice(count).filter((t) => t.id !== selectedTab.id),
      ];

      // Sort remaining tabs by original order
      const sortedRemainingTabs = newRemainingTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newOrder = [...sortedVisibleTabs, ...sortedRemainingTabs];
      setTabOrder(newOrder);

      // Find selected tab's new position
      const newValue = sortedVisibleTabs.findIndex(
        (t) => t.id === selectedTab.id,
      );
      setValue(newValue);
    }

    // If no tabs are visible, sort all tabs by original order
    if (count === 0 && visibleCount > 0) {
      const sortedOrder = [...tabOrder].toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      setTabOrder(sortedOrder);

      // Update value to maintain selection
      const selectedTab = tabOrder[value];
      const newValue = sortedOrder.findIndex((t) => t.id === selectedTab?.id);
      if (newValue !== -1) {
        setValue(newValue);
      }
    }

    // Update how many tabs are visible
    setVisibleCount(count);

    // If we just clicked a tab, check if it's still visible
    if (lastClickedTabId) {
      const clickedTabIndex = tabOrder.findIndex(
        (t) => t.id === lastClickedTabId,
      );

      if (clickedTabIndex >= count && count > 0) {
        // Tab is hidden, need to swap it earlier
        return count; // Return the new count so we can handle the swap
      }
    }

    return null;
  }, [rootWidth, tabOrder, lastClickedTabId, visibleCount, value]);

  useEffect(() => {
    // Wait for DOM to update before measuring
    const needsSwap = recalculate();

    if (needsSwap !== null && lastClickedTabId) {
      // The clicked tab is hidden, swap it with the tab before it
      const clickedTabIndex = tabOrder.findIndex(
        (t) => t.id === lastClickedTabId,
      );
      const clickedTab = tabOrder[clickedTabIndex];
      const tabToSwapWith = tabOrder[needsSwap - 1];

      // Create new visible tabs (up to needsSwap)
      const newVisibleTabs = [...tabOrder.slice(0, needsSwap - 1), clickedTab];

      // Sort visible tabs by their original order
      const sortedVisibleTabs = newVisibleTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      // Create new remaining tabs (everything after needsSwap, excluding clicked tab)
      const newRemainingTabs = [
        tabToSwapWith,
        ...tabOrder.slice(needsSwap).filter((t) => t.id !== lastClickedTabId),
      ];

      // Sort remaining tabs by their original order
      const sortedRemainingTabs = newRemainingTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newOrder = [...sortedVisibleTabs, ...sortedRemainingTabs];

      setTabOrder(newOrder);

      // Find the clicked tab's new position in the sorted visible tabs
      const newValue = sortedVisibleTabs.findIndex(
        (t) => t.id === lastClickedTabId,
      );
      setValue(newValue);
      // Keep lastClickedTabId - will check again after next recalculate
    } else if (lastClickedTabId) {
      // Tab is now visible, clear tracking
      setLastClickedTabId(null);
    }
  }, [recalculate, rootWidth, tabOrder, lastClickedTabId]);

  const handleDropdownClick = (tabId: string) => {
    setMoreOpen(false);

    // Find the clicked tab in the current order
    const clickedIndex = tabOrder.findIndex((t) => t.id === tabId);
    if (clickedIndex === -1) return;

    const clickedTab = tabOrder[clickedIndex];

    // Handle case when no tabs are visible
    if (visibleCount === 0) {
      // Sort all tabs by original order
      const sortedOrder = [...tabOrder].toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      setTabOrder(sortedOrder);

      // Find and select the clicked tab in the sorted order
      const newValue = sortedOrder.findIndex((t) => t.id === tabId);
      setValue(newValue);
      setLastClickedTabId(tabId);
      return;
    }

    // Place clicked tab at the last visible position
    let targetPosition = visibleCount - 1;
    const lastVisibleTab = tabOrder[targetPosition];

    // Create new visible tabs
    const newVisibleTabs = [...tabOrder.slice(0, targetPosition), clickedTab];

    // Sort visible tabs by their original order
    const sortedVisibleTabs = newVisibleTabs.toSorted((a, b) => {
      const aIndex = tabs.findIndex((t) => t.id === a.id);
      const bIndex = tabs.findIndex((t) => t.id === b.id);
      return aIndex - bIndex;
    });

    // Create new remaining tabs (last visible tab + other remaining tabs excluding clicked)
    const newRemainingTabs = [
      lastVisibleTab,
      ...tabOrder.slice(visibleCount).filter((t) => t.id !== tabId),
    ];

    // Sort remaining tabs by their original order
    const sortedRemainingTabs = newRemainingTabs.toSorted((a, b) => {
      const aIndex = tabs.findIndex((t) => t.id === a.id);
      const bIndex = tabs.findIndex((t) => t.id === b.id);
      return aIndex - bIndex;
    });

    const newOrder = [...sortedVisibleTabs, ...sortedRemainingTabs];

    setTabOrder(newOrder);

    // Find the clicked tab's new position in the sorted visible tabs
    const newValue = sortedVisibleTabs.findIndex((t) => t.id === tabId);
    setValue(newValue);
    setLastClickedTabId(tabId); // Track which tab was clicked to ensure it stays visible
  };

  return (
    <>
      <div
        ref={rootRef}
        className="p-xs flex flex-col w-full gap-md min-w-170px max-w-900px w-400px resize-x overflow-auto border-1 border-border"
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
