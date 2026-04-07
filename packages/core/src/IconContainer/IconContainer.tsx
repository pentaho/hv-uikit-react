import { forwardRef } from "react";
import {
  createClasses,
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import {
  getColor,
  type HvColorAny,
  type HvSize,
} from "@hitachivantara/uikit-styles";

type HvIconSize = "XS" | "S" | "M" | "L";

// keep this aligned with `icon`'s package, TODO: dedupe
export const { staticClasses, useClasses } = createClasses("HvIconContainer", {
  root: {
    display: "inline-flex",
    flex: "0 0 auto", // ensure icon doesn't flex grow/shrink
    fontSize: `var(--isize, 16px)`, // default size of 16px
    transition: "rotate 0.2s ease",
    justifyContent: "center",
    alignItems: "center",
    padding: 8, // default padding
    // we're assuming svg children inherits from text color and size
  },
  xs: {
    fontSize: 12,
    padding: 10,
  },
  sm: {
    fontSize: 16,
  },
  md: {
    fontSize: 32,
  },
  lg: {
    fontSize: 96,
  },
  xl: {
    fontSize: 112,
  },
});

export { staticClasses as iconContainerClasses };

export type HvIconContainerClasses = ExtractNames<typeof useClasses>;

export interface HvIconContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  classes?: HvIconContainerClasses;
  /**
   * A color to override the default icon colors.
   * Accepts any valid CSS color or color from the UI Kit palette.
   * @example "warning"
   */
  color?: HvColorAny;
  /**
   * The size of the icon container. Takes in a `number` in pixels or any `HvSize` or `IconSize`.
   *
   * This will also affect the size of the icon by changing the `font-size`.
   *
   * @example
   * size={16}
   * size="S"
   * size="lg"
   *
   * @default "S"
   */
  size?: HvSize | HvIconSize | number;
  /** Whether to rotate the icon 180deg. @private */
  rotate?: boolean;
}
/**
 * This component allows using the theme utilities, such as `color` and `size` in icons from
 * external icon libraries, such as FontAwesome or Phosphor.
 *
 * @example
 * <HvIconContainer size="lg" color="warning">
 *  <FontAwesomeIcon icon={faUser} />
 * </HvIconContainer>
 */
export const HvIconContainer = forwardRef<
  // no-indent
  HTMLDivElement,
  HvIconContainerProps
>(function HvIconContainer(props, ref) {
  const {
    className,
    classes: classesProp,
    style,
    color,
    size = "S",
    rotate,
    children,
    ...others
  } = useDefaultProps("HvIconContainer", props);
  const { cx, classes } = useClasses(classesProp);

  return (
    <div
      ref={ref}
      className={cx(classes.root, className, {
        [classes[mapSizes(size)!]]: size,
      })}
      style={mergeStyles(style, {
        "--isize": typeof size === "number" ? `${size}px` : undefined,
        color: getColor(color),
        rotate: rotate ? "180deg" : undefined,
        ...style,
      })}
      {...others}
    >
      {children}
    </div>
  );
});

function mapSizes(size: HvSize | HvIconSize | number) {
  if (typeof size === "number") return undefined;
  const iconSizeMap: Record<HvIconSize, HvSize> = {
    XS: "xs",
    S: "sm",
    M: "md",
    L: "lg",
  };
  return iconSizeMap[size as HvIconSize] || size;
}
