import { forwardRef } from "react";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { getColor, HvColorAny, HvSize } from "@hitachivantara/uikit-styles";

import { useAvatarGroupContext } from "../AvatarGroup/AvatarGroupContext";
import { useImageLoaded } from "../hooks/useImageLoaded";
import { HvIcon } from "../icons";
import { HvBaseProps } from "../types/generic";
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
  // if a user-defined `backgroundColor` is passed, ignore the theme-defined `color`
  const color = props.backgroundColor
    ? props.color || "bgContainer"
    : colorProp;

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
  } else if (hasImg && alt) {
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
          "--bgColor": !hasImgNotFailing && getColor(backgroundColor, "text"),
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
