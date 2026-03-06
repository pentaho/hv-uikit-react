import { forwardRef, useMemo, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import {
  ExtractNames,
  HvBaseProps,
  HvButton,
  HvButtonProps,
  HvDropDownMenu,
  HvOverflowTooltip,
  isKey,
  uniqueId,
  useControlled,
  useDefaultProps,
  useForkRef,
  useLabels,
} from "@hitachivantara/uikit-react-core";
import {
  AddAlt,
  CloseXS,
  MoreOptionsHorizontal,
} from "@hitachivantara/uikit-react-icons";
import { clamp } from "@hitachivantara/uikit-react-utils";

import { HvCanvasPanelTab } from "../PanelTab";
import { HvCanvasPanelTabs, HvCanvasPanelTabsProps } from "../PanelTabs";
import { ToolbarTabEditor } from "./ToolbarTabEditor";
import {
  DROPDOWN_MENU_WIDTH,
  MAX_TAB_WIDTH,
  MIN_TAB_WIDTH,
  staticClasses,
  useClasses,
} from "./ToolbarTabs.styles";

export { staticClasses as canvasToolbarTabsClasses };

export type HvCanvasToolbarTabsClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  create: "Create new",
  undefined: "Undefined",
  dropdownMenu: "Dropdown menu",
};

interface ToolbarTabsTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Whether the tab is fixed and can't be removed. Defaults to `false`, i.e., all tabs are removable by default. */
  fixed?: boolean;
}

export interface HvCanvasToolbarTabsProps
  extends HvBaseProps<HTMLDivElement, "onChange"> {
  /** When controlled, defines the tabs. */
  tabs?: ToolbarTabsTab[];
  /** When uncontrolled, defines the initial tabs. */
  defaultTabs?: ToolbarTabsTab[];
  /** Id of the selected tab if it needs to be controlled. */
  selectedTabId?: string;
  /** Defines the icon to be placed before the label when a new tab is created through the "Create new" button. If not defined, no icon is used. */
  icon?: React.ReactNode;
  /** Whether the tabs are editable or not. Default to `false`. */
  disableTabEdit?: boolean;
  /** Callback triggered when a tab changes/is clicked. */
  onTabChange?: (
    event: React.SyntheticEvent | null,
    tabId: string | null,
  ) => void;
  /** Callback triggered when the tabs change: new tab added, tab removed, tab reorder, and label updated. */
  onChange?: (
    event: React.MouseEvent<HTMLButtonElement> | React.SyntheticEvent,
    tabs: ToolbarTabsTab[],
  ) => void;
  /** An object containing all the labels. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasToolbarTabsClasses;
  /** Whether the "Create new" button, which enables to create new tabs, is hidden. Defaults to `false`. */
  hideCreateNew?: boolean;
}

/**
 * A toolbar tabs component to use in a canvas context.
 */
export const HvCanvasToolbarTabs = forwardRef<
  HTMLDivElement,
  HvCanvasToolbarTabsProps
