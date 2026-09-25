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
 * - "default": uses primary color by default, commonly for notifications and alerts
 * - "positive" (color="positive"): success state, for completed or positive actions
 * - "negative" (color="negative"): error or critical state, for alerts and errors
 * - "warning" (color="warning"): attention state, for warnings and cautions
 * - "secondary" (color="secondary"): neutral state, for secondary information
 *
 * @stateRules
 * - "label": content to display; can be numeric (for counts) or React node
 * - "showCount": when true with numeric label, displays the count; when false, empty badge
 * - "maxCount": limits numeric display (e.g., "99+" when count exceeds maxCount)
 * - "icon": when provided, badge attaches to icon instead of inline display
 * - "children": when provided, badge displays alongside the children element
 *
 * @tokenConstraints
 * - color: use semantic tokens only (positive, negative, warning, primary, secondary), never raw hex/rgb
 * - size: determined by content; no explicit size control, adapts to parent
 *
 * @antiPatterns
 * - Do not use arbitrary numeric values without semantic meaning; badges should represent countable state — Always pair numeric labels with clear meaning (unread count, notifications, etc.)
 * - Do not hardcode color values; use color tokens instead — Replace color="#FF0000" with color="negative"
 * - Do not use badge for purely decorative purposes without accessible text — If purely visual, use aria-hidden=true on wrapper
 * - Do not mix label and icon without clear content hierarchy; choose one as primary — Pair either numeric label OR icon, not both competing for attention
 *
 * @a11y
 * - role: status or presentation (depends on context; should be determined by parent)
 * - name: if the badge conveys meaning (not purely visual), should have aria-label on parent
 * - announcement: badge updates should trigger aria-live announcements if conveying important state changes
 * - hidden: if badge is purely decorative (e.g., visual accent only), parent wrapper should have aria-hidden=true on badge
 *
 * @validationRules
 * - color: must be a semantic token or undefined (error)
 * - label: should be numeric or short React node; long text is poor UX (warn)
 * - maxCount: should be >= 0 (error)
 * - showCount + non-numeric label: showCount should only be true with numeric labels (warn)
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
