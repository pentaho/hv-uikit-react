import { forwardRef, useMemo, useRef } from "react";
import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-utils";

import { staticClasses, useClasses } from "./Table.styles";
import TableContext from "./TableContext";

export { staticClasses as tableClasses };

export type HvTableClasses = ExtractNames<typeof useClasses>;

export type HvTableVariant = "listrow" | "default";
export type HvTableCellAlign =
  | "center"
  | "inherit"
  | "justify"
  | "left"
  | "right";
export type HvTableCellType = "body" | "footer" | "head";
export type HvTableCellVariant =
  | "checkbox"
  | "expand"
  | "actions"
  | "default"
  | "none";

export interface HvTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `table`.
   *
   * When using non-table elements, layout is up to the developer using the component.
   */
  component?: React.ElementType;
  /** Content to be rendered */
  children: React.ReactNode;
  /** Whether the `HvTable` has a sticky header row. */
  stickyHeader?: boolean;
  /** Whether the `HvTable` has sticky columns. */
  stickyColumns?: boolean;
  /** Whether the `HvTable` has the list row styles or the default. */
  variant?: HvTableVariant;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTableClasses;
}

const defaultComponent = "table";

const computeTablePartComponents = (rootComponent: React.ElementType<any>) => {
  if (rootComponent === "table") {
    return {
      Table: "table",
      THead: "thead",
      TBody: "tbody",
      Tr: "tr",
      Th: "th",
      Td: "td",
    };
  }

  return {
    Table: rootComponent,
    THead: rootComponent,
    TBody: rootComponent,
    Tr: rootComponent,
    Th: rootComponent,
    Td: rootComponent,
  };
};

/**
 * A table gathers relational data. It displays values arranged to allow quick numerical analysis like comparison and sorting.
 *
 * The `HvTable` component offers a set of HTML-equivalent elements, **styled to Design System's specification**,
 * for building tables. For better data handling and **advanced features** use the utility hooks collection.
 * See the [Table Hooks documentation](https://pentaho.github.io/uikit-docs/master/components/table#usehvtable-hooks) for more details.
 *
 * @variantSemantics
 * - "default": rows are packed together, for data that users compare and sort
 * - "listrow": rows are separated by a small vertical gap, for list-like items where each row reads as one entry
 *
 * @stateRules
 * - "stickyHeader": keeps the header row visible while the rows scroll; place the table in HvTableContainer so the rows scroll
 * - "stickyColumns": keeps the leading columns visible while the table scrolls horizontally
 * - "component": when set to an element other than "table", the layout is up to the consumer and role="table" is applied
 *
 * @a11y
 * role: table (set by the native table element, or applied as role="table" when component is changed)
 * - name: the table needs an accessible name; add a caption element or pass aria-label
 * - bulk selection: the select-all checkbox in HvBulkActions is labeled with the selected and total counts; keep the counts accurate
 * - pagination: HvPagination labels its controls (first, previous, next, last page, and the page input); translate them through the labels prop
 * - focus: row actions and bulk actions must stay reachable by keyboard in table order
 */
export const HvTable = forwardRef<
  // no-indent
  HTMLElement,
  HvTableProps
>(function HvTable(props, ref) {
  const {
    classes: classesProp,
    className,
    component = defaultComponent,
    stickyHeader = false,
    stickyColumns = false,
    variant = "default",
    ...others
  } = useDefaultProps("HvTable", props);
  const { classes, cx } = useClasses(classesProp);

  const containerRef = useRef(ref);

  const components = useMemo(
    () => computeTablePartComponents(component),
    [component],
  );

  const tableContext = useMemo(
    () => ({ components, variant, containerRef }),
    [components, variant, containerRef],
  );

  const Table = useMemo(() => components.Table, [components]);

  return (
    <TableContext.Provider value={tableContext}>
      <Table
        ref={ref}
        role={component === defaultComponent ? null : "table"}
        className={cx(
          classes.root,
          {
            [classes.stickyHeader]: stickyHeader,
            [classes.stickyColumns]: stickyColumns,
            [classes.listRow]: variant === "listrow",
          },
          className,
        )}
        {...others}
      />
    </TableContext.Provider>
  );
});
