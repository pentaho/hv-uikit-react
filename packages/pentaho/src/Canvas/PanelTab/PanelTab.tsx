import { forwardRef } from "react";
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
    ...others
  } = useDefaultProps("HvCanvasPanelTab", props);

  const { classes, cx } = useClasses(classesProp);

  return <Tab ref={ref} className={cx(classes.root, className)} {...others} />;
});
