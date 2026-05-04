import { forwardRef, useRef } from "react";
import { Tab, type TabProps } from "@mui/base";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-core";

import { staticClasses, useClasses } from "./PanelTab.styles";

export { staticClasses as canvasPanelTabClasses };

export type HvCanvasPanelTabClasses = ExtractNames<typeof useClasses>;

export interface HvCanvasPanelTabProps extends TabProps {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasPanelTabClasses;
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
  const tabRef = useRef<HTMLButtonElement>(null);

  const { classes, cx } = useClasses(classesProp);

  return (
    // oxlint-disable-next-line jsx_a11y/click-events-have-key-events,jsx_a11y/no-static-element-interactions, simulate tab click
    <div
      ref={ref as any}
      style={style}
      className={cx(classes.root, className)}
      onClick={(evt) => {
        if (evt.target === tabRef.current) return; // stop propagation
        tabRef.current?.click();
      }}
    >
      {startActions}
      <Tab ref={tabRef} className={classes.tab} {...others} />
      {endActions}
    </div>
  );
});
