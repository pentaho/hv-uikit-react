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

import { HvSection, type HvSectionProps } from "../../Section";
import { staticClasses, useClasses } from "./TableSection.styles";

export { staticClasses as tableSectionClasses };

export type HvTableSectionClasses = ExtractNames<typeof useClasses>;

export interface HvTableSectionProps extends HvSectionProps {}

/**
 * The `HvTableSection` component is a wrapper for the `HvSection` component that applies
 * specific stylings for tables that follow the latest DS specifications.
 */
export const HvTableSection = forwardRef<HTMLDivElement, HvTableSectionProps>(
  function HvTableSection(props, ref) {
    const {
      classes: classesProp,
      children,
      ...others
    } = useDefaultProps("HvTableSection", props);
    const { classes } = useClasses(classesProp);

    return (
      <HvSection ref={ref} classes={classes} {...others}>
        {children}
      </HvSection>
    );
  },
);
