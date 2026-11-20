import { forwardRef, useMemo } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import { getColor, type HvColorAny } from "@pentaho/uikit-styles";

import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Badge.styles";

export { staticClasses as badgeClasses };

export type HvBadgeClasses = ExtractNames<typeof useClasses>;

export interface HvBadgeProps extends HvBaseProps {
  /** The badge color. */
  color?: HvColorAny;
  /** True if a **numeric** `label` should be displayed. */
  showCount?: boolean;
  /** The maximum number of unread notifications to be displayed */
  maxCount?: number;
  /**
   * Badge content to show in.
   *
   * If value is numeric, then `showCount` and `maxCount` will show or limit the value respectively.
   */
  label?: React.ReactNode;
  /** Icon which the notification will be attached. */
  icon?: React.ReactNode;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvBadgeClasses;
}

/**
 * The badge is a component used to notify the user that something has occurred, in the app context.
 *
 * @variantSemantics
 * - "default": no color; textSubtle fill with inverted text, for neutral counts
 * - "primary": primary text on primaryDimmed, for new or unread items
 * - "positive": positive text on positiveDimmed
 * - "warning": warning text on warningDimmed
 * - "negative": negative text on negativeDimmed, for errors and alerts
 * - "textSubtle": textSubtle text on bgPageSecondary, a quiet neutral count
 * - "{color}": any other theme color; a solid fill in that color with inverted text
 *
 * @stateRules
 * - "label": text shows as given; a number shows only with showCount and hides at zero or below; a number without showCount, or an empty string, shows a dot; no label hides the badge
 * - "maxCount": numbers above it show as "{maxCount}+" (default 99)
 * - "icon": the badge sits on the icon's top-right corner, which gets at least an icon button's size
 * - "children": the badge sits on the children's top-right corner; with neither icon nor children it renders inline
 *
 * @a11y
 * role: none; the count is plain text after the icon or children, with no live region
 * - name: put the count in the owning control's accessible name ("Notifications, 3 unread"); the badge has no prop for its own label
 * - color: the color carries no meaning on its own; the control or label it sits on says what is counted
 */
export const HvBadge = forwardRef<
  // no-indent
  HTMLDivElement,
  HvBadgeProps
>(function HvBadge(props, ref) {
  const {
    classes: classesProp,
    className,
    color,
    showCount = false,
    maxCount = 99,
    label: labelProp,
    icon,
    children,
    style,
    ...others
  } = useDefaultProps("HvBadge", props);

  const { classes, cx } = useClasses(classesProp);

  const hasContent = !!(children || icon);

  const label = useMemo(() => {
    if (typeof labelProp !== "number") return labelProp;

    // `0` should not be rendered
    if (labelProp <= 0) return null;
    // render number if only if `showCount` is true
    if (!showCount) return "";

    return labelProp > maxCount ? `${maxCount}+` : labelProp;
  }, [maxCount, labelProp, showCount]);

  return (
    <div ref={ref} className={cx(classes.root, className)} {...others}>
      {children || icon}
      <div
        data-color={color}
        style={mergeStyles(style, {
          "--bg-color": color && getColor(color),
        })}
        data-badge-inline={!hasContent ? "" : undefined}
        className={cx(classes.badge, {
          [classes.badgeHidden]: label == null,
          [classes.badgeIcon]: icon,
          [classes.badgeOneDigit]: String(label).length === 1,
        })}
      >
        {label}
      </div>
    </div>
  );
});
