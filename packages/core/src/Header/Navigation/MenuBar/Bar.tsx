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
import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../../types/generic";
import type { HvHeaderNavigationItemProp } from "../useSelectionPath";
import { SelectionContext } from "../utils/SelectionContext";
import { staticClasses, useClasses } from "./Bar.styles";

export { staticClasses as headerMenuBarClasses };

export type HvHeaderMenuBarClasses = ExtractNames<typeof useClasses>;

export interface BarProps extends HvBaseProps {
  data: HvHeaderNavigationItemProp[];
  type?: "menubar" | "menu";
  classes?: HvHeaderMenuBarClasses;
}

export const Bar = (props: BarProps) => {
  const {
    data = [],
    type = "menubar",
    className,
    children,
    classes: classesProp,
  } = useDefaultProps("HvHeaderMenuBarBar", props);
  const { classes, cx } = useClasses(classesProp);

  const selectionPath = useContext(SelectionContext);

  const isMenu = type === "menu";

  const isActive =
    isMenu && data.some((item) => item.id === selectionPath?.[1]);

  return (
    <div
      className={cx(
        classes.root,
        classes[type],
        {
          [classes.hidden]: isMenu,
          [classes.active]: isActive,
        },
        className,
      )}
    >
      <ul className={classes.list} onFocus={() => {}}>
        {children}
      </ul>
    </div>
  );
};
