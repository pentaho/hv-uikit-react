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
import {
  HvTypography,
  type ExtractNames,
  type HvBaseProps,
} from "@hitachivantara/uikit-react-core";
import { Drag } from "@hitachivantara/uikit-react-icons";

import { staticClasses, useClasses } from "./SidebarGroupItem.styles";

export { staticClasses as flowSidebarGroupItemClasses };

export type HvFlowSidebarGroupItemClasses = ExtractNames<typeof useClasses>;

export interface HvFlowSidebarGroupItemProps extends HvBaseProps {
  /** Item label. */
  label: string;
  /** Whether the item is being dragged. */
  isDragging?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFlowSidebarGroupItemClasses;
}

export const HvFlowSidebarGroupItem = forwardRef<
  HTMLDivElement,
  HvFlowSidebarGroupItemProps
>(function HvFlowSidebarGroupItem(props, ref) {
  const {
    label,
    isDragging,
    classes: classesProp,
    className,
    ...others
  } = props;
  const { classes, cx } = useClasses(classesProp);

  return (
    <div
      ref={ref}
      className={cx(
        classes.root,
        { [classes.dragging]: isDragging },
        className,
      )}
      {...others}
    >
      <HvTypography>{label}</HvTypography>
      <Drag />
    </div>
  );
});
