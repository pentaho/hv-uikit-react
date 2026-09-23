import { useMemo } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import {
  getColor,
  theme,
  type HvColorAny,
  type HvRadius,
  type HvSize,
} from "@pentaho/uikit-styles";

import {
  fixedForwardRef,
  type PolymorphicComponentRef,
  type PolymorphicRef,
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
 *
 * @variantSemantics
 * - "primary" (contained): primary emphasis, for main CTAs
 * - "secondary" (subtle): secondary emphasis, deprecated, use secondarySubtle or secondaryGhost
 * - "ghost": tertiary emphasis, lowest visual weight
 * - "{color}Contained": emphasis for semantic colors (positive, negative, warning, primary, secondary)
 * - "{color}Subtle": secondary emphasis for semantic colors
 * - "{color}Ghost": tertiary for semantic colors
 * - "semantic": inherits color from context via CSS variable, use only for custom color contexts
 *
 * @stateRules
 * - "disabled": when true, click handlers do not fire, aria-disabled=true, button is not focusable unless focusableWhenDisabled=true
 * - "selected": implies aria-pressed=true, should only be used for true toggle actions (not momentary/transient actions)
 * - "focusableWhenDisabled": when true, disabled button remains in tab order and can be focused (improves a11y for screen readers)
 *
 * @tokenConstraints
 * - color: use semantic tokens only (primary, secondary, positive, negative, warning, or inherit for semantic)
 * - size: use size tokens (xs, sm, md, lg, xl), never raw px values
 * - radius: use radius tokens (none, sm, md, lg), never raw px values
 *
 * @antiPatterns
 * - Do not invent custom variant names; only use defined variants — Use one of: contained, subtle, ghost, {color}Contained, {color}Subtle, {color}Ghost, semantic
 * - Do not use "selected" for momentary/transient button states; it implies aria-pressed toggle semantics — Use selected only for true toggle buttons (e.g., view mode toggles)
 * - Do not use raw color hex/rgb values; use color tokens instead — Replace #FF0000 with variant="negative" or color token
 * - Do not apply custom CSS directly; use the classes prop and theme tokens — Use className or classes prop with design tokens
 * - Do not mix semantic color variants with explicit color prop; choose one approach — Choose either variant="negative" OR color="..." but not both
 *
 * @a11y
 * - role: button (or implicit if component="button")
 * - name: must have accessible name via children or aria-label
 * - disabled state: uses aria-disabled=true; when disabled without focusableWhenDisabled, not in tab order
 * - selected state: uses aria-pressed when selected prop is set, for toggle buttons
 * - required: focusableWhenDisabled should be true when a disabled button needs to be discoverable by assistive tech
 *
 * @validationRules
 * - variant: must be one of the defined HvButtonVariant values only (error)
 * - color: must not be a raw hex/rgb value, use tokens instead (error)
 * - selected: should only be used with toggle-like interactions (warn)
 * - disabled + focusableWhenDisabled: warn if both true for extended periods in UI (info)
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
