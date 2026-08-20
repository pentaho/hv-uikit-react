import { forwardRef } from "react";
import MuiGrid, { type GridProps as MuiGridProps } from "@mui/material/Grid";
import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-utils";

import { staticClasses, useClasses } from "./Grid.styles";

export { staticClasses as gridClasses };

export type HvGridClasses = ExtractNames<typeof useClasses>;

const BREAKPOINT_GUTTERS = {
  xs: 2,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 4,
};

const BREAKPOINT_COLUMNS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 12,
  xl: 12,
};

export type HvGridDirection =
  | "row"
  | "row-reverse"
  | "column"
  | "column-reverse";

export type HvGridSpacing =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "auto"
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10;

export interface HvGridProps extends Omit<
  MuiGridProps,
  "classes" | "columns" | "size"
> {
  /**
   * If `true`, the component will have the flex *container* behavior.
   * You should be wrapping *items* with a *container*.
   */
  container?: boolean;
  /**
   * Defines the number of columns the grid item occupies.
   */
  size?: MuiGridProps["size"];
  /**
   * Defines the space between the type item component. It can only be used on a type container component.
   * Based in the 8x factor defined in the theme, it allows the definition of this factor based on the factor
   * (number between 0 and 10), breakpoint or auto.
   */
  spacing?: HvGridSpacing | number;
  /**
   * Defines the vertical space between the type item component. It can only be used on a type container component.
   * Based in the 8x factor defined in the theme, it allows the definition of this factor based on the factor
   * (number between 0 and 10), breakpoint or auto.
   * It overrides the value of the spacing prop.
   */
  rowSpacing?: HvGridSpacing | number;
  /**
   * Defines the horizontal space between the type item component. It can only be used on a type container component.
   * Based in the 8x factor defined in the theme, it allows the definition of this factor based on the factor
   * (number between 0 and 10), breakpoint or auto.
   * It overrides the value of the spacing prop.
   */
  columnSpacing?: HvGridSpacing | number;
  /**
   * The number of columns.
   * Defaults to a 12-column grid.
   * The value "auto" implements the Design System directives in terms of variable number of columns.
   * @default 12
   */
  columns?: "auto" | MuiGridProps["columns"];
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   */
  direction?: HvGridDirection;
  /**
   * Defines the `justify-content` style property.
   * It is applied for all screen sizes.
   */
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  /**
   * Defines the `flex-wrap` style property.
   * It's applied for all screen sizes.
   */
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  /**
   * If `true`, it sets `min-width: 0` on the item.
   * Refer to the limitations section of the documentation to better understand the use case.
   * @deprecated Use `sx={{ minWidth: 0 }}` instead.
   */
  zeroMinWidth?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvGridClasses;
}

function getGridSpacing(spacing: HvGridProps["spacing"]) {
  if (typeof spacing === "string") {
    if (spacing === "auto") {
      return BREAKPOINT_GUTTERS;
    }

    return BREAKPOINT_GUTTERS[spacing];
  } else if (typeof spacing === "object" && !Array.isArray(spacing)) {
    return Object.keys(spacing).reduce<Record<string, number>>((acc, bp) => {
      const value = spacing[bp as keyof typeof spacing] as
        | HvGridSpacing
        | number
        | undefined;

      if (value == null) return acc;

      if (typeof value === "number") {
        acc[bp] = value;
        return acc;
      }

      if (value === "auto") {
        acc[bp] = BREAKPOINT_GUTTERS[bp as keyof typeof BREAKPOINT_GUTTERS];
        return acc;
      }

      acc[bp] = BREAKPOINT_GUTTERS[value];

      return acc;
    }, {});
  } else if (spacing === 0) {
    return { xs: 0 };
  }

  return spacing;
}

function getNumberOfColumns(columns: HvGridProps["columns"]) {
  if (columns === "auto") {
    return BREAKPOINT_COLUMNS;
  }

  return columns;
}

function getSx(
  zeroMinWidth: HvGridProps["zeroMinWidth"],
  sx: MuiGridProps["sx"],
) {
  if (!zeroMinWidth) {
    return sx;
  }

  return [
    { minWidth: 0 },
    ...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
  ];
}

function getContainerProps(
  spacing: HvGridProps["spacing"],
  rowSpacing: HvGridProps["rowSpacing"],
  columnSpacing: HvGridProps["columnSpacing"],
  columns: HvGridProps["columns"],
) {
  const containerProps: Pick<
    MuiGridProps,
    "container" | "spacing" | "rowSpacing" | "columnSpacing" | "columns"
  > = { container: true };

  if (spacing != null) {
    containerProps.spacing = getGridSpacing(spacing);
  }
  if (rowSpacing != null) {
    containerProps.rowSpacing = getGridSpacing(rowSpacing);
  }
  if (columnSpacing != null) {
    containerProps.columnSpacing = getGridSpacing(columnSpacing);
  }
  if (columns != null) {
    containerProps.columns = getNumberOfColumns(columns);
  }

  return containerProps;
}

/**
 * The grid creates visual consistency between layouts while allowing flexibility
 * across a wide variety of designs. This component is based on a 12-column grid layout.
 *
 * It's based on the [Material UI Grid](https://mui.com/material-ui/react-grid/).
 *
 * However, the number of columns is set to 12 for all breakpoints, as it serves most
 * of the use cases and simplifies the implementation.
 * To opt-in to the Design System directives, you can set the `columns` prop to `auto`.
 *
 * Also, the Design System specifications are omissive about the horizontal gutters.
 * The HvGrid sets them to the same value as the vertical gutters, depending on the breakpoint.
 * It can be overridden by setting the `rowSpacing` prop.
 */
export const HvGrid = forwardRef<
  // no-indent
  HTMLDivElement,
  HvGridProps
>(function HvGrid(props, ref) {
  const {
    container,
    spacing = "auto",
    rowSpacing,
    columnSpacing,
    columns,
    size,
    justify,
    justifyContent,
    zeroMinWidth,
    sx,
    className,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvGrid", props);

  const { classes, cx } = useClasses(classesProp);

  const containerProps = container
    ? getContainerProps(spacing, rowSpacing, columnSpacing, columns)
    : {};

  return (
    <MuiGrid
      ref={ref}
      className={cx(classes.root, className)}
      size={size}
      justifyContent={justifyContent ?? justify}
      sx={getSx(zeroMinWidth, sx)}
      {...containerProps}
      {...others}
    />
  );
});
