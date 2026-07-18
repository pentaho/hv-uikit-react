/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton } from "../../Button";
import { HvIcon } from "../../icons";
import {
  HvListContainer,
  HvListItem,
  type HvListContainerProps,
} from "../../ListContainer";
import { HvOverflowTooltip } from "../../OverflowTooltip";
import type { NavigationData } from "../VerticalNavigationContext";
import { staticClasses, useClasses } from "./NavigationSlider.styles";

export { staticClasses as verticalNavigationSliderClasses };

export type HvVerticalNavigationSliderClasses = ExtractNames<typeof useClasses>;

export interface HvVerticalNavigationSliderProps extends Omit<
  HvListContainerProps,
  "classes"
> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvVerticalNavigationSliderClasses;
  /**
   * An array containing the data for each menu item.
   *
   * id - the id to be applied to the root element.
   * label - the label to be rendered on the menu item.
   * icon - the icon react element
   * data - sub-menu items
   * href - the url used for navigation.
   * target - the behavior when opening an url.
   */
  data?: NavigationData[];
  /** The selected item id. */
  selected?: string;
  /** Triggered when the item is clicked. */
  onNavigateToTarget?: (
    event: React.MouseEvent<HTMLLIElement>,
    item: NavigationData,
  ) => void;
  /** Triggered when the navigate to child button is clicked. */
  onNavigateToChild?: (
    event: React.MouseEvent<HTMLButtonElement>,
    item: NavigationData,
  ) => void;
  /** Aria label to apply to the navigate to submenu button on the list items. */
  forwardButtonAriaLabel?: string;
}

export const HvVerticalNavigationSlider = (
  props: HvVerticalNavigationSliderProps,
) => {
  const {
    className,
    classes: classesProp,
    data,
    selected,
    onNavigateToTarget,
    onNavigateToChild,
    forwardButtonAriaLabel = "Navigate to submenu",
    ...others
  } = useDefaultProps("HvVerticalNavigationSlider", props);

  const { classes, cx } = useClasses(classesProp);

  return (
    <HvListContainer
      interactive
      className={cx(classes.listContainer, className)}
      {...others}
    >
      {data?.map((item) => (
        <HvListItem
          key={item.id}
          classes={{
            root: classes.root,
            selected: classes.listItemSelected,
            focus: classes.listItemFocus,
            disabled: classes.listItemDisabled,
          }}
          onClick={(event) => {
            onNavigateToTarget?.(event, item);
          }}
          aria-label={item.label}
          aria-current={
            selected === item.id ? (item.href ? "page" : true) : undefined
          }
          selected={selected === item.id}
          startAdornment={item.icon ? <div>{item.icon}</div> : undefined}
          endAdornment={
            item.data && item.data.length > 0 ? (
              <HvButton
                icon
                onClick={(event) => {
                  onNavigateToChild?.(event, item);
                }}
                className={classes.forwardButton}
                aria-label={forwardButtonAriaLabel}
              >
                <HvIcon name="CaretRight" size="xs" />
              </HvButton>
            ) : undefined
          }
        >
          <HvOverflowTooltip data={item.label} />
        </HvListItem>
      ))}
    </HvListContainer>
  );
};
