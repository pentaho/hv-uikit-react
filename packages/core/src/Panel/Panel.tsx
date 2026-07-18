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
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Panel.styles";

export { staticClasses as panelClasses };

export type HvPanelClasses = ExtractNames<typeof useClasses>;

export interface HvPanelProps extends HvBaseProps {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvPanelClasses;
}

/**
 * A Panel is a flexible container used in patterns like dropdowns, filter groups, or detail sections. It can be horizontal or vertical, with size defined by its content and context. Its appearance should remain consistent regardless of usage.
 */
export const HvPanel = forwardRef<HTMLDivElement, HvPanelProps>(
  function HvPanel(props, ref) {
    const {
      className,
      classes: classesProp,
      children,
      ...others
    } = useDefaultProps("HvPanel", props);
    const { classes, cx } = useClasses(classesProp);

    return (
      <div ref={ref} className={cx(classes.root, className)} {...others}>
        {children}
      </div>
    );
  },
);
