import { Children, useCallback, useMemo, useRef } from "react";
import MuiDivider, {
  type DividerProps as MuiDividerProps,
} from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import type { HvBreakpoints } from "@hitachivantara/uikit-styles";

import { HvFocus } from "../Focus";
import { useWidth } from "../hooks/useWidth";
import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Stack.styles";

export { staticClasses as stackClasses };

export type HvStackClasses = ExtractNames<typeof useClasses>;

export type HvStackDirection = "column" | "row" | Partial<HvStackBreakpoints>;
export interface HvStackBreakpoints extends Record<HvBreakpoints, string> {}

export interface HvStackProps extends HvBaseProps {
  /** The direction of the stack. Can be either a string or an object that states the direction for each breakpoint. */
  direction?: HvStackDirection;
  /** The spacing between elements of the stack. */
  spacing?: HvBreakpoints;
  /** The divider component to be used between the stack elements.
   * - If `true` the Material-UI Divider component will be used.
   * - If a React node is passed then the custom divider will be used.
   */
  divider?: React.ReactNode;
  /** The properties to pass on to the Material-UI component. */
  dividerProps?: MuiDividerProps;
  /** Sets whether or not there should be arrow navigation between the stack elements. */
  withNavigation?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvStackClasses;
}

/**
 * @returns {string} - Returns a direction for the stack: column or row. If the
 *                     `direction` property is a string and a valid direction then we
 *                     use it. If it's an object with multiple directions by breakpoint
 *                     we use the appropriate one or search for the nearest breakpoint
 *                     smaller than the current one to use.
 */
const getDirection = (direction: any, width: any, breakpoints: any) => {
  if (typeof direction === "string") return direction;

  for (let i = breakpoints.indexOf(width); i >= 0; i -= 1) {
    if (direction[breakpoints[i]] !== undefined) {
      return direction[breakpoints[i]];
    }
  }
  return "column";
};

/**
 * The Stack component arranges its children in a vertical or horizontal layout.
 *
 * It supports customizable spacing and optional dividers between elements.
 *
 */
export const HvStack = (props: HvStackProps) => {
  const {
    classes: classesProp,
    className,
    children,
    direction: directionProp = "column",
    spacing = "sm",
    divider = false,
    withNavigation = false,
    dividerProps = {},
    ...others
  } = useDefaultProps("HvStack", props);
  const { classes, cx } = useClasses(classesProp);

  const width = useWidth();
  const containerRef = useRef(null);
  const { breakpoints } = useTheme();

  const direction = useMemo(
    () => getDirection(directionProp, width, breakpoints.keys),
    [directionProp, width, breakpoints],
  );

  /**
   * @returns {node} - The divider component to use. If the property `divider` is
   *                   set to `true` then the Material-UI divider is used, otherwise
   *                   we use the custom divider the user passed.
   */
  const getDividerComponent = useCallback(() => {
    if (typeof divider === "boolean" && divider) {
      return (
        <MuiDivider
          orientation={direction === "column" ? "horizontal" : "vertical"}
          flexItem={direction === "row"}
          classes={{
            root: classes.divider,
          }}
          {...dividerProps}
        />
      );
    }
    return divider;
  }, [classes.divider, divider, dividerProps, direction]);

  return (
    <div
      ref={containerRef}
      className={cx(
        classes.root,
        classes[direction as keyof HvStackClasses],
        classes[spacing],
        className,
      )}
      {...others}
    >
      {Children.map(children, (child, i) => {
        return (
          <>
            {divider && i !== 0 && getDividerComponent()}
            {withNavigation ? (
              <HvFocus
                rootRef={containerRef}
                focusDisabled={false}
                strategy="grid"
                navigationJump={
                  direction === "column" ? 1 : Children.count(children) || 0
                }
                filterClass="child"
              >
                <div className="child">{child}</div>
              </HvFocus>
            ) : (
              child
            )}
          </>
        );
      })}
    </div>
  );
};
