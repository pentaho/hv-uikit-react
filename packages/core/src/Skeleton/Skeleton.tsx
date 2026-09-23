import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-utils";

import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Skeleton.styles";

export { staticClasses as skeletonClasses };

export type HvSkeletonClasses = ExtractNames<typeof useClasses>;

export interface HvSkeletonProps extends HvBaseProps {
  /** Whether the skeleton element is hidden or not. */
  hidden?: boolean;
  /** The type of skeleton element. @default "text" */
  variant?: "circle" | "square" | "text";
  /** The animation the skeleton element will display. @default "pulse" */
  animation?: "pulse" | "wave";
  /** The width of the skeleton element. */
  width?: React.CSSProperties["width"];
  /** The height of the skeleton element. */
  height?: React.CSSProperties["height"];
  /** The url for a placeholder image to use on the skeleton element. */
  backgroundImage?: string;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvSkeletonClasses;
}

/**
 * The Skeleton component displays a placeholder that mimics the shape and size of loading content.
 *
 * @stateRules
 * - "variant": "text" (default) for lines of text, "circle" for avatars, "square" for images or media; match the shape of the content it replaces
 * - "animation": "pulse" (default) or "wave"; use one animation for all skeletons on the same screen
 * - "width": size the placeholder to the content it replaces so the layout does not shift when content loads
 * - "height": size the placeholder to the content it replaces so the layout does not shift when content loads
 * - "hidden": when true, the placeholder is not rendered and children are shown in its place; use it to swap in the real content once loading ends
 * - "backgroundImage": a placeholder image URL shown inside the skeleton; use it only when the real content has a known image
 *
 * @tokenConstraints
 * - color: the placeholder uses the page secondary background token; override it only through the classes prop with theme tokens, never raw hex or rgb values
 * - radius: the circle and square variants use theme radius tokens; do not set custom border radius
 *
 * @antiPatterns
 * - Do not show a skeleton for content that is already loaded; it hides real data — Render the content directly
 * - Do not place real content inside a skeleton while it is active; children are not visible until hidden is true — Use the hidden prop to reveal the children after loading
 * - Do not use a skeleton for an indefinite process with no known content shape; it implies a shape that will not appear — Use HvLoading
 * - Do not use a raw hex or rgb value for the placeholder color; it bypasses the theme — Use the default background token or a theme token through the classes prop
 *
 * @a11y
 * role: HvSkeleton renders a plain div with no role; it is decorative until a role is set
 * - status: when the skeleton stands in for content that is loading, add role="progressbar" and aria-label (for example "Loading customer list") so assistive technology announces the state
 * - children: while the placeholder is active, its children are visibility hidden and removed from assistive technology
 * - hidden: when the placeholder is replaced, the real content is exposed to assistive technology again
 *
 * @validationRules
 * - variant: must be circle, square, or text (error)
 * - status: a skeleton that stands in for loading content must set role="progressbar" and aria-label (warn)
 * - color: must not use raw hex or rgb values for color overrides (error)
 */
export const HvSkeleton = (props: HvSkeletonProps) => {
  const {
    classes: classesProp,
    className,
    children,
    hidden = false,
    variant = "text",
    animation = "pulse",
    backgroundImage,
    width,
    height,
    style,
    ...others
  } = useDefaultProps("HvSkeleton", props);
  const { classes, cx } = useClasses(classesProp);

  if (hidden) return <div className={classes.content}>{children}</div>;

  return (
    <div
      className={cx(
        classes.root,
        classes[variant],
        classes[animation],
        className,
      )}
      style={{
        width,
        height,
        ...(backgroundImage && {
          background: `center / contain no-repeat url(${backgroundImage})`,
        }),
        ...style,
      }}
      {...others}
    >
      {children}
    </div>
  );
};
