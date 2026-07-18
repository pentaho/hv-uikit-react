/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { forwardRef } from "react";
import { Tabs, TabsList, type TabsProps } from "@mui/base";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-core";

import { staticClasses, useClasses } from "./PanelTabs.styles";

export { staticClasses as canvasPanelTabsClasses };

export type HvCanvasPanelTabsClasses = ExtractNames<typeof useClasses>;

export interface HvCanvasPanelTabsProps extends TabsProps {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasPanelTabsClasses;
}

/**
 * A tabs component to use in a canvas context.
 */
export const HvCanvasPanelTabs = forwardRef<
  HTMLDivElement,
  HvCanvasPanelTabsProps
>(function HvCanvasPanelTabs(props, ref) {
  const {
    selectionFollowsFocus = true,
    children,
    className,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvCanvasPanelTabs", props);

  const { classes, cx } = useClasses(classesProp);

  return (
    <Tabs
      ref={ref}
      className={cx(classes.root, className)}
      selectionFollowsFocus={selectionFollowsFocus}
      {...others}
    >
      <TabsList className={classes.list}>{children}</TabsList>
    </Tabs>
  );
});
