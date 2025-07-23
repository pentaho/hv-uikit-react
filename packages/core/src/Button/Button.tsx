import { useMemo } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import {
  getColor,
  HvColorAny,
  HvRadius,
  HvSize,
  theme,
} from "@hitachivantara/uikit-styles";

import {
  fixedForwardRef,
  PolymorphicComponentRef,
  PolymorphicRef,
} from "../types/generic";
import {
  getIconSizeStyles,
  getSizeStyles,
  staticClasses,
  useClasses,
} from "./Button.styles";

type Variant = "contained" | "subtle" | "ghost";

type ColorVariant =
  | "primary"
  | "secondary"
  | "positive"
  | "negative"
  | "warning";

// "contained" has no suffix
type TypeSuffix = "" | "Subtle" | "Ghost";

export type HvButtonVariant =
  | Variant
  | `${ColorVariant}${TypeSuffix}`
  | "semantic";

export { staticClasses as buttonClasses };

export type HvButtonClasses = ExtractNames<typeof useClasses>;

export type HvButtonProps<C extends React.ElementType = "button"> =
  PolymorphicComponentRef<
    C,
    {
      /** Use the variant prop to change the visual style of the button. */
      variant?: HvButtonVariant;
      /** Whether the button is an icon-only button. */
      icon?: boolean;
      /** Whether the button is disabled or not. */
      disabled?: boolean;
      /** Class names to be applied. */
      className?: string;
      /** Element placed before the children. */
      startIcon?: React.ReactNode;
      /** Element placed after the children. */
      endIcon?: React.ReactNode;
      /** Color of the button. */
      color?: HvColorAny;
      /** Button size. */
      size?: HvSize;
      /** Button border radius. */
      radius?: HvRadius;
      /** A Jss Object used to override or extend the styles applied. */
      classes?: HvButtonClasses;
      /** Whether the button is selected or not. */
      selected?: boolean;
      /**
       * Whether the button is focusable when disabled.
       * Without this property, the accessibility of the button decreases when disabled since it's not read by screen readers.
       * Set this property to `true` when you need the button to still be focusable when disabled for accessibility purposes.
       */
      focusableWhenDisabled?: boolean;
    }
  >;

function parseVariant(variant: HvButtonVariant): [HvColorAny, Variant] {
  const deprecatedVariantMap: Record<string, HvButtonVariant> = {
    secondary: "secondarySubtle",
  };

  const mappedVariant = deprecatedVariantMap[variant];

  if (import.meta.env.DEV && mappedVariant) {
    // eslint-disable-next-line no-console
    console.warn(
      `HvButton variant '${variant}' is deprecated. Please use '${mappedVariant}'.`,
    );
  }

  if (variant === "semantic") return ["inherit", "ghost"];
  if (variant === "secondary") return ["text", "subtle"];
  if (variant === "ghost") return ["primary", "ghost"];
  if (variant === "contained" || variant === "subtle") {
    return ["text", variant];
  }

  const result = variant.split(/(?=[A-Z])/);
  if (!result[1]) return [result[0], "contained"];

  return result.map((x) => x.toLowerCase()) as [HvColorAny, Variant];
}
/**
 * Button component is used to trigger an action or event.
 */
export const HvButton = fixedForwardRef(function HvButton<
  C extends React.ElementType = "button",
>(props: HvButtonProps<C>, ref: PolymorphicRef<C>) {
  const {
    classes: classesProp,
    children,
    icon = false,
    variant: variantProp = icon ? "secondaryGhost" : "primary",
    color: colorProp,
    disabled = false,
    className,
    startIcon,
    endIcon,
    size,
    radius,
    overrideIconColors,
    component: Component = "button",
    focusableWhenDisabled,
    onClick: onClickProp,
    onMouseDown: onMouseDownProp,
    selected,
    style,
    ...others
  } = useDefaultProps("HvButton", props);
  const { classes, css, cx } = useClasses(classesProp);
  const [parsedColor, variant] = parseVariant(variantProp);
  const color = colorProp ?? parsedColor;

  const handleClick: HvButtonProps["onClick"] = (e) => {
    if (disabled) return;
    onClickProp?.(e);
  };

  const handleMouseDown: HvButtonProps["onMouseDown"] = (e) => {
    if (disabled) return;
    onMouseDownProp?.(e);
  };

  const sizeStyles = useMemo(
    () => size && (icon ? getIconSizeStyles(size) : getSizeStyles(size)),
    [size, icon],
  );

  return (
    <Component
      ref={ref}
      style={mergeStyles(style, {
        "--color": color && getColor(color),
        "--radius": radius && theme.radii[radius],
        "--HvButton-height": sizeStyles?.height ?? "32px",
      })}
      className={cx(
        classes.root,
        classes[variant],
        classes[variantProp as keyof HvButtonClasses], // Placed after type and color CSS for DS3 override
        {
          [classes.icon]: icon,
          [classes.disabled]: disabled,
        },
        sizeStyles && css(sizeStyles),
        className,
      )}
      data-color={color}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      {...(Component === "button" && { type: "button" })}
      {...(disabled && {
        disabled: !focusableWhenDisabled,
        tabIndex: focusableWhenDisabled ? 0 : -1,
        "aria-disabled": true,
      })}
      {...(selected != null && { "aria-pressed": selected })}
      {...others}
    >
      {startIcon && <span className={classes.startIcon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={classes.endIcon}>{endIcon}</span>}
    </Component>
  );
});
