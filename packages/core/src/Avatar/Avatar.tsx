import { forwardRef } from "react";
import MuiAvatar, {
  type AvatarProps as MuiAvatarProps,
} from "@mui/material/Avatar";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import { getColor, type HvColorAny, type HvSize } from "@pentaho/uikit-styles";

import { useAvatarGroupContext } from "../AvatarGroup/AvatarGroupContext";
import { useImageLoaded } from "../hooks/useImageLoaded";
import { HvIcon } from "../icons";
import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Avatar.styles";

const decreaseSizeMap = {
  xl: "lg",
  lg: "md",
  md: "sm",
  sm: "xs",
  xs: "xs",
} satisfies Record<HvSize, HvSize>;

export { staticClasses as avatarClasses };

export type HvAvatarClasses = ExtractNames<typeof useClasses>;

export type HvAvatarVariant = "circular" | "square";

export interface HvAvatarProps extends HvBaseProps {
  /** The component used for the root node. Either a string to use a DOM element or a component. */
  component?: React.ElementType;
  /** Sets one of the standard sizes of the icons */
  size?: HvSize;
  /** A color representing the foreground color of the avatar's letters or the generic User icon fallback. */
  color?: HvColorAny;
  /** A String representing the background color of the avatar. */
  backgroundColor?: HvColorAny;
  /** The `src` attribute for the `img` element. */
  src?: string;
  /** The `srcSet` attribute for the `img` element. Use this attribute for responsive image display. */
  srcSet?: string;
  /** The `sizes` attribute for the `img` element. */
  sizes?: string;
  /** Used in combination with `src` or `srcSet` to provide an alt attribute for the rendered `img` element. */
  alt?: string;
  /**
   * Attributes applied to the `img` element if the component is used to display an image.
   * It can be used to listen for the loading error event.
   */
  imgProps?: React.HTMLAttributes<HTMLImageElement>;
  /** A string representing the type of avatar to display, circular or square. */
  variant?: HvAvatarVariant;
  /** A string representing the color of the avatar border that represents its status. */
  status?: HvColorAny;
  /** A string representing the color of the avatar badge. */
  badge?: HvColorAny;
  /** Attributes applied to the avatar element. */
  avatarProps?: MuiAvatarProps;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvAvatarClasses;
}

/**
 * Avatars represent a user or brand and can display an image, icon, or initials.
 * Use for profile pictures, user indicators, and brand representation.
 * For displaying multiple avatars together, pair with HvAvatarGroup component.
 *
 * @variantSemantics
 * - "circular" (default): standard avatar shape, recommended for user profiles and social contexts
 * - "square": squared avatar shape, recommended for brand/product logos and icons
 *
 * @stateRules
 * - "status": optional color indicator (typically green=online, red=offline, yellow=away) displayed as border
 * - "badge": optional color badge overlay, useful for notifications or secondary status
 * - "src/srcSet": when provided, displays image; when missing or fails to load, displays fallback (icon or initials)
 * - "size": determines avatar dimensions; when in AvatarGroup, automatically scales down by one level
 *
 * @tokenConstraints
 * - size: use tokens only (xs, sm, md, lg, xl), never raw pixel values
 * - color: use semantic color tokens (primary, secondary, positive, negative, warning) or hex from design system
 * - backgroundColor: use semantic color tokens or inherit from context when in AvatarGroup
 * - status: use semantic tokens for status indication (positive=online, negative=offline, warning=away)
 * - badge: use semantic tokens for badge color (negative=notification count, warning=pending, etc.)
 *
 * @antiPatterns
 * - Do not pass both initials and image; image takes precedence, initials are fallback — Provide either src or children, not both with expectation of showing both
 * - Do not use status/badge color without clear semantic meaning; use semantic colors — Use status/badge only for actual status indication, not purely decorative
 * - Do not set backgroundColor when avatar will be in AvatarGroup; let group control styling — Remove custom backgroundColor if wrapping in HvAvatarGroup
 * - Do not use xl/lg sizes in dense layouts; respect space constraints — Scale avatars appropriately for context (dense=xs/sm, normal=md, prominent=lg/xl)
 * - Do not forget alt text when src is provided; accessibility requires it — Always include alt prop when using image
 *
 * @a11y
 * - role: img (implicit when displaying image or initials)
 * - name: alt text required when src provided; aria-label optional for icon-only avatars
 * - status/badge: should be announced via aria-label or visible label (e.g., "User John, currently online")
 * - fallback: should display accessible content (initials or generic User icon) when image fails
 * - when in AvatarGroup: parent handles overall group semantics, avatar is presentational
 *
 * @validationRules
 * - variant (circular | square): must be one of the defined variants only (error)
 * - size (xs | sm | md | lg | xl): must be one of the defined size tokens only (error)
 * - alt text: should be provided when src is set (warn)
 * - semantic tokens: status and badge colors should use semantic tokens (warn)
 * - backgroundColor: should be omitted if parent is HvAvatarGroup (info)
 */
