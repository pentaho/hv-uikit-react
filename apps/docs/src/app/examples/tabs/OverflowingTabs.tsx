"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HvDropDownMenu,
  HvTab,
  HvTabs,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const tabs = [
  { label: "Summary" },
  { label: "Details" },
  { label: "Custom Properties" },
  { label: "Contents" },
  { label: "Metrics" },
  { label: "Rating" },
  { label: "Comments" },
];

export default function OverflowingTabs() {
  const [value, setValue] = useState(0);
  const [tabOrder, setTabOrder] = useState(tabs);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tabs.length);

  const visibleTabs = tabOrder.slice(0, visibleCount);
  const remainingTabs = tabOrder.slice(visibleCount);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const measureBox = measureRef.current;
    if (!container || !measureBox) return;

    // Get the HvTabs element inside measureBox
    const tabsContainer = measureBox.querySelector('[role="tablist"]');
    if (!tabsContainer) return;

    const tabEls = Array.from(tabsContainer.children).slice(
      0,
      tabOrder.length,
    ) as HTMLElement[];

    const containerWidth = container.offsetWidth;
    const tabWidths = tabEls.map((el) => el.offsetWidth);
    const dropdownWidth = 56;

    let total = 0;
    let count = 0;

    // Calculate how many tabs can fit
    for (let i = 0; i < tabWidths.length; i++) {
      const width = tabWidths[i];
      const willNeedDropdown = i < tabWidths.length - 1;
      const spaceNeeded =
        total + width + (willNeedDropdown ? dropdownWidth : 0);

      if (spaceNeeded > containerWidth) {
        break;
      }

      total += width;
      count++;
    }

    // Ensure at least 1 tab is visible
    count = Math.max(1, count);

    // Try to restore original order if there's more space
    if (count > visibleCount) {
      // Sort visible tabs by their position in the original tabs array
      const newOrder = [...tabOrder];
      const visibleSlice = newOrder.slice(0, count);
      const sortedVisible = visibleSlice.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.label === a.label);
        const bIndex = tabs.findIndex((t) => t.label === b.label);
        return aIndex - bIndex;
      });

      // Find the new position of the selected tab
      const selectedTab = tabOrder[value];
      const newValue = sortedVisible.findIndex(
        (tab) => tab.label === selectedTab.label,
      );

      const restoredOrder = [...sortedVisible, ...newOrder.slice(count)];

      setTabOrder(restoredOrder);
      setValue(newValue !== -1 ? newValue : value);
    }
    // If selected tab would be hidden, ensure it stays visible
    else if (value >= count) {
      // Move the selected tab within the visible range
      const selectedTab = tabOrder[value];
      const newOrder = [
        ...tabOrder.slice(0, count - 1),
        selectedTab,
        ...tabOrder.slice(count - 1, value),
        ...tabOrder.slice(value + 1),
      ];
      setTabOrder(newOrder);
      setValue(count - 1);
    }

    setVisibleCount(count);
  }, [tabOrder, value, visibleCount]);

  // Observe resize of the container
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      recalculate();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [recalculate]);

  // Wait for styles to be loaded before measuring
  useEffect(() => {
    const waitForStyles = () => {
      const el = measureRef.current?.children[0] as HTMLElement;
      if (!el || el.offsetWidth === 0) {
        requestAnimationFrame(waitForStyles);
      } else {
        recalculate();
      }
    };
    waitForStyles();
  }, [recalculate]);

  const handleDropdownClick = (index: number) => {
    const selectedTab = remainingTabs[index];
    const lastVisibleTab = visibleTabs[visibleCount - 1];

    // Create new order: remove selected tab from remaining and last visible tab from visible
    const newOrder = [
      ...visibleTabs.slice(0, visibleCount - 1),
      selectedTab,
      lastVisibleTab,
      ...remainingTabs.filter((_, i) => i !== index),
    ];

    setTabOrder(newOrder);
    setValue(visibleCount - 1);
  };

  const handleMenuItemClick = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLLIElement>,
    item: any,
  ) => {
    const index = remainingTabs.findIndex((tab) => tab.label === item.label);
    if (index !== -1) {
      handleDropdownClick(index);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="p-xs flex flex-col w-full gap-md min-w-170px max-w-800px w-400px resize-x overflow-auto border-1 border-border"
      >
        <HvTabs value={value} onChange={(_, val) => setValue(val)}>
          {visibleTabs.map((tab) => (
            <HvTab key={tab.label} label={tab.label} />
          ))}
          {remainingTabs.length > 0 && (
            <HvDropDownMenu
              onClick={handleMenuItemClick}
              dataList={remainingTabs.map((tab) => ({
                label: tab.label,
              }))}
            />
          )}
        </HvTabs>
        <div className="flex flex-col gap-sm p-xs">
          <HvTypography variant="title4">
            {visibleTabs[value]?.label} content
          </HvTypography>
          <HvTypography>
            resize the container to see tabs move in and out of the dropdown
            menu
          </HvTypography>
        </div>
      </div>

      {/* Hidden tabs for measurement */}
      <div className="invisible absolute top-0 left-0 flex" ref={measureRef}>
        <HvTabs value={0}>
          {tabOrder.map((tab) => (
            <HvTab key={tab.label} label={tab.label} />
          ))}
          <HvDropDownMenu dataList={[{ label: "Menu" }]} />
        </HvTabs>
      </div>
    </>
  );
}
