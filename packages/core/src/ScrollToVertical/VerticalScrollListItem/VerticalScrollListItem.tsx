import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvTooltip, HvTooltipProps } from "../../Tooltip";
import { HvBaseProps } from "../../types/generic";
import { staticClasses, useClasses } from "./VerticalScrollListItem.styles";

export { staticClasses as verticalScrollListItemClasses };

export type HvVerticalScrollListItemClasses = ExtractNames<typeof useClasses>;

export interface HvVerticalScrollListItemProps
  extends HvBaseProps<HTMLDivElement | HTMLAnchorElement> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvVerticalScrollListItemClasses;
  /** Whether the element is selected. */
  selected?: boolean;
  label?: React.ReactNode;
  tooltipPlacement?: HvTooltipProps["placement"];

  /**
   * The link to be set in the href attribute of the anchor element.
   *
   * If this is not set, the element will be rendered as a div with a button role.
   */
  href?: string;
}

/**
 * HvVerticalScrollListItem a focusable item to be used as part of the vertical scroll
 */
export const HvVerticalScrollListItem = (
  props: HvVerticalScrollListItemProps,
) => {
  const {
    id,
    className,
    classes: classesProp,
    selected,
    label,
    tooltipPlacement = "left",
    href,
    ...others
  } = useDefaultProps("HvVerticalScrollListItem", props);
  const { classes, cx } = useClasses(classesProp);

  const Component = href != null ? "a" : "div";

  return (
    <li id={id} className={cx(classes.root, className)} aria-current={selected}>
      <HvTooltip title={label} placement={tooltipPlacement}>
        <Component
          role={href == null ? "button" : undefined}
          tabIndex={0}
          className={classes.button}
          href={href}
          {...others}
        >
          <div
            className={cx(classes.icon, {
              [classes.notSelected]: !selected,
            })}
          />
        </Component>
      </HvTooltip>
    </li>
  );
};
