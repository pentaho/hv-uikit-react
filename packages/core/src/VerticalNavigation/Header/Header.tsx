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
import { useContext, useMemo } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton, type HvButtonProps } from "../../Button";
import { HvIcon } from "../../icons";
import type { HvBaseProps } from "../../types/generic";
import { HvTypography } from "../../Typography";
import { VerticalNavigationContext } from "../VerticalNavigationContext";
import { staticClasses, useClasses } from "./Header.styles";

export { staticClasses as verticalNavigationHeaderClasses };

export type HvVerticalNavigationHeaderClasses = ExtractNames<typeof useClasses>;

export interface HvVerticalNavigationHeaderProps extends HvBaseProps {
  /** The title text to show on header. */
  title?: string;
  /** Icon to show when vertical navigation is collapsed. */
  openIcon?: React.ReactNode;
  /** Icon to show when vertical navigation is expanded. */
  closeIcon?: React.ReactNode;
  /** Props for the collapse button. */
  collapseButtonProps?: HvButtonProps;
  /** Props for the back button. */
  backButtonProps?: HvButtonProps;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvVerticalNavigationHeaderClasses;
  /** Handler for the collapse button. */
  onCollapseButtonClick?: React.MouseEventHandler<HTMLElement>;
}

export const HvVerticalNavigationHeader = (
  props: HvVerticalNavigationHeaderProps,
) => {
  const {
    title,
    openIcon: openIconProp,
    closeIcon: closeIconProp,
    collapseButtonProps = {},
    backButtonProps = {},
    className,
    classes: classesProp,
    onCollapseButtonClick,
    ...others
  } = useDefaultProps("HvVerticalNavigationHeader", props);

  const {
    isOpen,
    useIcons,
    headerTitle,
    slider,
    navigateToParentHandler,
    parentItem,
  } = useContext(VerticalNavigationContext);

  const { classes, cx } = useClasses(classesProp);

  // whenever we're in a sublevel, the parentItem is always a single item.
  // In the first level it's always an array with the first level elements.
  const shouldShowTitle = useMemo(
    () => !slider || (slider && !Array.isArray(parentItem)),
    [parentItem, slider],
  );

  if (!shouldShowTitle) return null;

  const openIcon = openIconProp ?? (
    <HvIcon name={useIcons ? "Forwards" : "Menu"} />
  );
  const closeIcon = closeIconProp ?? <HvIcon name="Backwards" />;

  const handleClickBack = () => navigateToParentHandler?.();

  const { className: backButtonClassName, ...otherBackButtonProps } =
    backButtonProps;

  const {
    className: collapseButtonClassName,
    classes: collapseButtonClasses,
    ...otherCollapseButtonProps
  } = collapseButtonProps;

  return (
    <div
      className={cx(classes.root, { [classes.minimized]: !isOpen }, className)}
      {...others}
    >
      {isOpen && headerTitle && slider && (
        <HvButton
          icon
          onClick={handleClickBack}
          className={cx(classes.backButton, backButtonClassName)}
          aria-label="Back"
          {...otherBackButtonProps}
        >
          <HvIcon name="Backwards" size="xs" />
        </HvButton>
      )}
      {isOpen && (
        <HvTypography
          variant={slider ? "label" : "title3"}
          className={classes.title}
        >
          {headerTitle && slider ? headerTitle : title}
        </HvTypography>
      )}
      {onCollapseButtonClick && (
        <HvButton
          icon
          onClick={onCollapseButtonClick}
          className={cx(classes.collapseButton, collapseButtonClassName)}
          classes={{
            ...collapseButtonClasses,
            root: cx(
              { [classes.minimized]: !isOpen }, // TODO - v6 don't use minimized classes in two different places
              collapseButtonClasses?.root,
            ),
          }}
          {...otherCollapseButtonProps}
        >
          {isOpen ? closeIcon : openIcon}
        </HvButton>
      )}
    </div>
  );
};
