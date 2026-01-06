import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { HvBreakpoints } from "@hitachivantara/uikit-styles";

import { HvBaseProps } from "../types/generic";
import {
  getContainerStyle,
  staticClasses,
  useClasses,
} from "./SimpleGrid.styles";

export { staticClasses as simpleGridClasses };

export interface HvGridBreakpoint {
  cols?: number;
  maxWidth?: number;
  minWidth?: number;
  spacing?: HvBreakpoints;
}

export type HvSimpleGridClasses = ExtractNames<typeof useClasses>;

/** Grid component that enables you to create columns of equal width and define your own breakpoints and responsive behavior. */
export interface HvSimpleGridProps extends HvBaseProps {
  /** Spacing with pre-defined values according the values defined in the theme */
  spacing?: HvBreakpoints;
  /**
   * Provide an array to define responsive behavior:
   * - `maxWidth` or `minWidth`: max-width or min-width at which media query will work
   * - `cols`: number of columns per row at given max-width
   * - `spacing`: optional spacing at given max-width, if not provided spacing from component prop will be used instead
   */
  breakpoints?: HvGridBreakpoint[];
  /** Number of how many columns the content will be displayed */
  cols?: number;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvSimpleGridClasses;
}

/**
 * SimpleGrid is a lightweight, responsive grid for evenly spaced items across a fixed number of columns.
 */
export const HvSimpleGrid = (props: HvSimpleGridProps) => {
  const {
    children,
    breakpoints,
    spacing,
    cols,
    className,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvSimpleGrid", props);

  const { classes, cx, css } = useClasses(classesProp);

  const containerStyle = getContainerStyle(breakpoints, spacing, cols);

  return (
    <div
      className={cx(css(containerStyle), classes.root, className)}
      {...others}
    >
      {children}
    </div>
  );
};
