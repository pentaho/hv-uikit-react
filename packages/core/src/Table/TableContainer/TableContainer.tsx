import { forwardRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import { staticClasses, useClasses } from "./TableContainer.styles";

export { staticClasses as tableContainerClasses };

export type HvTableContainerClasses = ExtractNames<typeof useClasses>;

export interface HvTableContainerProps extends HvBaseProps<
  HTMLDivElement,
  "children"
> {
  /**
   * Content to be rendered
   */
  children: React.ReactNode;
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to tbody.
   */
  component?: React.ElementType;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTableContainerClasses;
}

/**
 * HvTableContainer is a container for the HvTable
 */
export const HvTableContainer = forwardRef<HTMLElement, HvTableContainerProps>(
  function HvTableContainer(props, ref) {
    const {
      classes: classesProp,
      className,
      component,
      ...others
    } = useDefaultProps("HvTableContainer", props);
    const { classes, cx } = useClasses(classesProp);

    const Component = component || "div";

    return (
      <Component
        ref={ref}
        className={cx(classes.root, className)}
        {...others}
      />
    );
  },
);