>(function HvCanvasToolbarTabs(props, ref) {
  const {
    children,
    className,
    selectedTabId: selectedTabIdProp,
    icon: iconProp,
    disableTabEdit = false,
    hideCreateNew = false,
    tabs: tabsProp,
    defaultTabs: defaultTabsProp = [],
    labels: labelsProp,
    classes: classesProp,
    onTabChange: onTabChangeProp,
    onChange: onChangeProp,
    ...others
  } = useDefaultProps("HvCanvasToolbarTabs", props);

  const { classes, cx } = useClasses(classesProp);

  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  // Actions resize detector: to know when to use the dropdown menu
  const { width: actionsWidth = 0, ref: actionsRef } = useResizeDetector({
    handleHeight: false,
  });

  // Root resize detector: to know when to use the dropdown menu
  const { width: rootWidth = 0, ref: rootRef } = useResizeDetector({
    handleHeight: false,
  });

  const [tabs, setTabs] = useControlled(tabsProp, defaultTabsProp);
  const [selectedTab, setSelectedTab] = useControlled<string | null>(
    selectedTabIdProp,
    tabs?.[0]?.id ?? "none",
  );
  const [isEditing, setIsEditing] = useState(false);

  const rootForkedRef = useForkRef(ref, rootRef);

  const handleChangeTabs = (
    event: React.MouseEvent<HTMLButtonElement> | React.SyntheticEvent,
    newTabs: ToolbarTabsTab[],
  ) => {
    setTabs(newTabs);
    onChangeProp?.(event, newTabs);
  };

  const handleChangeSelectedTab: HvCanvasPanelTabsProps["onChange"] = (
    event,
    value,
  ) => {
    setSelectedTab(String(value));
    onTabChangeProp?.(event, String(value));
  };

  const handleCreateNew: HvButtonProps["onClick"] = (event) => {
    const newTabs: ToolbarTabsTab[] = [...tabs];
    const newTab: ToolbarTabsTab = {
      id: uniqueId(),
      label: `${labels.undefined} ${newTabs.length + 1}`,
      icon: iconProp,
    };
    newTabs.push(newTab);
    handleChangeSelectedTab(event, newTab.id);
    handleChangeTabs?.(event, newTabs);
  };

  const handleEdit = (
    event: React.FormEvent<Element>,
    value: string,
    tabId: string,
  ) =>
    handleChangeTabs(
      event,
      tabs.map((tab) => (tab.id === tabId ? { ...tab, label: value } : tab)),
    );

  const handleDeleteTab = (event: any, tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);

    if (tabId === selectedTab) {
      const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
      const newIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
      handleChangeSelectedTab(event, newTabs[newIndex]?.id ?? "none");
    }

    handleChangeTabs(event, newTabs);
  };

  const handleKeyDownTab = (
    event: React.KeyboardEvent,
    tabId: string,
    removable: boolean,
  ) => {
    if (removable && (isKey(event, "Delete") || isKey(event, "Backspace"))) {
      handleDeleteTab(event, tabId);

      // We don't want the click to also select the tab
      event.stopPropagation();
    } else if (isKey(event, "Enter")) {
      // Activate edit label mode
      setIsEditing(true);
    }
  };

  const { tabWidth, hiddenTabs, visibleTabs } = useMemo(() => {
    let availableWidth = rootWidth - actionsWidth;
    let calculatedTabWidth = availableWidth / tabs.length;
    let clamped = clamp(calculatedTabWidth, MAX_TAB_WIDTH, MIN_TAB_WIDTH);

    // Overflowing
    if (calculatedTabWidth < MIN_TAB_WIDTH) {
      availableWidth -= DROPDOWN_MENU_WIDTH;
      const visibleCount = Math.floor(availableWidth / MIN_TAB_WIDTH);
      calculatedTabWidth = availableWidth / visibleCount;
      clamped = clamp(calculatedTabWidth, MAX_TAB_WIDTH, MIN_TAB_WIDTH);

      const temporaryHiddenTabs = tabs.slice(visibleCount);
      const selectedTabHiddenIndex = temporaryHiddenTabs.findIndex(
        (tab) => tab.id === selectedTab,
      );
      const excludedTabIndex = visibleCount - 1;
      const shouldShuffle = selectedTabHiddenIndex !== -1 && visibleCount > 0;

      if (shouldShuffle) {
        return {
          tabWidth: clamped,
          visibleTabs: [
            ...tabs.slice(0, excludedTabIndex),
            temporaryHiddenTabs[selectedTabHiddenIndex],
          ].filter(Boolean),
          hiddenTabs: [
            tabs[excludedTabIndex],
            ...temporaryHiddenTabs.filter(
              (tab, i) => i !== selectedTabHiddenIndex,
            ),
          ].filter(Boolean),
        };
      }

      return {
        tabWidth: clamped,
        visibleTabs: tabs.slice(0, visibleCount),
        hiddenTabs: temporaryHiddenTabs,
      };
    }

    return {
      tabWidth: clamped,
      visibleTabs: tabs,
      hiddenTabs: [],
    };
  }, [actionsWidth, rootWidth, selectedTab, tabs]);

  return (
    <div
      ref={rootForkedRef}
      className={cx(classes.root, className)}
      {...others}
    >
      <div className={classes.tabsContainer}>
        {visibleTabs.length > 0 && (
          <HvCanvasPanelTabs
            classes={{ list: classes.tabsList }}
            value={selectedTab}
            onChange={handleChangeSelectedTab}
          >
            {visibleTabs.map((tab, index) => {
              const btnSelected = selectedTab === tab.id;
              const removable = !tab.fixed;
              return (
                <HvCanvasPanelTab
                  style={{
                    width: tabWidth,
                  }}
                  key={tab.id}
                  id={String(tab.id)}
                  classes={{ root: classes.tab, tab: classes.tabContent }}
                  value={tab.id}
                  onKeyDown={(event) =>
                    handleKeyDownTab(event, tab.id, removable)
                  }
                >
                  {tab.icon && (
                    <div className={classes.tabIconContainer}>{tab.icon}</div>
                  )}
                  {!btnSelected || disableTabEdit ? (
                    <HvOverflowTooltip
                      classes={{
                        tooltipAnchor: classes.tabLabel,
                      }}
                      data={tab.label}
                    />
                  ) : (
                    <ToolbarTabEditor
                      classes={{
                        label: cx(classes.tabLabel, classes.tabLabelEditor),
                      }}
                      value={tab.label}
                      edit={isEditing}
                      onEditChange={setIsEditing}
                      onChange={(event, value) =>
                        handleEdit(event, value, tab.id)
                      }
                      onBlur={(event, value) =>
                        handleEdit(event, value, tab.id)
                      }
                      // We don't want the arrow keys to trigger the tab navigation
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  )}
                  {removable && (
                    <div className={classes.closeIconContainer}>
                      <CloseXS
                        aria-hidden
                        size="xs"
                        onClick={(event) => {
                          handleDeleteTab(event, tab.id);

                          // We don't want the click to also select the tab
                          event.stopPropagation();
                        }}
                      />
                    </div>
                  )}
                  {selectedTab !== tab.id &&
                    visibleTabs[index + 1]?.id !== selectedTab && (
                      <div className={classes.tabDivider} />
                    )}
                </HvCanvasPanelTab>
              );
            })}
          </HvCanvasPanelTabs>
        )}
        {hiddenTabs.length > 0 && (
          <div className={classes.dropdownMenuContainer}>
            <HvDropDownMenu
              classes={{
                menuListRoot: classes.dropdownMenuListRoot,
              }}
              dataList={hiddenTabs}
              icon={<MoreOptionsHorizontal />}
              labels={{ dropdownMenu: labels.dropdownMenu }}
              onClick={(event, value) =>
                handleChangeSelectedTab(event, value.id ?? "none")
              }
            />
          </div>
        )}
      </div>
      <div ref={actionsRef} className={classes.actionsContainer}>
        {children}
        {!hideCreateNew && (
          <HvButton
            variant="primaryGhost"
            startIcon={<AddAlt />}
            onClick={handleCreateNew}
          >
            {labels.create}
          </HvButton>
        )}
      </div>
    </div>
  );
});
