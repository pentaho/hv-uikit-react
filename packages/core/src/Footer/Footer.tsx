import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../types/generic";
import { HvTypography } from "../Typography";
import { staticClasses, useClasses } from "./Footer.styles";

export { staticClasses as footerClasses };

export type HvFooterClasses = ExtractNames<typeof useClasses>;

export interface HvFooterProps extends HvBaseProps {
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

  copyright?: React.ReactNode;
  /** Footer links. */
  links?: React.ReactNode;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFooterClasses;
}

/**
 * A Footer is a way of providing extra information at the end of a page.
 */
export const HvFooter = forwardRef<
  // no-indent
  React.ComponentRef<"footer">,
  HvFooterProps
>(function HvFooter(props, ref) {
  const {
    name,
    copyright,
    links,
    classes: classesProp,
    className,
    ...others
  } = useDefaultProps("HvFooter", props);
  const muiTheme = useTheme();
  const { classes, cx } = useClasses(classesProp);

  const isSmDown = useMediaQuery(muiTheme.breakpoints.down("sm"));

  return (
    <footer
      ref={ref}
      className={cx(classes.root, { [classes.small]: isSmDown }, className)}
      {...others}
    >
      <HvTypography variant="label" className={classes.name}>
        {name}
      </HvTypography>
      <div className={classes.rightContainer}>
        <HvTypography className={classes.copyright}>{copyright}</HvTypography>
        {links && <div className={classes.separator} />}
        {links}
      </div>
    </footer>
  );
});
