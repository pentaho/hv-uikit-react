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

import type { HvBaseProps } from "../../types/generic";
import { staticClasses, useClasses } from "./Actions.styles";

export { staticClasses as headerActionsClasses };

export type HvHeaderActionsClasses = ExtractNames<typeof useClasses>;

export interface HvHeaderActionsProps extends HvBaseProps {
  classes?: HvHeaderActionsClasses;
}

export const HvHeaderActions = forwardRef<
  React.ElementRef<"div">,
  HvHeaderActionsProps
>(function HvHeaderActions(props, ref) {
  const {
    classes: classesProp,
    className,
    children,
    ...others
  } = useDefaultProps("HvHeaderActions", props);

  const { classes, cx } = useClasses(classesProp);

  return (
    <div ref={ref} className={cx(classes.root, className)} {...others}>
      {children}
    </div>
  );
});
