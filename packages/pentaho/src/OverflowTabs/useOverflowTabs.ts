import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import type { HvTabProps } from "@hitachivantara/uikit-react-core";

import {
  calculateVisibleTabCount,
  findSelectedTabIndex,
  getTabValue,
  reorderTabsWithSelection,
  restoreOriginalOrder,
} from "./utils";

export type OverflowTab = HvTabProps;

export interface UseOverflowTabsOptions {
  tabs: OverflowTab[];
  dropdownWidth?: number;
  value: unknown;
  onChange: (event: React.SyntheticEvent, value: unknown) => void;
}

export interface UseOverflowTabsReturn {
  selectedValue: unknown;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tabOrderIndices: number[];
  visibleCount: number;
  containerRef: React.Ref<HTMLDivElement>;
  measurementRef: React.RefObject<HTMLDivElement>;
  handleTabChange: (event: React.SyntheticEvent, value: unknown) => void;
  handleDropdownItemClick: (originalTabIndex: number) => void;
  getTabValue: (tab: OverflowTab, originalIndex: number) => unknown;
}

const DEFAULT_DROPDOWN_WIDTH = 128;

export function useOverflowTabs({
  tabs,
  dropdownWidth = DEFAULT_DROPDOWN_WIDTH,
  value,
  onChange,
}: UseOverflowTabsOptions): UseOverflowTabsReturn {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [tabOrderIndices, setTabOrderIndices] = useState<number[]>(() =>
    tabs.map((_, i) => i),
  );

  // Reset state synchronously when tabs change to prevent stale out-of-bounds indices
  const [prevTabs, setPrevTabs] = useState(tabs);
  if (tabs !== prevTabs) {
    setPrevTabs(tabs);
    setTabOrderIndices(tabs.map((_, i) => i));
    setVisibleCount(tabs.length);
  }

  const measurementRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth = 0, ref: containerRef } = useResizeDetector({
    handleHeight: false,
  });

  const selectedOriginalIndex = useMemo(
    () => findSelectedTabIndex(tabs, tabOrderIndices, value),
    [tabs, tabOrderIndices, value],
  );

  const recalculate = useCallback(() => {
    const tabList = measurementRef.current?.querySelector('[role="tablist"]');
    if (!tabList || containerWidth === 0) return;

    const tabElements = Array.from(tabList.children).filter(
      (el) => el.getAttribute("role") === "tab",
    ) as HTMLElement[];

    const newVisibleCount = calculateVisibleTabCount(
      tabElements,
      tabOrderIndices.length,
      containerWidth,
      dropdownWidth,
    );

    const selectedPosition = tabOrderIndices.indexOf(selectedOriginalIndex);
    const isSelectedHidden =
      selectedPosition >= newVisibleCount && newVisibleCount > 0;

    let newOrder: number[] | null = null;

    if (isSelectedHidden) {
      newOrder = reorderTabsWithSelection(
        tabOrderIndices,
        newVisibleCount,
        selectedOriginalIndex,
      );
    } else if (newVisibleCount > visibleCount) {
      newOrder = restoreOriginalOrder(tabOrderIndices, newVisibleCount);
    }

    if (newOrder !== null) {
      setTabOrderIndices(newOrder);
    }
    setVisibleCount(newVisibleCount);
  }, [
    containerWidth,
    tabOrderIndices,
    visibleCount,
    selectedOriginalIndex,
    dropdownWidth,
  ]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, val: unknown) => {
      onChange(event, val);
    },
    [onChange],
  );

  const handleDropdownItemClick = useCallback(
    (originalTabIndex: number) => {
      setDropdownOpen(false);
      onChange(
        null as unknown as React.SyntheticEvent,
        getTabValue(tabs[originalTabIndex], originalTabIndex),
      );
    },
    [tabs, onChange],
  );

  const selectedTab = tabs[selectedOriginalIndex];
  const selectedValue =
    selectedTab !== undefined
      ? getTabValue(selectedTab, selectedOriginalIndex)
      : value;

  return {
    selectedValue,
    dropdownOpen,
    setDropdownOpen,
    tabOrderIndices,
    visibleCount,
    containerRef,
    measurementRef,
    handleTabChange,
    handleDropdownItemClick,
    getTabValue,
  };
}
