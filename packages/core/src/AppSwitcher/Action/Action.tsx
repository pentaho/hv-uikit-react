import { useCallback } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";
import { getColor, HvColorAny } from "@hitachivantara/uikit-styles";

import { HvAvatar } from "../../Avatar";
import { useUniqueId } from "../../hooks/useUniqueId";
import { HvIcon } from "../../icons";
import { HvListItem } from "../../ListContainer";
import { HvOverflowTooltip } from "../../OverflowTooltip";
import { HvTooltip } from "../../Tooltip";
import { HvBaseProps } from "../../types/generic";
import { HvTypography } from "../../Typography";
import { staticClasses, useClasses } from "./Action.styles";

export { staticClasses as appSwitcherActionClasses };

export type HvAppSwitcherActionClasses = ExtractNames<typeof useClasses>;

export interface HvAppSwitcherActionApplication {
  /** Id of the application. */
  id?: string;
  /** Name of the application, this is the value that will be displayed on the component. */
  name: string;
  /** URL with the icon location to be used to represent the application. iconUrl will only be used if no iconElement is provided. */
  iconUrl?: string;
  /** Element to be added as the icon representing the application. The iconElement will be the primary option to be displayed. */
  iconElement?: React.ReactElement<any>;
  /** Small description of the application. */
  description?: string;
  /**  URL where the application is accessible. */
  url?: string;
  /** Defines if the application should be opened in the same tab or in a new one. */
  target?: "_top" | "_blank";
  /** If true, the item will be disabled. */
  disabled?: boolean;
  /** True when the application is selected, false otherwise. */
  isSelected?: boolean;
  /** The color of the application. */
  color?: HvColorAny;
}

export interface HvAppSwitcherActionProps extends HvBaseProps {
  /** The application data to be used to render the Action object. */
  application: HvAppSwitcherActionApplication;
  /** Callback triggered when the action is clicked. */
  onClickCallback?: (
    event: React.MouseEvent,
    application: HvAppSwitcherActionApplication,
  ) => void;
  /** Must return a boolean stating if the action element is selected or not. */
  isSelectedCallback?: (application: HvAppSwitcherActionApplication) => boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvAppSwitcherActionClasses;
}

export const HvAppSwitcherAction = ({
  id,
  className,
  classes: classesProp,
  application,
  onClickCallback = () => {},
  isSelectedCallback = () => false,
}: HvAppSwitcherActionProps) => {
  const { classes, cx } = useClasses(classesProp);

  const { name, description, disabled, iconElement, iconUrl, url, target } =
    application;

  const color = getColor(
    (disabled && "textDisabled") || application?.color || "text",
  );

  const renderApplicationIcon = () => {
    if (iconElement) return iconElement;

    const brokenTitle = name.split(" ");
    const initials =
      brokenTitle[0].charAt(0) + (brokenTitle[1]?.charAt(0) || "");

    return (
      <HvAvatar
        size="sm"
        src={iconUrl}
        className={classes.iconUrl}
        alt={description}
        backgroundColor={color}
        color="bgContainer"
        aria-hidden
      >
        {initials}
      </HvAvatar>
    );
  };

  const isSelected = isSelectedCallback(application);

  /**
   * Handles the onClick event and triggers the appropriate callback if it exists.
   */
  const handleOnClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      onClickCallback?.(event, { ...application, isSelected });
    },
    [application, disabled, isSelected, onClickCallback],
  );

  const isLink = url != null;
  const descriptionElementId = useUniqueId(id);

  return (
    <HvListItem
      id={id}
      interactive
      tabIndex={0}
      selected={isSelected}
      disabled={disabled}
      className={cx(
        classes.root,
        {
          [classes.selected]: isSelected,
          [classes.disabled]: disabled,
        },
        className,
      )}
    >
      <HvTypography
        component="button"
        className={classes.typography}
        onClick={handleOnClick}
        style={{ borderColor: color }}
        aria-label={name}
        {...(description && { "aria-describedby": descriptionElementId })}
        {...(isLink && { component: "a", href: url, target: target || "_top" })}
      >
        <div className={classes.icon}>{renderApplicationIcon()}</div>

        <HvOverflowTooltip
          paragraphOverflow
          className={classes.title}
          placement="top-start"
          data={name}
          classes={{
            tooltipAnchorParagraph: classes.titleAnchor,
          }}
        />

        {description && (
          <HvTooltip title={description}>
            <HvIcon
              name="Info"
              compact
              className={classes.iconInfo}
              id={descriptionElementId}
            />
          </HvTooltip>
        )}
      </HvTypography>
    </HvListItem>
  );
};
