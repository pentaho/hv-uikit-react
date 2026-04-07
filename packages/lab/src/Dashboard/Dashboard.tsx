import { useMemo } from "react";
import {
  Responsive as ResponsiveGrid,
  WidthProvider,
  type Layouts,
  type ReactGridLayoutProps,
  type ResponsiveProps,
} from "react-grid-layout";
import { Global } from "@emotion/react";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-core";

import { gridStyles, staticClasses, useClasses } from "./Dashboard.styles";

const GridLayout = WidthProvider(ResponsiveGrid);

/** Default column breakpoints. For now, use always 12-column */
const defaultCols: HvDashboardProps["cols"] = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
};

export { staticClasses as dashboardClasses };

export type HvDashboardClasses = ExtractNames<typeof useClasses>;

export interface HvDashboardProps extends Omit<ResponsiveProps, "cols"> {
  /** Dashboard items. Each node must be `key`'ed  */
  children: React.ReactNode;
  /** An object used to override or extend the styles applied. */
  classes?: HvDashboardClasses;
  /**
   * Layout is an array of object with the format:
   *
   * `{i: string, x: number, y: number, w: number, h: number}`
   *
   * The `i` must match the key used on each item component.
   */
  layout?: ReactGridLayoutProps["layout"];
  /** Number of grid columns or an object of breakpoint -> #columns */
  cols?: number | ResponsiveProps["cols"];
}

/**
 * A Dashboard grid layout component, based on `react-grid-layout`.
 * The children elements are grid items and must be `key`ed.
 *
 * @see https://github.com/react-grid-layout/react-grid-layout?tab=readme-ov-file#grid-layout-props
 *
 * DISCLAIMER: This component is a work in progress and there might be breaking changes.
 */
export const HvDashboard = (props: HvDashboardProps) => {
  const {
    children,
    className,
    layout,
    cols: colsProp,
    layouts: layoutsProp,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvDashboard", props);
  const { classes, cx } = useClasses(classesProp);
  const { activeTheme } = useTheme();

  const layouts = useMemo<Layouts>(() => {
    if (layoutsProp) return layoutsProp;
    if (!layout) return {};

    return { xs: layout, sm: layout, md: layout, lg: layout, xl: layout };
  }, [layoutsProp, layout]);

  const cols = useMemo<ResponsiveProps["cols"]>(() => {
    if (!colsProp) return defaultCols;

    if (typeof colsProp === "number") {
      return {
        xs: colsProp,
        sm: colsProp,
        md: colsProp,
        lg: colsProp,
        xl: colsProp,
      };
    }

    return colsProp;
  }, [colsProp]);

  return (
    <>
      <Global styles={gridStyles} />
      <GridLayout
        className={cx(classes.root, className)}
        breakpoints={activeTheme?.breakpoints.values}
        cols={cols}
        layouts={layouts}
        {...others}
      >
        {children}
      </GridLayout>
    </>
  );
};
