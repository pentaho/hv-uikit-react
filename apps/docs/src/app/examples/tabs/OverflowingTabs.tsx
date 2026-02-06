import { forwardRef } from "react";
import {
  HvBadge,
  HvBaseDropdown,
  HvBaseDropdownProps,
  HvButton,
  HvIconContainer,
  HvListContainer,
  HvListItem,
  HvPanel,
  HvTab,
  HvTabProps,
  HvTabs,
  theme,
} from "@hitachivantara/uikit-react-core";

import { OverflowTab, useTabs } from "./useTabs";

export type { OverflowTab };

interface OverflowingTabsProps {
  tabs: OverflowTab[];
  floating?: boolean;
  size?: "sm" | "md" | "lg";
  iconPosition?: HvTabProps["iconPosition"];
  dropdownWidth?: number;
}

interface OverflowComponentProps {
  count?: number;
  [key: string]: any;
}

const tabSizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

export const OverflowComponent = forwardRef<
  HTMLDivElement,
  OverflowComponentProps
>((props, ref) => {
  const { count, floating, ...otherProps } = props;

  if (count === 0) return null;

  return (
    <div ref={ref} {...otherProps}>
      <HvButton
        className="mt-2px font-normal h-full"
        variant="secondaryGhost"
        endIcon={
          <HvIconContainer>
            <div className="i-ph-caret-down" />
          </HvIconContainer>
        }
      >
        More
        <HvBadge
          color={floating ? "text" : "textSubtle"}
          showCount
          label={count}
          classes={{ root: "ml-[-8px] mr-sm", badge: "relative" }}
        />
      </HvButton>
    </div>
  );
});

export const OverflowingTabs = ({
  tabs,
  floating = false,
  size = "sm",
  iconPosition = "start",
  dropdownWidth = 128,
}: OverflowingTabsProps) => {
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
    dropdownWidth,
  });

  const setFocusToContent: HvBaseDropdownProps["onContainerCreation"] = (
    containerRef,
  ) => {
    const listItems =
      containerRef != null ? [...containerRef.getElementsByTagName("li")] : [];

    listItems.every((listItem) => {
      if (listItem.tabIndex >= 0) {
        listItem.focus();
        return false;
      }
      return true;
    });
  };

  return (
    <>
      <div ref={rootRef} style={{ width: "100%" }}>
        <HvTabs
          floating={floating}
          value={value}
          onChange={(_, val) => setValue(val)}
        >
          {tabOrder.slice(0, visibleCount).map((tab: OverflowTab) => (
            <HvTab
              key={tab.id}
              iconPosition={iconPosition}
              {...tab}
              icon={
                tab.icon ? (
                  <HvIconContainer>{tab.icon}</HvIconContainer>
                ) : undefined
              }
              style={{ height: tabSizeMap[size] }}
            />
          ))}
          {visibleCount < tabOrder.length && (
            <HvBaseDropdown
              headerComponent={OverflowComponent}
              {...({ count: tabOrder.length - visibleCount, floating } as any)}
              variableWidth
              placement="left"
              expanded={moreOpen}
              onToggle={() => setMoreOpen((p) => !p)}
              onContainerCreation={setFocusToContent}
              style={{
                height: tabSizeMap[size],
              }}
              className="flex items-center"
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
        <HvTabs
          floating={floating}
          value={0}
          classes={{
            flexContainer: "items-center",
          }}
        >
          {tabOrder.map((tab: OverflowTab) => (
            <HvTab
              key={tab.id}
              iconPosition={iconPosition}
              {...tab}
              icon={
                tab.icon ? (
                  <HvIconContainer>{tab.icon}</HvIconContainer>
                ) : undefined
              }
              style={{ height: tabSizeMap[size] }}
            />
          ))}
        </HvTabs>
      </div>
    </>
  );
};
