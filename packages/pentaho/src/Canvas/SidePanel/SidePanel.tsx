import { forwardRef, useEffect } from "react";
import {
  ExtractNames,
  HvBaseProps,
  HvIconButton,
  HvPanel,
  useControlled,
  useDefaultProps,
  useLabels,
  useUniqueId,
} from "@hitachivantara/uikit-react-core";
import { End } from "@hitachivantara/uikit-react-icons";

import { useCanvasContext } from "../CanvasContext";
import { HvCanvasPanelTab } from "../PanelTab";
import { HvCanvasPanelTabs, HvCanvasPanelTabsProps } from "../PanelTabs";
import { staticClasses, useClasses } from "./SidePanel.styles";
import { useResizable } from "./useResizable";

export { staticClasses as canvasSidePanelClasses };

export type HvCanvasSidePanelClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  open: "Open",
  close: "Close",
};

export interface HvCanvasSidePanelProps
  extends HvBaseProps<HTMLDivElement, "onToggle"> {
  /** When controlled, defines id the panel is open or not. */
  open?: boolean;
  /** When uncontrolled, defines the initial state of the panel. */
  defaultOpen?: boolean;
  /** List of tabs visible on the panel. */
  tabs?: {
    id: string | number;
    content: React.ReactNode;
  }[];
  /** Id of the selected tab if it needs to be controlled. */
  tab?: string | number;
  /** Callback triggered whenever the panel toggles. */
  onToggle?: (
    event: React.MouseEvent | React.KeyboardEvent,
    open: boolean,
  ) => void;
  /** Callback triggered when a tab changes/is clicked. */
  onTabChange?: (
    event: React.SyntheticEvent | null,
    tabId: string | number | null,
  ) => void;
  /** An object containing all the labels. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** The minimum width of the side panel. */
  minWidth?: number;
  /** The maximum width of the side panel. */
  maxWidth?: number;
  /** The initial width of the side panel. */
  initialWidth?: number;
  /** Callback triggered when the panel width changes. */
  onResize?: (width: number) => void;
  /** The content that will be rendered within the canvas panel. */
  children?: React.ReactNode;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasSidePanelClasses;
}

/**
 * A side panel component to use in a canvas context.
 */
export const HvCanvasSidePanel = forwardRef<
  HTMLDivElement,
  HvCanvasSidePanelProps
>(function HvCanvasSidePanel(props, ref) {
  const {
    id: idProp,
    tab: tabProp,
    open: openProp,
    defaultOpen = false,
    tabs,
    onToggle,
    onTabChange,
    labels: labelsProp,
    minWidth = 100,
    maxWidth = 500,
    initialWidth = 320,
    onResize,
    className,
    children,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvCanvasSidePanel", props);

  const id = useUniqueId(idProp);

  const {
    handleSidePanelWidth,
    sidePanelOpen,
    handleSidePanelOpen,
    handleSidePanelDragging,
  } = useCanvasContext() || {};

  const { classes, cx } = useClasses(classesProp);

  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  const [open, setOpen] = useControlled(openProp, defaultOpen);
  const [selectedTab, setSelectedTab] = useControlled<string | number | null>(
    tabProp,
    tabs?.[0]?.id ?? "none",
  );

  useEffect(() => {
    handleSidePanelOpen?.(open);
  }, [handleSidePanelOpen, open]);

  useEffect(() => {
    handleSidePanelWidth?.(initialWidth);
  }, [handleSidePanelWidth, initialWidth]);

  const updateWidth = (width: number) => {
    handleSidePanelWidth?.(width);
    onResize?.(width);
  };

  const { width, isDragging, getContainerProps, getSeparatorProps } =
    useResizable({
      ref,
      initialWidth,
      minWidth,
      maxWidth,
      onResize: updateWidth,
    });

  useEffect(() => {
    handleSidePanelDragging?.(isDragging);
  }, [handleSidePanelDragging, isDragging]);

  const handleTogglePanel = (event: React.MouseEvent | React.KeyboardEvent) => {
    setOpen((prev) => !prev);
    handleSidePanelOpen?.(!sidePanelOpen);
    onToggle?.(event, !open);
  };

  const handleTabChange: HvCanvasPanelTabsProps["onChange"] = (
    event,
    tabId,
  ) => {
    setSelectedTab(tabId);
    onTabChange?.(event, tabId);
  };

  return (
    <>
      <div
        id={id}
        className={cx(classes.root, className, {
          [classes.open]: open,
          [classes.close]: !open,
        })}
        {...getContainerProps({ style: { ...(!open && { width: 0 }) } })}
        {...others}
      >
        {tabs && (
          <HvCanvasPanelTabs
            className={classes.tabs}
            value={selectedTab}
            onChange={handleTabChange}
          >
            {tabs.map((tab) => (
              <HvCanvasPanelTab
                key={tab.id}
                id={`${id}-${tab.id}`}
                value={tab.id}
              >
                {tab.content}
              </HvCanvasPanelTab>
            ))}
          </HvCanvasPanelTabs>
        )}
        <HvPanel
          role={tabs ? "tabpanel" : undefined}
          aria-labelledby={tabs ? `${id}-${selectedTab}` : undefined}
          className={classes.content}
        >
          {children}
        </HvPanel>
      </div>
      <div
        data-resizing={isDragging || undefined}
        className={classes.separator}
        {...getSeparatorProps()}
      />
      <HvIconButton
        variant="primaryGhost"
        title={open ? labels.close : labels.open}
        onClick={handleTogglePanel}
        data-open={open || undefined}
        className={classes.handle}
        style={{
          left: open ? width : 0,
          transition: isDragging ? "none" : undefined,
        }}
      >
        <End rotate={open} />
      </HvIconButton>
    </>
  );
});
