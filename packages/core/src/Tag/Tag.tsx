import { cloneElement, forwardRef, isValidElement } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import {
  getColor,
  theme,
  type HvColorAny,
  type HvSize,
} from "@pentaho/uikit-styles";

import { HvCheckBoxIcon } from "../BaseCheckBox/CheckBoxIcon";
import { HvButtonBase, type HvButtonBaseProps } from "../ButtonBase";
import { useControlled } from "../hooks/useControlled";
import { HvIcon } from "../icons";
import { HvTypography } from "../Typography";
import { isDeleteKey } from "../utils/keyboardUtils";
import { staticClasses, useClasses } from "./Tag.styles";

export { staticClasses as tagClasses };

export type HvTagClasses = ExtractNames<typeof useClasses>;

export interface HvTagProps extends Omit<
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
 *
 * @variantSemantics
 * - "semantic": default type; the tag color comes from the color prop
 * - "categorical": uses the color at 20% alpha as the tag color; defaults to cat1
 *
 * @stateRules
 * - "selectable": when true, a click toggles the selected state and onClick receives the next selected value
 * - "selected": when defined, the tag is controlled; otherwise defaultSelected sets the initial state
 * - "disabled": click handlers do not run and the delete icon is hidden
 * - "onDelete": when provided, a delete icon is shown, and the keyboard delete key on the focused tag calls onDelete
 *
 * @tokenConstraints
 * - size: use xs, sm, or md; the size prop accepts no other values
 * - color: use a palette or categorical color name; never raw hex or rgb values
 *
 * @antiPatterns
 * - Do not use a span or div styled as a tag; it has no tag behavior or styling — Use HvTag with type and color
 * - Do not use an emoji as the tag icon; the design system does not style emoji — Pass an HvIcon element to the icon prop
 * - Do not use the deprecated variant prop; it exists only for backwards compatibility — Use type and color instead
 * - Do not use a tag as an action button; tags describe an asset — Use HvButton for actions
 *
 * @a11y
 * role: button when clickable (onClick, onDelete, or selectable is set); otherwise no role
 * - name: the label is the accessible name; a clickable tag must have a label
 * - selected: when selectable, the button sets aria-pressed to the selected state
 * - delete: when focused, the tag handles the keyboard delete key
 *
 * @validationRules
 * - type: type must be semantic or categorical (error)
 * - size: size must be xs, sm, or md (error)
 * - label: label must be provided (error)
 * - variant: the variant prop is deprecated; use type instead (warn)
 * - icon: icon must be an HvIcon element, not emoji or text (warn)
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
    size = "sm",
    variant,
    type = "semantic",
    selectable,
    selected,
    defaultSelected = false,
    showSelectIcon = false,
    color,
    icon: iconProp,
    deleteIcon: deleteIconProp,
    onDelete,
    onClick,
    onKeyDown,
    onKeyUp,
    deleteButtonProps,
    ...others
  } = useDefaultProps("HvTag", props);
  const { classes, cx } = useClasses(classesProp);
  const [isSelected, setIsSelected] = useControlled(
    selected,
    Boolean(defaultSelected),
  );

  const handleDeleteClick = (event: React.MouseEvent) => {
    // Stop the event from bubbling up to the tag
    event.stopPropagation();
    onDelete?.(event);
  };

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
