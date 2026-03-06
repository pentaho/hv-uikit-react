import { forwardRef, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import {
  ExtractNames,
  HvActionGeneric,
  HvActionsGeneric,
  HvActionsGenericProps,
  HvBaseProps,
  HvPanel,
  theme,
  useControlled,
  useDefaultProps,
  useUniqueId,
} from "@hitachivantara/uikit-react-core";
import { mergeStyles } from "@hitachivantara/uikit-react-utils";

import { useCanvasContext } from "../CanvasContext";
import { HvCanvasPanelTab } from "../PanelTab";
import { HvCanvasPanelTabs, HvCanvasPanelTabsProps } from "../PanelTabs";
import { staticClasses, useClasses } from "./BottomPanel.styles";

const PANEL_RADIUS = 16;

export { staticClasses as canvasBottomPanelClasses };

export type HvCanvasBottomPanelClasses = ExtractNames<typeof useClasses>;

export interface HvCanvasBottomPanelProps extends HvBaseProps {
  /** Open state of the bottom panel. */
  open?: boolean;
  /** Minimize state of the bottom panel tabs'. */
  minimize?: boolean;
  /** List of tabs visible on the panel. */
  tabs: {
    id: string | number;
    title: React.ReactNode | ((overflowing: boolean) => React.ReactNode);
  }[];
  /** Id of the selected tab if it needs to be controlled. */
  selectedTabId?: string | number;
  /** Callback triggered when a tab changes/is clicked. */
  onTabChange?: (
    event: React.SyntheticEvent | null,
    tabId: string | number | null,
  ) => void;
  /**
   * Actions to be rendered in the left side of a tab.
   * If more than one action is provided, a dropdown menu will be used.
   * These actions are not shown when the tab content is overflowing.
   */
  leftActions?: HvActionsGenericProps["actions"];
  /**
   * Actions to be rendered in the right side of a tab.
   * If more than two actions are provided, a dropdown menu will be used to display the remaining actions.
   * These actions are not shown when the tab content is overflowing.
   */
  rightActions?: HvActionsGenericProps["actions"];
  /**
   * Actions to be rendered in the right side of a tab when the tab content is overflowing.
   * These actions will replace both `leftActions` and `rightActions`.
   */
  overflowActions?: HvActionsGenericProps["actions"];
  /** Callback triggered when an action is clicked. */
  onAction?: (
    event: React.SyntheticEvent,
    action: HvActionGeneric,
    tabId: string | number,
  ) => void;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasBottomPanelClasses;
}

/**
 * A bottom panel component to use in a canvas context.
 */
export const HvCanvasBottomPanel = forwardRef<
  HTMLDivElement,
  HvCanvasBottomPanelProps
>(function HvCanvasBottomPanel(props, ref) {
  const {
    id: idProp,
    className,
    children,
    open,
    tabs,
    minimize,
    leftActions,
    rightActions,
    overflowActions,
    selectedTabId: selectedTabIdProp,
    classes: classesProp,
    onTabChange,
    onAction,
    ...others
  } = useDefaultProps("HvCanvasBottomPanel", props);

  const { classes, cx } = useClasses(classesProp);

  const canvasContext = useCanvasContext();
  const sidePanelWidth = canvasContext?.sidePanelWidth ?? 0;

  const id = useUniqueId(idProp);

  const buttonsWidthRef = useRef(0);
  const [isTabsFullWidth, setIsTabsFullWidth] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  // Tab resize detector: to position tab actions and set the panel top right border radius
  const { ref: tabRef } = useResizeDetector({
    handleHeight: false,
    disableRerender: true,
    onResize({ width, entry }) {
      if (!overflowing && !buttonsWidthRef.current) {
        const tabContainer = entry?.target;

        const leftActionsWidth =
          tabContainer?.querySelector(".HvCanvasBottomPanel-leftActions")
            ?.clientWidth ?? 0;
        const rightActionsWidth =
          tabContainer?.querySelector(".HvCanvasBottomPanel-rightActions")
            ?.clientWidth ?? 0;

        buttonsWidthRef.current = leftActionsWidth + rightActionsWidth;
      }

      const hasSpace = (width || 0) - buttonsWidthRef.current > 60;
      setOverflowing(!hasSpace);
    },
  });

  // Tab panel resize detector: to set the panel top right border radius
  const { ref: panelRef } = useResizeDetector({
    handleHeight: false,
    disableRerender: true,
    onResize({ entry }) {
      const panelEl = entry?.target;
      if (!panelEl) return;
      const panelWidth = panelEl.clientWidth;

      const firstTab =
        panelEl.previousElementSibling?.firstElementChild?.firstElementChild;
      const tabWidth = firstTab?.clientWidth || 0;

      const numTabs = tabs.length;
      const tabsWidth = numTabs * tabWidth;
      setIsTabsFullWidth(tabsWidth + PANEL_RADIUS >= panelWidth);
    },
  });

  const [selectedTab, setSelectedTab] = useControlled<string | number | null>(
    selectedTabIdProp,
    tabs[0].id,
  );

  const handleTabChange: HvCanvasPanelTabsProps["onChange"] = (
    event,
    tabId,
  ) => {
    setSelectedTab(tabId);
    onTabChange?.(event, tabId);
  };

  const renderEndActions = (tab: any) => {
    const btnsDisabled = selectedTab !== tab.id && !minimize;
    if (rightActions && !overflowing) {
      return (
        <HvActionsGeneric
          maxVisibleActions={2}
          actions={rightActions}
          disabled={btnsDisabled}
          className={cx(classes.rightActions, {
            [classes.actionsDisabled]: btnsDisabled,
          })}
          onAction={(event, action) => onAction?.(event, action, tab.id)}
          variant="secondaryGhost"
          iconOnly
        />
      );
    }

    if (overflowActions && overflowing) {
      return (
        <HvActionsGeneric
          maxVisibleActions={0}
          actions={overflowActions}
          disabled={btnsDisabled}
          className={cx(classes.rightActions, {
            [classes.actionsDisabled]: btnsDisabled,
          })}
          onAction={(event, action) => onAction?.(event, action, tab.id)}
          variant="secondaryGhost"
          iconOnly
        />
      );
    }

    return null;
  };

  return (
    <div
      id={id}
      ref={ref}
      className={cx(
        classes.root,
        {
          [classes.closed]: !open,
          [classes.minimized]: minimize,
          [classes.multipleTabs]: tabs.length > 1,
          [classes.overflowing]: overflowing,
        },
        className,
      )}
      style={{
        width: `calc(100% - ${sidePanelWidth}px - 2 * ${theme.space.sm})`,
        right: theme.space.sm,
        transition: canvasContext?.sidePanelDragging
          ? "height 0.3s ease, opacity 0.3s ease"
          : "width 0.3s ease",
      }}
      {...others}
    >
      <HvCanvasPanelTabs
        onChange={handleTabChange}
        value={selectedTab}
        className={classes.tabsRoot}
      >
        {tabs.map((tab, index) => (
          <HvCanvasPanelTab
            ref={index === 0 ? tabRef : undefined}
            key={tab.id}
            id={`${id}-${tab.id}`}
            value={tab.id}
            className={classes.tab}
            startActions={
              leftActions &&
              !overflowing && (
                <HvActionsGeneric
                  maxVisibleActions={1}
                  actions={leftActions}
                  disabled={selectedTab !== tab.id && !minimize}
                  className={cx(classes.leftActions, {
                    [classes.actionsDisabled]:
                      selectedTab !== tab.id && !minimize,
                  })}
                  onAction={(event, action) =>
                    onAction?.(event, action, tab.id)
                  }
                  variant="secondaryGhost"
                  iconOnly
                />
              )
            }
            endActions={renderEndActions(tab)}
          >
            {typeof tab.title === "function"
              ? tab.title(overflowing)
              : tab.title}
          </HvCanvasPanelTab>
        ))}
      </HvCanvasPanelTabs>
      <HvPanel
        ref={panelRef}
        role="tabpanel"
        aria-labelledby={`${id}-${selectedTab}`}
        className={classes.content}
        style={mergeStyles(undefined, {
          "--right-border-radius": isTabsFullWidth ? 0 : `${PANEL_RADIUS}px`,
        })}
      >
        {children}
      </HvPanel>
    </div>
  );
});
