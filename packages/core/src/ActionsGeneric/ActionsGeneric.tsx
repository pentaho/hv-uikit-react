import { forwardRef, isValidElement } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton, HvButtonProps, HvButtonVariant } from "../Button";
import { HvDropDownMenu, HvDropDownMenuProps } from "../DropDownMenu";
import { HvIconButton } from "../IconButton";
import { HvIcon } from "../icons";
import { HvBaseProps } from "../types/generic";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./ActionsGeneric.styles";

export { staticClasses as actionsGenericClasses };

export type HvActionsGenericClasses = ExtractNames<typeof useClasses>;

export interface HvActionGeneric {
  /** Action id. */
  id: string;
  /** Action label. */
  label: string;
  /** Action icon. */
  icon?:
    | React.ReactNode
    | ((params: { isDisabled?: boolean }) => React.ReactNode);
  /** Whether the action is disabled or not. */
  disabled?: boolean;
  /** When set to `true`, the button will have the icon has its content and a tooltip with the label will appear when the button is visible and hovered. */
  iconOnly?: boolean;
}

export interface HvActionsGenericProps extends HvBaseProps {
  /** The button variant for all actions. */
  variant?: HvButtonVariant;
  /** Whether the actions should be all disabled. */
  disabled?: boolean;
  /** Whether the actions should be all icon buttons when visible. */
  iconOnly?: boolean;
  /** The renderable content inside the actions slot of the footer, or an array of actions. */
  actions: React.ReactNode | HvActionGeneric[];
  /** The callback function called when an action is triggered, receiving the `action` as parameter. */
  onAction?: (event: React.SyntheticEvent, action: HvActionGeneric) => void;
  /** The maximum number of visible actions before they're collapsed into a dropdown menu. */
  maxVisibleActions?: number;
  /** Props to be applied to the dropdown menu. */
  dropdownMenuProps?: Partial<HvDropDownMenuProps>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvActionsGenericClasses;
}

export const HvActionsGeneric = forwardRef<
  React.ComponentRef<"div">,
  HvActionsGenericProps
>(function HvActionsGeneric(props, ref) {
  const {
    id: idProp,
    classes: classesProp,
    className,
    variant = "secondaryGhost",
    disabled = false,
    actions = [],
    onAction,
    maxVisibleActions = Infinity,
    iconOnly: iconOnlyProp,
    dropdownMenuProps: dropdownMenuPropsProp,
    ...others
  } = useDefaultProps("HvActionsGeneric", props);

  const { onClick: onClickDropdownMenu, ...dropdownMenuProps } =
    dropdownMenuPropsProp || {};

  const { classes, cx } = useClasses(classesProp);

  if (!Array.isArray(actions)) return isValidElement(actions) ? actions : null;

  const renderButton = (action: HvActionGeneric, idx: number) => {
    const {
      disabled: actDisabled,
      id: actId,
      icon,
      label,
      iconOnly,
      ...other
    } = action;
    const actionId = setId(idProp, idx, "action", action.id);

    const renderedIcon = isValidElement(icon)
      ? icon
      : (icon as Function)?.({ isDisabled: disabled });

    const commonButtonProps: HvButtonProps = {
      id: actionId,
      variant,
      className: classes.button,
      disabled: actDisabled ?? disabled,
      onClick: (event) => onAction?.(event, action),
      ...other,
    };

    const key = actionId || idx;
    const isIcon = iconOnly ?? iconOnlyProp;

    if (isIcon) {
      return (
        <HvIconButton key={key} {...commonButtonProps} title={label}>
          {renderedIcon}
        </HvIconButton>
      );
    }

    return (
      <HvButton key={key} {...commonButtonProps} startIcon={renderedIcon}>
        {label}
      </HvButton>
    );
  };

  const renderActionsGrid = () => {
    const actsVisible = actions.slice(0, maxVisibleActions);
    const actsDropdown = actions.slice(maxVisibleActions);

    const iconColor = (variant === "semantic" && "textDark") || undefined;

    return (
      <>
        {actsVisible.map((action, idx) => renderButton(action, idx))}
        <HvDropDownMenu
          id={setId(idProp, "menu")}
          disabled={disabled}
          variant={variant}
          classes={{
            root: classes.dropDownMenu,
            icon: classes.dropDownMenuButton,
            iconSelected: classes.dropDownMenuButtonSelected,
          }}
          icon={<HvIcon name="DotsVertical" color={iconColor} />}
          placement="left"
          onClick={(event, action) => {
            onAction?.(event, action as HvActionGeneric);
            onClickDropdownMenu?.(event, action);
          }}
          dataList={actsDropdown}
          keepOpened={false}
          disablePortal={false}
          {...dropdownMenuProps}
        />
      </>
    );
  };

  const actionOverflow = actions.length > maxVisibleActions;

  return (
    <div
      ref={ref}
      className={cx(
        classes.root,
        { [classes.actionContainer]: actionOverflow },
        className,
      )}
      {...others}
    >
      {actionOverflow
        ? renderActionsGrid()
        : actions.map((action, idx) => renderButton(action, idx))}
    </div>
  );
});
