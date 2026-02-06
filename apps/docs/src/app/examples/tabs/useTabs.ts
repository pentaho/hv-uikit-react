import { useCallback, useEffect, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

interface Tab {
  id: string;
  label?: string;
  [key: string]: any;
}

interface UseTabsOptions {
  tabs: Tab[];
  dropdownWidth?: number;
}

interface UseTabsReturn {
  value: number;
  setValue: (value: number) => void;
  moreOpen: boolean;
  setMoreOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  tabOrder: Tab[];
  visibleCount: number;
  rootRef: React.RefObject<HTMLDivElement>;
  measureRef: React.RefObject<HTMLDivElement>;
  handleDropdownClick: (tabId: string) => void;
}

export const useTabs = ({
  tabs,
  dropdownWidth = 128,
}: UseTabsOptions): UseTabsReturn => {
  const [value, setValue] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [tabOrder, setTabOrder] = useState(tabs);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [lastClickedTabId, setLastClickedTabId] = useState<string | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const { width: rootWidth = 0, ref: rootRef } = useResizeDetector({
    handleHeight: false,
  });

  const recalculate = useCallback(() => {
    const measureBox = measureRef.current;
    if (!measureBox || rootWidth === 0) return null;

    const tabsContainer = measureBox.querySelector('[role="tablist"]');
    if (!tabsContainer) return null;

    const tabEls = Array.from(tabsContainer.children).filter(
      (el) => el.getAttribute("role") === "tab",
    ) as HTMLElement[];

    const tabWidths = tabEls.map((el) => el.offsetWidth);

    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < tabWidths.length; i++) {
      const tabWidth = tabWidths[i];
      const willNeedDropdown = i < tabOrder.length - 1;
      const spaceNeeded =
        totalWidth + tabWidth + (willNeedDropdown ? dropdownWidth : 0);

      if (spaceNeeded > rootWidth) {
        break;
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

      const newVisibleTabs = [...tabOrder.slice(0, count - 1), selectedTab];

      const sortedVisibleTabs = newVisibleTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newRemainingTabs = [
        tabToSwapWith,
        ...tabOrder.slice(count).filter((t) => t.id !== selectedTab.id),
      ];

      const sortedRemainingTabs = newRemainingTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newOrder = [...sortedVisibleTabs, ...sortedRemainingTabs];
      setTabOrder(newOrder);

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

      const selectedTab = tabOrder[value];
      const newValue = sortedOrder.findIndex((t) => t.id === selectedTab?.id);
      if (newValue !== -1) {
        setValue(newValue);
      }
    }

    setVisibleCount(count);

    // If we just clicked a tab, check if it's still visible
    if (lastClickedTabId) {
      const clickedTabIndex = tabOrder.findIndex(
        (t) => t.id === lastClickedTabId,
      );

      if (clickedTabIndex >= count && count > 0) {
        return count;
      }
    }

    return null;
  }, [
    rootWidth,
    tabOrder,
    lastClickedTabId,
    visibleCount,
    value,
    tabs,
    dropdownWidth,
  ]);

  useEffect(() => {
    const needsSwap = recalculate();

    if (needsSwap !== null && lastClickedTabId) {
      const clickedTabIndex = tabOrder.findIndex(
        (t) => t.id === lastClickedTabId,
      );
      const clickedTab = tabOrder[clickedTabIndex];
      const tabToSwapWith = tabOrder[needsSwap - 1];

      const newVisibleTabs = [...tabOrder.slice(0, needsSwap - 1), clickedTab];

      const sortedVisibleTabs = newVisibleTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newRemainingTabs = [
        tabToSwapWith,
        ...tabOrder.slice(needsSwap).filter((t) => t.id !== lastClickedTabId),
      ];

      const sortedRemainingTabs = newRemainingTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newOrder = [...sortedVisibleTabs, ...sortedRemainingTabs];

      setTabOrder(newOrder);

      const newValue = sortedVisibleTabs.findIndex(
        (t) => t.id === lastClickedTabId,
      );
      setValue(newValue);
    } else if (lastClickedTabId) {
      setLastClickedTabId(null);
    }
  }, [recalculate, rootWidth, tabOrder, lastClickedTabId, tabs]);

  const handleDropdownClick = useCallback(
    (tabId: string) => {
      setMoreOpen(false);

      const clickedIndex = tabOrder.findIndex((t) => t.id === tabId);
      if (clickedIndex === -1) return;

      const clickedTab = tabOrder[clickedIndex];

      // Handle case when no tabs are visible
      if (visibleCount === 0) {
        const sortedOrder = [...tabOrder].toSorted((a, b) => {
          const aIndex = tabs.findIndex((t) => t.id === a.id);
          const bIndex = tabs.findIndex((t) => t.id === b.id);
          return aIndex - bIndex;
        });

        setTabOrder(sortedOrder);

        const newValue = sortedOrder.findIndex((t) => t.id === tabId);
        setValue(newValue);
        setLastClickedTabId(tabId);
        return;
      }

      const targetPosition = visibleCount - 1;
      const lastVisibleTab = tabOrder[targetPosition];

      const newVisibleTabs = [...tabOrder.slice(0, targetPosition), clickedTab];

      const sortedVisibleTabs = newVisibleTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newRemainingTabs = [
        lastVisibleTab,
        ...tabOrder.slice(visibleCount).filter((t) => t.id !== tabId),
      ];

      const sortedRemainingTabs = newRemainingTabs.toSorted((a, b) => {
        const aIndex = tabs.findIndex((t) => t.id === a.id);
        const bIndex = tabs.findIndex((t) => t.id === b.id);
        return aIndex - bIndex;
      });

      const newOrder = [...sortedVisibleTabs, ...sortedRemainingTabs];

      setTabOrder(newOrder);

      const newValue = sortedVisibleTabs.findIndex((t) => t.id === tabId);
      setValue(newValue);
      setLastClickedTabId(tabId);
    },
    [tabOrder, visibleCount, tabs],
  );

  return {
    value,
    setValue,
    moreOpen,
    setMoreOpen,
    tabOrder,
    visibleCount,
    rootRef,
    measureRef,
    handleDropdownClick,
  };
};
