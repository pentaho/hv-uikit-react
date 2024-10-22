import { forwardRef, useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButtonBase, HvButtonBaseProps } from "../../ButtonBase";
import { HvIcon } from "../../icons";
import { HvTypography, HvTypographyProps } from "../../Typography";
import { capitalize } from "../../utils/helpers";
import {
  HvTableCellAlign,
  HvTableCellType,
  HvTableCellVariant,
} from "../Table";
import TableContext from "../TableContext";
import { TableSectionContext } from "../TableSectionContext";
import { staticClasses, useClasses } from "./TableHeader.styles";
import { getSortIconName, isParagraph } from "./utils";

export { staticClasses as tableHeaderClasses };

export type HvTableHeaderClasses = ExtractNames<typeof useClasses>;

export interface HvTableHeaderProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** The component used for the root node. Either a string to use a HTML element or a component. Defaults to th. */
  component?: React.ElementType;
  /** Content to be rendered */
  children?: React.ReactNode;
  /** The scope of cells that the header element relates to. */
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  /** Set the text-align on the table cell content. */
  align?: HvTableCellAlign;
  /** Sets the cell's variant. */
  variant?: HvTableCellVariant;
  /** Specify the cell type. The prop defaults to the value inherited from the parent TableHead, TableBody, or TableFooter components. */
  type?: HvTableCellType;
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
  /** Whether or not the cell is sorted */
  sorted?: boolean;
  /** Whether or not the cell is sortable */
  sortable?: boolean;
  /** Set sort direction icon and aria-sort. */
  sortDirection?: "ascending" | "descending" | false;
  /** Extra props to be passed onto the text in the header. */
  headerTextProps?: HvTypographyProps;
  /** Whether or not the cell is resizable */
  resizable?: boolean;
  /** Whether or not the cell is being resized */
  resizing?: boolean;
  /** The resize props injected in the resize handler */
  resizerProps?: React.HTMLAttributes<HTMLDivElement>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTableHeaderClasses;
  /** Extra props to be passed onto the sort button in the header. */
  sortButtonProps?: HvButtonBaseProps;
}

const defaultComponent = "th";

/**
 * `HvTableHeader` acts as a `th` element and inherits styles from its context
 */
export const HvTableHeader = forwardRef<HTMLElement, HvTableHeaderProps>(
  function HvTableHeader(props, ref) {
    const {
      children,
      component,
      className,
      style: styleProp,
      classes: classesProp,
      scope: scopeProp,
      align = "inherit",
      variant = "default",
      type: typeProp,
      stickyColumn = false,
      stickyColumnMostLeft = false,
      stickyColumnLeastRight = false,
      groupColumnMostLeft = false,
      groupColumnMostRight = false,
      sortDirection = "none",
      sorted,
      sortable,
      headerTextProps,
      resizerProps = {},
      resizable = false,
      resizing = false,
      sortButtonProps,
      ...others
    } = useDefaultProps("HvTableHeader", props);
    const { classes, cx } = useClasses(classesProp);

    const tableContext = useContext(TableContext);
    const tableSectionContext = useContext(TableSectionContext);

    const type = typeProp || tableSectionContext?.type || "body";
    const isHeadCell = type === "head";

    const scope = scopeProp ?? (isHeadCell ? "col" : "row");

    const Component =
      component || tableContext?.components?.Th || defaultComponent;

    const role =
      Component === defaultComponent
        ? null
        : isHeadCell
          ? "columnheader"
          : "rowheader";
    const paragraph = isParagraph(children);

    // Keep the header sticky
    const style = stickyColumn
      ? { ...styleProp, position: "sticky" }
      : styleProp;

    return (
      <Component
        ref={ref}
        role={role}
        scope={scope}
        style={style}
        className={cx(
          classes.root,
          classes[type],
          align !== "inherit" && classes[`align${capitalize(align)}`],
          variant !== "default" && classes[`variant${capitalize(variant)}`],
          {
            [classes.groupColumnMostLeft]: groupColumnMostLeft,
            [classes.groupColumnMostRight]: groupColumnMostRight,
            [classes.sortable]: sortable,
            [classes.sorted]: sorted,
            [classes.resizable]: resizable,
            [classes.resizing]: resizing,
            [classes.stickyColumn]: stickyColumn,
            [classes.stickyColumnMostLeft]: stickyColumnMostLeft,
            [classes.stickyColumnLeastRight]: stickyColumnLeastRight,
            [classes.variantList]: tableContext.variant === "listrow",
          },
          className,
        )}
        aria-sort={sortable ? sortDirection : undefined}
        {...others}
      >
        <div
          data-align={align !== "inherit" ? align : undefined}
          className={cx(
            classes.headerContent,
            align !== "inherit" && classes[`alignFlex${capitalize(align)}`],
          )}
        >
          <HvTypography
            component="div"
            className={cx(classes.headerText, {
              [classes.headerParagraph]: paragraph,
              [classes.sortableHeaderText]: sortable,
            })}
            variant="label"
            {...headerTextProps}
          >
            {children}
          </HvTypography>
          {isHeadCell && sortable && (
            <HvButtonBase
              className={classes.sortButton}
              aria-label="Sort"
              {...sortButtonProps}
            >
              <HvIcon
                compact
                name={getSortIconName(sorted && sortDirection)}
                className={classes.sortIcon}
              />
            </HvButtonBase>
          )}
        </div>
        {resizable && <div {...resizerProps} className={classes.resizer} />}
      </Component>
    );
  },
);
