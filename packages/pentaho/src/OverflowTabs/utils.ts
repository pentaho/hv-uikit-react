/** Calculate how many tabs fit in available width */
export function calculateVisibleTabCount(
  tabElements: HTMLElement[],
  totalTabs: number,
  availableWidth: number,
  dropdownWidth: number,
): number {
  if (availableWidth === 0 || tabElements.length === 0) {
    return 0;
  }

  let accumulatedWidth = 0;
  let visibleCount = 0;

  for (let i = 0; i < tabElements.length; i++) {
    const tabWidth = Math.ceil(tabElements[i].offsetWidth);
    const willNeedDropdown = i + 1 < totalTabs;
    const requiredWidth =
      accumulatedWidth + tabWidth + (willNeedDropdown ? dropdownWidth : 0);

    if (requiredWidth > availableWidth) {
      break;
    }

    accumulatedWidth += tabWidth;
    visibleCount++;
  }

  return Math.max(0, visibleCount);
}

/** Reorder tabs to make selected tab visible */
export function reorderTabsWithSelection(
  currentOrder: number[],
  visibleCount: number,
  selectedIndex: number,
): number[] {
  if (visibleCount === 0 || currentOrder.length === 0) {
    return currentOrder;
  }

  const displacedTabIndex = currentOrder[visibleCount - 1];

  const newVisibleTabs = [
    ...currentOrder.slice(0, visibleCount - 1),
    selectedIndex,
  ].toSorted((a, b) => a - b);

  const newOverflowTabs = [
    displacedTabIndex,
    ...currentOrder.slice(visibleCount).filter((i) => i !== selectedIndex),
  ].toSorted((a, b) => a - b);

  return [...newVisibleTabs, ...newOverflowTabs];
}

/** Restore original order when more space is available */
export function restoreOriginalOrder(
  currentOrder: number[],
  newVisibleCount: number,
): number[] {
  if (newVisibleCount === 0 || currentOrder.length === 0) {
    return currentOrder;
  }

  const visibleTabs = currentOrder
    .slice(0, newVisibleCount)
    .toSorted((a, b) => a - b);
  const overflowTabs = currentOrder.slice(newVisibleCount);

  return [...visibleTabs, ...overflowTabs];
}

/** Get tab value (custom value or index) */
export function getTabValue<T extends { value?: unknown }>(
  tab: T,
  index: number,
): unknown {
  if (!tab) {
    return index;
  }
  return tab.value !== undefined ? tab.value : index;
}

/** Find original index of selected tab */
export function findSelectedTabIndex<T extends { value?: unknown }>(
  tabs: T[],
  tabOrderIndices: number[],
  value: unknown,
): number {
  const position = tabOrderIndices.findIndex(
    (i) => getTabValue(tabs[i], i) === value,
  );
  return position !== -1
    ? tabOrderIndices[position]
    : (tabOrderIndices[0] ?? 0);
}
