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
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvIcon } from "../../icons";
import { staticClasses, useClasses } from "./PathElement.styles";

export { staticClasses as pathElementClasses };

export type HvPathElementClasses = ExtractNames<typeof useClasses>;

export interface HvPathElementProps {
  last?: boolean;
  classes?: HvPathElementClasses;
  separator?: React.ReactNode;
  children: React.ReactElement<any>;
}

export const HvPathElement = ({
  classes: classesProp,
  last = false,
  separator,
  children,
}: HvPathElementProps) => {
  const { classes } = useClasses(classesProp);

  return (
    <li className={classes.centerContainer}>
      {children}
      {!last && (
        <div className={classes.separatorContainer}>
          {separator || (
            <HvIcon name="CaretRight" size="xs" color="textDisabled" />
          )}
        </div>
      )}
    </li>
  );
};
