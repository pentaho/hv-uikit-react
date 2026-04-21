import { forwardRef, useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import TableContext from "../TableContext";
import {
  TableSectionContext,
  type TableSectionContextValue,
} from "../TableSectionContext";
import { staticClasses, useClasses } from "./TableHead.styles";

export { staticClasses as tableHeadClasses };

export type HvTableHeadClasses = ExtractNames<typeof useClasses>;

export interface HvTableHeadProps extends HvBaseProps<
  HTMLTableSectionElement,
  "children"
> {
  /**
   * Content to be rendered
   */
  children: React.ReactNode;
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to thead.
   */
  component?: React.ElementType;
  /**
   * The table has sticky headers.
   */
  stickyHeader?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTableHeadClasses;
}

const tableSectionContext = {
  type: "head",
} satisfies TableSectionContextValue;

const defaultComponent = "thead";

/**
 * HvTableHead acts as a `thead` element.
 * `HvTableCell` and `HvTableRow` elements in it inherit header-specific styles
 */
export const HvTableHead = forwardRef<HTMLElement, HvTableHeadProps>(
  function HvTableHead(props, ref) {
    const {
      classes: classesProp,
      className,
      component,
      stickyHeader,
      ...others
    } = useDefaultProps("HvTableHead", props);
    const { classes, cx } = useClasses(classesProp);

    const tableContext = useContext(TableContext);

    const Component =
      component || tableContext?.components?.THead || defaultComponent;

    return (
      <TableSectionContext.Provider value={tableSectionContext}>
        <Component
          className={cx(
            classes.root,
            { [classes.stickyHeader]: stickyHeader },
            className,
          )}
          ref={ref}
          role={Component === defaultComponent ? null : "rowgroup"}
          {...others}
        />
      </TableSectionContext.Provider>
    );
  },
);
