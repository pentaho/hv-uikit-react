import { forwardRef, useMemo } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { getColor, HvColorAny } from "@hitachivantara/uikit-styles";

import { HvBaseProps } from "../types/generic";
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
