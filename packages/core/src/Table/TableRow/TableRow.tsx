import { forwardRef, useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import TableContext from "../TableContext";
import { TableSectionContext } from "../TableSectionContext";
import { staticClasses, useClasses } from "./TableRow.styles";

export { staticClasses as tableRowClasses };

export type HvTableRowClasses = ExtractNames<typeof useClasses>;

export interface HvTableRowProps
  extends HvBaseProps<HTMLTableRowElement, "children"> {
  /** Content to be rendered */
  children: React.ReactNode;
  /** The component used for the root node. Either a string to use a HTML element or a component. Defaults to tbody. */
  component?: React.ElementType;
  /** Whether the table row will shade on hover. */
  hover?: boolean;
  /** Whether the table row will have the selected shading. */
  selected?: boolean;
  /** Whether the table row is expanded. */
  expanded?: boolean;
  /** Whether the table row background is striped. */
  striped?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTableRowClasses;
}

const defaultComponent = "tr";

/**
 * `HvTableRow` acts as a `tr` element and inherits styles from its context
 */
export const HvTableRow = forwardRef<HTMLElement, HvTableRowProps>(
  function HvTableRow(props, ref) {
    const {
      classes: classesProp,
      className,
      component,
      hover = false,
      selected = false,
      expanded = false,
      striped = false,
      ...others
    } = useDefaultProps("HvTableRow", props);

    const { classes, cx } = useClasses(classesProp);

    const tableContext = useContext(TableContext);
    const tableSectionContext = useContext(TableSectionContext);

    const type = tableSectionContext?.type || "body";

    const isList = tableContext.variant === "listrow";

    const Component =
      component || tableContext?.components?.Tr || defaultComponent;

    return (
      <Component
        ref={ref}
        className={cx(
          tableSectionContext.filterClassName,
          classes.root,
          classes[type],
          {
            [classes.hover]: hover,
            [classes.selected]: selected,
            [classes.expanded]: expanded,
            [classes.striped]: striped,
            [classes.variantList]: isList && type === "body",
            [classes.variantListHead]: isList && type === "head",
          },
          className,
        )}
        role={Component === defaultComponent ? null : "row"}
        {...others}
      />
    );
  },
);
