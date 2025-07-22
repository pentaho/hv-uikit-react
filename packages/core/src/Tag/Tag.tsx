import { cloneElement, forwardRef, isValidElement } from "react";
import {
  mergeStyles,
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import {
  getColor,
  theme,
  type HvColor,
  type HvColorAny,
  type HvSize,
} from "@hitachivantara/uikit-styles";

import { HvCheckBoxIcon } from "../BaseCheckBox/CheckBoxIcon";
import { HvButtonBase, HvButtonBaseProps } from "../ButtonBase";
import { useControlled } from "../hooks/useControlled";
import { HvIcon } from "../icons";
import { HvTypography } from "../Typography";
import { isDeleteKey } from "../utils/keyboardUtils";
import { staticClasses, useClasses } from "./Tag.styles";

export { staticClasses as tagClasses };

export type HvTagClasses = ExtractNames<typeof useClasses>;

const colorMap: Partial<Record<HvColorAny, HvColor>> = {
  positive_20: "positive",
  negative_20: "negative",
  warning_20: "warning",
  neutral_20: "info",
};

export interface HvTagProps
  extends Omit<
    HvButtonBaseProps,
    "type" | "color" | "classes" | "onClick" | "onToggle"
  > {
  /** The label of the tag element. */
  label?: React.ReactNode;
  /** Indicates that the form element is disabled. */
  disabled?: boolean;
  /** The type of the tag element. A tag can be of semantic or categoric type. */
  type?: "semantic" | "categorical";
  /** @deprecated */
  variant?: "filled" | "outlined";
  /** The size of the tag element. */
  size?: Extract<HvSize, "xs" | "sm" | "md">;
  /** The icon to use in the tag. */
  icon?: React.ReactNode;
  /** Whether to show the select icon checkbox. */
  showSelectIcon?: boolean;
  /** The color variant of the tag */
  color?: HvColorAny;
  /** Icon used to customize the delete icon */
  deleteIcon?: React.ReactElement<any>;
  /**
   * The callback fired when the delete icon is pressed.
   * This function has to be provided to the component, in order to render the delete icon
   * */
  onDelete?: React.EventHandler<any>;
  /** Callback triggered when any item is clicked. */
  onClick?: (event: React.MouseEvent<HTMLElement>, selected?: boolean) => void;
  /** Aria properties to apply to delete button in tag. @deprecated no longer used */
  deleteButtonArialLabel?: string;
  /** Props to apply to delete icon */
  deleteButtonProps?: React.HTMLAttributes<HTMLDivElement>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTagClasses;
  /** Determines whether or not the tag is selectable. */
  selectable?: boolean;
  /** Defines if the tag is selected. When defined the tag state becomes controlled. */
  selected?: boolean;
  /** When uncontrolled, defines the initial selected state. */
  defaultSelected?: boolean;
}

/**
 * A Tag is a single word that highlights a specific aspect of an asset. An asset can have multiple tags.
 *
 * Use tags to indicate status, aid recognition, and support navigation—leveraging color to convey consistent meaning across products.
 */
export const HvTag = forwardRef<
  // no-indent
  HTMLElement,
  HvTagProps
>(function HvTag(props, ref) {
  const {
    classes: classesProp,
    className,
    component,
    style,
    label,
    disabled,
    size = "xs",
    variant,
    type = "semantic",
    selectable,
    selected,
    defaultSelected = false,
    showSelectIcon = selectable,
    color: colorProp,
    icon: iconProp,
    deleteIcon: deleteIconProp,
    onDelete,
    onClick,
    onKeyDown,
    onKeyUp,
    deleteButtonArialLabel,
    deleteButtonProps,
    ...others
  } = useDefaultProps("HvTag", props);
  const { classes, cx } = useClasses(classesProp);
  const { activeTheme } = useTheme();

  const [isSelected, setIsSelected] = useControlled(
    selected,
    Boolean(defaultSelected),
  );

  const handleDeleteClick = (event: React.MouseEvent) => {
    // Stop the event from bubbling up to the tag
    event.stopPropagation();
    onDelete?.(event);
  };

  const color =
    (activeTheme?.name === "pentahoPlus" && colorMap[colorProp!]) || colorProp;

  const tagColor =
    // backwards-compatibility for `type` prop
    (type === "categorical" && theme.alpha(color || "cat1", 0.2)) ||
    // use the palette color if it matches
    theme.palette[color as keyof typeof theme.palette]?.[600] ||
    getColor(color);

  const isClickable = !!(onClick || onDelete || selectable);

  const deleteIcon =
    deleteIconProp && isValidElement(deleteIconProp) ? (
      cloneElement<any>(deleteIconProp, {
        className: classes.deleteIcon,
        onClick: handleDeleteClick,
      })
    ) : (
      <div>
        <HvIcon
          compact
          name="Close"
          onClick={handleDeleteClick as any}
          className={classes.deleteIcon}
          {...(deleteButtonProps as any)}
        />
      </div>
    );

  return (
    <HvButtonBase
      ref={ref as any}
      component={isClickable ? HvButtonBase : "div"}
      disabled={disabled}
      data-color={color}
      style={mergeStyles(style, {
        "--tagColor": tagColor,
      })}
      className={cx(classes.root, classes[size], className, {
        [classes.hasIcon]: iconProp || (selectable && showSelectIcon),
        [classes.clickable]: isClickable && !disabled,
        [classes.selected]: isSelected,
        [classes.disabled]: disabled,
        [classes.outlined]: variant === "outlined",
        [classes.categorical]: type === "categorical",
      })}
      onKeyUp={(event: React.KeyboardEvent<HTMLButtonElement>) => {
        // Ignore events from children.
        if (event.currentTarget === event.target && isDeleteKey(event)) {
          onDelete?.(event);
        }

        onKeyUp?.(event);
      }}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (selectable) setIsSelected(!isSelected);
        onClick?.(event, !isSelected);
      }}
      selected={isClickable && isSelected}
      {...others}
    >
      {iconProp}
      {selectable && showSelectIcon && (
        <HvCheckBoxIcon
          className={classes.icon}
          variant={isSelected ? "checked" : "default"}
          disabled={disabled}
        />
      )}
      <HvTypography
        noWrap
        variant="caption2"
        component="span"
        className={classes.label}
      >
        {label}
      </HvTypography>
      {onDelete && !disabled && deleteIcon}
    </HvButtonBase>
  );
});
