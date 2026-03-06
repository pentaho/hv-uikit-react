import { forwardRef, useRef } from "react";
import { Tab, TabProps } from "@mui/base";
import {
  ExtractNames,
  useDefaultProps,
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
    startActions,
    endActions,
    ...others
  } = useDefaultProps("HvCanvasPanelTab", props);
  const tabRef = useRef<HTMLButtonElement>(null);

  const { classes, cx } = useClasses(classesProp);

  return (
    <div
      ref={ref as any}
      className={cx(classes.root, className)}
      // oxlint-disable-next-line jsx_a11y/click-events-have-key-events simulate tab click
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
