import { forwardRef } from "react";
import {
  HvBadge,
  HvBaseDropdown,
  HvButton,
  HvIcon,
  HvIconContainer,
  HvListContainer,
  HvListItem,
  HvPanel,
  HvTab,
  HvTabs,
  theme,
  type HvBaseDropdownProps,
  type HvTabProps,
} from "@hitachivantara/uikit-react-core";

import { useClasses } from "./OverflowTabs.styles";
import { useOverflowTabs, type OverflowTab } from "./useOverflowTabs";

export type { OverflowTab };

export interface OverflowTabsProps {
  /** Array of tab configurations */
  tabs: OverflowTab[];
  /** Whether tabs are in floating mode (no bottom border) */
  floating?: boolean;
  /** Size of the tabs */
  size?: "sm" | "md" | "lg";
  /** Position of icons in tabs */
  iconPosition?: HvTabProps["iconPosition"];
  /** Width reserved for the dropdown button in pixels */
  dropdownWidth?: number;
  /** Currently selected tab value (controlled) */
  value: any;
  /** Callback when tab selection changes */
  onChange: (event: React.SyntheticEvent, value: any) => void;
}

interface OverflowDropdownButtonProps extends React.ComponentProps<"button"> {
  /** Number of overflow tabs */
  count?: number;
  /** Whether tabs are in floating mode */
  floating?: boolean;
  /** Size of the tabs */
  size?: "sm" | "md" | "lg";
}

const TAB_HEIGHT: Record<NonNullable<OverflowTabsProps["size"]>, number> = {
  sm: 32,
  md: 48,
  lg: 64,
};

function renderTab(
  tabs: OverflowTab[],
  tabIndex: number,
  iconPosition: HvTabProps["iconPosition"],
  getTabValue?: (tab: OverflowTab, index: number) => unknown,
) {
  const tab = tabs[tabIndex];

  if (!tab) {
    return null;
  }

  // Only extract valid HvTab props to avoid passing custom properties to DOM
  const { icon, label, disabled, id } = tab;

  return (
    <HvTab
      key={id ?? `tab-${tabIndex}`}
      iconPosition={iconPosition}
      label={label}
      disabled={disabled}
      {...(getTabValue ? { value: getTabValue(tab, tabIndex) } : {})}
      icon={icon ? <HvIconContainer>{icon}</HvIconContainer> : undefined}
    />
  );
}

const OverflowDropdownButton = forwardRef<
  HTMLButtonElement,
  OverflowDropdownButtonProps
>((props, ref) => {
  const {
    count,
    floating,
    className,
    "aria-expanded": ariaExpanded,
    ...others
  } = props;
  const { classes, cx } = useClasses();

  if (count === 0) return null;

  return (
    <HvButton
      ref={ref}
      className={cx(classes.dropdownButton, className, {
        [classes.dropdownButtonFloating]: floating,
      })}
      variant="secondaryGhost"
      radius={floating ? undefined : "base"}
      aria-expanded={ariaExpanded}
      endIcon={
        <HvIcon compact name="CaretDown" size="xs" rotate={!!ariaExpanded} />
      }
      {...others}
    >
      More
      <HvBadge
        color={floating ? "text" : "textSubtle"}
        showCount
        label={count}
        className={classes.badge}
      />
    </HvButton>
  );
});

OverflowDropdownButton.displayName = "OverflowDropdownButton";

/**
 * Tabs that automatically overflow into a “More” dropdown when space is limited, keeping the selected tab visible through intelligent reordering.
 * API-aligned with [HvTabs](https://pentaho.github.io/uikit-docs/master/components/tabs).
 */
export const OverflowTabs = ({
  tabs,
  floating = false,
  size = "md",
  iconPosition = "start",
  dropdownWidth = 128,
  value,
  onChange,
}: OverflowTabsProps) => {
  const { classes, cx } = useClasses();

  const {
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
  } = useOverflowTabs({ tabs, dropdownWidth, value, onChange });

  const setFocusToDropdownContent: HvBaseDropdownProps["onContainerCreation"] =
    (containerElement) => {
      if (!containerElement) return;

      const listItems = containerElement.querySelectorAll<HTMLLIElement>("li");
      for (const item of listItems) {
        if (item.tabIndex >= 0) {
          item.focus();
          break;
        }
      }
    };

  // Split tabs into visible and overflow
  const visibleTabIndices = tabOrderIndices.slice(0, visibleCount);
  const overflowTabIndices = tabOrderIndices.slice(visibleCount);
  const hasOverflow = overflowTabIndices.length > 0;

  // Check if the selectedValue actually matches one of the visible tabs
  const isSelectedVisible = visibleTabIndices.some((tabIndex) => {
    const tab = tabs[tabIndex];
    return tab && getTabValue(tab, tabIndex) === selectedValue;
  });

  // Verify selectedValue matches at least one tab to prevent MUI validation errors
  const isValidValue = tabs.some(
    (tab, index) => tab && getTabValue(tab, index) === selectedValue,
  );

  // Use `false` when selected tab is not visible or value is invalid
  const hvTabsValue = isSelectedVisible && isValidValue ? selectedValue : false;

  return (
    <>
      {/* Main tabs container */}
      <div ref={containerRef} className={classes.root}>
        <div
          style={{ ["--tab-height" as string]: `${TAB_HEIGHT[size] + 3}px` }}
          className={cx(classes.tabsContainer, {
            [classes.tabsContainerFloating]: floating,
          })}
        >
          <HvTabs
            floating={floating}
            value={hvTabsValue}
            onChange={handleTabChange}
            classes={{ flexContainer: classes.tabsFlexContainer }}
          >
            {visibleTabIndices.map((tabIndex) =>
              renderTab(tabs, tabIndex, iconPosition, getTabValue),
            )}
          </HvTabs>

          {/* Overflow dropdown outside HvTabs */}
          {hasOverflow && (
            <HvBaseDropdown
              headerComponent={OverflowDropdownButton}
              {...({
                count: overflowTabIndices.length,
                floating,
                size,
              } satisfies OverflowDropdownButtonProps)}
              variableWidth
              placement="left"
              expanded={dropdownOpen}
              onToggle={() => setDropdownOpen((prev) => !prev)}
              onContainerCreation={setFocusToDropdownContent}
              className={classes.dropdownWrapper}
            >
              <HvPanel>
                <HvListContainer interactive>
                  {overflowTabIndices.map((tabIndex) => {
                    const tab = tabs[tabIndex];

                    if (!tab) return null;

                    const tabValue = getTabValue(tab, tabIndex);
                    const isActive = selectedValue === tabValue;

                    return (
                      <HvListItem
                        key={tab.id ?? `tab-${tabIndex}`}
                        value={tab.label}
                        onClick={() => handleDropdownItemClick(tabIndex)}
                        style={{
                          color: isActive ? theme.colors.primary : "inherit",
                          fontWeight: isActive
                            ? theme.fontWeights.semibold
                            : "inherit",
                        }}
                      >
                        {tab.label}
                      </HvListItem>
                    );
                  })}
                </HvListContainer>
              </HvPanel>
            </HvBaseDropdown>
          )}
        </div>
      </div>

      {/* Hidden measurement container */}
      <div ref={measurementRef} className={classes.measurementContainer}>
        <HvTabs
          floating={floating}
          value={false}
          classes={{ flexContainer: classes.measurementFlexContainer }}
        >
          {tabOrderIndices.map((tabIndex) =>
            renderTab(tabs, tabIndex, iconPosition, getTabValue),
          )}
        </HvTabs>
      </div>
    </>
  );
};