export const HvAvatar = forwardRef<
  // no-indent
  React.ComponentRef<"div">,
  HvAvatarProps
>(function HvAvatar(props, ref) {
  const {
    className,
    style,
    classes: classesProp,
    children: childrenProp,
    component = "div",
    size: sizeProp,
    backgroundColor,
    color: colorProp,
    src,
    srcSet,
    sizes,
    alt,
    imgProps,
    status,
    badge,
    variant = "circular",
    avatarProps,
    ...others
  } = useDefaultProps("HvAvatar", props);
  const { classes, cx } = useClasses(classesProp);
  const defaultBackgroundColor = backgroundColor ?? "primaryDimmed";
  const defaultColor = colorProp ?? "primaryStrong";

  // if a user-defined `backgroundColor` is passed, ignore the theme-defined `color`
  const color = props.backgroundColor
    ? props.color || "bgContainer"
    : defaultColor;

  const avatarGroupContext = useAvatarGroupContext();

  const size = sizeProp || avatarGroupContext?.size || "sm";

  let children: React.ReactNode;

  // Use a hook instead of onError on the img element to support server-side rendering.
  const imageLoaded = useImageLoaded(src, srcSet);
  const hasImg = src || srcSet;
  const hasImgNotFailing = hasImg && imageLoaded !== "error";

  if (hasImgNotFailing) {
    children = (
      <img
        alt={alt}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        className={classes.img}
        {...imgProps}
      />
    );
  } else if (childrenProp != null) {
    children = childrenProp;
  } else if (alt) {
    [children] = alt;
  } else {
    children = (
      <HvIcon
        name="User"
        size={decreaseSizeMap[size]}
        className={classes.fallback}
      />
    );
  }

  const statusColor = getColor(status, "positive");

  return (
    <div
      ref={ref}
      className={cx(classes.container, classes[variant])}
      style={mergeStyles(undefined, {
        // we're using the boxShadow to have the border inside the container and not on its edge.
        boxShadow: status && `inset 0px 0px 0px 2px ${statusColor}`,
      })}
      {...others}
    >
      {badge && (
        <div
          className={classes.badge}
          style={{ backgroundColor: getColor(badge, "positive") }}
        />
      )}
      <MuiAvatar
        component={component}
        // Consider not using the root and className classes in this component
        className={cx(classes.root, classes.avatar, classes[size], className)}
        data-color={color}
        style={mergeStyles(style, {
          "--bgColor":
            !hasImgNotFailing && getColor(defaultBackgroundColor, "text"),
          "--textColor": !hasImgNotFailing && getColor(color, "bgContainer"),
          borderRadius:
            component != null && typeof component !== "string" && "50%",
        })}
        variant={variant}
        size={size}
        {...avatarProps}
      >
        {children}
      </MuiAvatar>
    </div>
  );
});
