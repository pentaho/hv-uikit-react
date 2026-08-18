import { forwardRef, useRef } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-core";

import { staticClasses, useClasses } from "./PanelTab.styles";

export { staticClasses as canvasPanelTabClasses };

export type HvCanvasPanelTabClasses = ExtractNames<typeof useClasses>;

export interface HvCanvasPanelTabProps extends Omit<Tabs.Tab.Props, "style"> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasPanelTabClasses;
  /** Inline styles for the panel tab container. */
  style?: React.CSSProperties;
  /** Start actions to be rendered in the tab. */
  startActions?: React.ReactNode;
  /** End actions to be rendered in the tab. */
  endActions?: React.ReactNode;
}

/**
 * The tab component to use inside `HvCanvasPanelTabs`.
 */
export const HvCanvasPanelTab = forwardRef<
  HTMLButtonElement,
  HvCanvasPanelTabProps
>(function HvCanvasPanelTab(props, ref) {
  const {
    classes: classesProp,
    className,
    style,
    startActions,
    endActions,
    ...others
  } = useDefaultProps("HvCanvasPanelTab", props);
  const tabRef = useRef<HTMLElement>(null);

  const { classes, cx } = useClasses(classesProp);

  return (
    // oxlint-disable-next-line jsx_a11y/click-events-have-key-events,jsx_a11y/no-static-element-interactions, simulate tab click
    <div
      ref={ref as any}
      style={style}
      className={cx(classes.root, className)}
      onClick={(evt) => {
        if (evt.target === tabRef.current) return; // stop propagation
        (tabRef.current as HTMLButtonElement | null)?.click();
      }}
    >
      {startActions}
      <Tabs.Tab ref={tabRef} className={classes.tab} {...others} />
      {endActions}
    </div>
  );
});
