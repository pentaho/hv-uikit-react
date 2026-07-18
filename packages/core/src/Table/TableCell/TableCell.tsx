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
import { forwardRef, useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { capitalize } from "../../utils/helpers";
import type {
  HvTableCellAlign,
  HvTableCellType,
  HvTableCellVariant,
} from "../Table";
import TableContext from "../TableContext";
import { TableSectionContext } from "../TableSectionContext";
import { staticClasses, useClasses } from "./TableCell.styles";

export { staticClasses as tableCellClasses };

export type HvTableCellClasses = ExtractNames<typeof useClasses>;

export interface HvTableCellProps extends Omit<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  "align"
> {
  /** The component used for the root node. Either a string to use a HTML element or a component. Defaults to td. */
  component?: React.ElementType;
  /** Content to be rendered */
  children?: React.ReactNode;
  /** Inline styles to be applied to the root element. */
  style?: React.CSSProperties;
  /** Set the text-align on the table cell content. */
  align?: HvTableCellAlign;
  /** Sets the cell's variant. */
  variant?: HvTableCellVariant | "listcheckbox" | "listactions";
  /** Specify the cell's type. The prop defaults to the value inherited from the parent TableHead, TableBody, or TableFooter components. */
  type?: HvTableCellType;
  /** Whether or not the cell is part of a sorted column. */
  sorted?: boolean;
  /** The cell is part of a sticky column. */
  stickyColumn?: boolean;
  /** The cell is part of the last sticky to the left column. */
  stickyColumnMostLeft?: boolean;
  /** The cell is part of the first sticky to the right column. */
  stickyColumnLeastRight?: boolean;
  /** The cell is part of the first column in the group. */
  groupColumnMostLeft?: boolean;
  /** The cell is part of the last column in the group. */
  groupColumnMostRight?: boolean;
  /** Whether or not the cell is resizable */
  resizable?: boolean;
  /** Whether or not the cell is being resized */
  resizing?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTableCellClasses;
}

const defaultComponent = "td";

/**
 * `HvTableCell` acts as a `td` element and inherits styles from its context
 */
export const HvTableCell = forwardRef<HTMLElement, HvTableCellProps>(
  function HvTableCell(props, ref) {
    const {
      children,
      component,
      className,
      style,
      classes: classesProp,
      align = "inherit",
      variant = "default",
      type: typeProp,
      stickyColumn = false,
      stickyColumnMostLeft = false,
      stickyColumnLeastRight = false,
      groupColumnMostLeft = false,
      groupColumnMostRight = false,
      sorted = false,
      resizable = false,
      resizing = false,
      ...others
    } = useDefaultProps("HvTableCell", props);

    const { classes, cx } = useClasses(classesProp);

    const tableContext = useContext(TableContext);
    const tableSectionContext = useContext(TableSectionContext);

    const type = typeProp || tableSectionContext?.type || "body";

    const Component =
      component || tableContext?.components?.Td || defaultComponent;

    return (
      <Component
        ref={ref}
        role={Component === defaultComponent ? null : "cell"}
        style={style}
        className={cx(
          classes.root,
          classes[type],
          align !== "inherit" && classes[`align${capitalize(align)}`],
          variant !== "default" && classes[`variant${capitalize(variant)}`],
          {
            [classes.variantList]: tableContext.variant === "listrow",
            [classes.variantListHead]:
              tableContext.variant === "listrow" && type !== "body",
            [classes.sorted]: sorted,
            [classes.stickyColumn]: stickyColumn,
            [classes.stickyColumnMostLeft]: stickyColumnMostLeft,
            [classes.stickyColumnLeastRight]: stickyColumnLeastRight,
            [classes.groupColumnMostLeft]: groupColumnMostLeft,
            [classes.groupColumnMostRight]: groupColumnMostRight,
            [classes.resizable]: resizable,
            [classes.resizing]: resizing,
          },
          className,
        )}
        {...others}
      >
        {children}
      </Component>
    );
  },
);
