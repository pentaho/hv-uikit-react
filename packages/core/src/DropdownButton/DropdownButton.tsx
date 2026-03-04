import { forwardRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton, HvButtonProps } from "../Button";
import { HvIcon } from "../icons";
import { staticClasses, useClasses } from "./DropdownButton.styles";

export { staticClasses as dropdownButtonClasses };

export type HvDropdownButtonClasses = ExtractNames<typeof useClasses>;

export interface HvDropdownButtonProps
  extends Omit<HvButtonProps, "startAdornment" | "endAdornment" | "classes"> {
  /** Whether the button is in read only mode when used as a form element. */
  readOnly?: boolean;
  /** Whether the content triggered by the button is opened or not. */
  open?: boolean;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvDropdownButtonClasses;
}

/**
 * IMPORTANT: This component is not ready to be exported to external users.
 *
 * Implements the DS dropdown button pattern.
 */
export const HvDropdownButton = forwardRef<
  HTMLButtonElement,
  HvDropdownButtonProps
>(function HvDropdownButton(props, ref) {
  const {
    className,
    classes: classesProp,
    disabled,
    open,
    icon,
    readOnly,
    children: childrenProp,
    variant,
    ...others
  } = useDefaultProps("HvDropdownButton", props);

  const { classes, cx } = useClasses(classesProp, false);

  const endIcon = !icon && <HvIcon name="CaretDown" size="xs" rotate={open} />;

  const children =
    childrenProp && typeof childrenProp === "string" ? (
      <div className={classes.placeholder}>{childrenProp}</div>
    ) : (
      childrenProp
    );

  return (
    <HvButton
      ref={ref}
      icon={icon}
      disabled={disabled || readOnly}
      className={cx(
        classes.root,
        {
          [classes.open]: open,
          [classes.readOnly]: readOnly,
          [classes.disabled]: disabled,
        },
        className,
      )}
      classes={{ endIcon: classes.arrowContainer }}
      endIcon={endIcon}
      variant={open ? "secondarySubtle" : variant}
      {...others}
    >
      {icon ? children : <div className={classes.selection}>{children}</div>}
    </HvButton>
  );
});
