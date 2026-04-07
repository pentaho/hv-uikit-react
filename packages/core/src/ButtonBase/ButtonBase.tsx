import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import {
  fixedForwardRef,
  type PolymorphicComponentRef,
  type PolymorphicRef,
} from "../types/generic";
import { staticClasses, useClasses } from "./ButtonBase.styles";

export { staticClasses as buttonBaseClasses };

export type HvButtonBaseClasses = ExtractNames<typeof useClasses>;

export type HvButtonBaseProps<C extends React.ElementType = "button"> =
  PolymorphicComponentRef<
    C,
    {
      /** A Jss Object used to override or extend the styles applied. */
      classes?: HvButtonBaseClasses;
      /** Whether the button is selected or not. */
      selected?: boolean;
      /** Whether the button is disabled or not. */
      disabled?: boolean;
      /**
       * Whether the button is focusable when disabled.
       * Without this property, the accessibility of the button decreases when disabled since it's not read by screen readers.
       * Set this property to `true` when you need the button to still be focusable when disabled for accessibility purposes.
       */
      focusableWhenDisabled?: boolean;
    }
  >;

/**
 * Button component is used to trigger an action or event.
 */
export const HvButtonBase = fixedForwardRef(function HvButtonBase<
  C extends React.ElementType = "button",
>(props: HvButtonBaseProps<C>, ref: PolymorphicRef<C>) {
  const {
    className,
    classes: classesProp,
    children,
    selected,
    disabled,
    focusableWhenDisabled,
    component: Component = "button",
    onClick: onClickProp,
    onMouseDown: onMouseDownProp,
    ...others
  } = useDefaultProps("HvButtonBase", props);
  const { classes, cx } = useClasses(classesProp);

  return (
    <Component
      ref={ref}
      className={cx(
        classes.root,
        {
          [classes.disabled]: disabled,
        },
        className,
      )}
      onClick={(e) => {
        if (disabled) return;
        onClickProp?.(e);
      }}
      onMouseDown={(e) => {
        if (disabled) return;
        onMouseDownProp?.(e);
      }}
      {...(Component === "button" && { type: "button" })}
      {...(disabled && {
        disabled: !focusableWhenDisabled,
        tabIndex: focusableWhenDisabled ? 0 : -1,
        "aria-disabled": true,
      })}
      {...(selected && { "aria-pressed": selected })}
      {...others}
    >
      {children}
    </Component>
  );
});
