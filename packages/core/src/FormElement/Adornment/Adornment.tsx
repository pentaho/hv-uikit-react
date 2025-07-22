import { forwardRef, useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButtonBase } from "../../ButtonBase";
import { HvBaseProps } from "../../types/generic";
import {
  HvFormElementContext,
  HvFormElementDescriptorsContext,
} from "../context";
import { HvFormStatus } from "../FormElement";
import { staticClasses, useClasses } from "./Adornment.styles";

export { staticClasses as adornmentClasses };

export type HvAdornmentClasses = ExtractNames<typeof useClasses>;

export interface HvAdornmentProps
  extends HvBaseProps<
    HTMLDivElement | HTMLButtonElement,
    "onMouseDown" | "onKeyDown"
  > {
  /** The icon to be added into the input. */
  icon: React.ReactNode;
  /** Controls the visibility of the adornment based on the form element's status. `isVisible` overrides this behavior. */
  showWhen?: HvFormStatus;
  /** Function to be executed when this element is clicked. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** If this property is defined the adornment visibility will be exclusively controlled by this value. */
  isVisible?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvAdornmentClasses;
}

/**
 * Allows to add a decorative icon or an action to a form element, usually on the right side of an input.
 * E.g., the reveal password button.
 *
 * This component disables keyboard navigation by default, ensuring that it doesn't steal focus from the input.
 * As such, its functionality, if any, for accessibility purposes must be provided through an alternative mean.
 * This behavior can be overridden by providing an a `tabIndex={0}`.
 */
export const HvAdornment = forwardRef<
  HTMLDivElement | HTMLButtonElement,
  HvAdornmentProps
>(function HvAdornment(props, ref) {
  const {
    classes: classesProp,
    className,
    icon,
    showWhen,
    onClick,
    isVisible,
    tabIndex,
    ...others
  } = useDefaultProps("HvAdornment", props);
  const { classes, cx } = useClasses(classesProp);

  const { status, disabled } = useContext(HvFormElementContext);
  const { input } = useContext(HvFormElementDescriptorsContext);

  const displayIcon = isVisible ?? (showWhen == null || status === showWhen);

  const Component = onClick ? HvButtonBase : "div";

  return (
    <Component
      ref={ref as React.ForwardedRef<any>}
      aria-hidden={tabIndex == null || tabIndex < 0 ? true : undefined}
      className={cx(
        classes.root,
        {
          [classes.hideIcon]: !displayIcon,
          [classes.disabled]: disabled,
        },
        className,
      )}
      {...(onClick && {
        disabled,
        tabIndex: tabIndex ?? -1,
        "aria-controls": input?.[0]?.id,
        onClick: onClick as React.MouseEventHandler<any>,
        onMouseDown: (event) => event.preventDefault(),
      })}
      {...others}
    >
      {icon}
    </Component>
  );
});
