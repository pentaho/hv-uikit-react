import {
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvFocus } from "../../Focus";
import { HvBaseProps } from "../../types/generic";
import HvListContext from "../ListContext";
import { staticClasses, useClasses } from "./ListItem.styles";

export { staticClasses as listItemClasses };

export type HvListItemClasses = ExtractNames<typeof useClasses>;

export interface HvListItemProps extends HvBaseProps<HTMLLIElement> {
  /** Indicates if the list item is selected. */
  selected?: boolean;
  /** Indicated if the list item is _visually_ selectable */
  selectable?: boolean;
  /** If true, the list item will be disabled. */
  disabled?: boolean;
  /**
   * If the list item is focusable and reacts to mouse over events.
   * Defaults to true if the container list is interactive, false otherwise.
   */
  interactive?: boolean;
  /**
   * If `true` compacts the vertical spacing intended to separate the list items.
   * Defaults to the value set in container list.
   */
  condensed?: boolean;
  /**
   * If `true`, the left and right padding is removed.
   * Defaults to the value set in container list.
   */
  disableGutters?: boolean;
  /**
   * Element placed before the children.
   * Also removes the left padding (gutter).
   *
   * Some modifications are applied, assuming that it is either an icon (changing the color when the item is disabled)
   * or a selector (preventing the double focus ring, propagating the checked and disabled states and wiring the onChange event).
   * If unwanted, the element should be placed directly as a child.
   */
  startAdornment?: React.ReactNode;
  /**
   * Element placed after the children and aligned next to the margin.
   * Also removes the right padding (gutter).
   *
   * Some modifications are applied, assuming that it is an icon (changing the color when the item is disabled).
   * If unwanted, the element should be placed directly as a child.
   */
  endAdornment?: React.ReactNode;
  /** Whether to show a separator after this list item */
  separator?: boolean;
  /** The value to be set on the 'li' element */
  value?: any;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvListItemClasses;
}

/**
 * Implements the listitem pattern, akin to the `<li>` element.
 * Should be composed within a `<HvListContainer>` component.
 */
export const HvListItem = forwardRef<
  // no-indent
  React.ComponentRef<"li">,
  HvListItemProps
>(function HvListItem(props, ref) {
  const {
    classes: classesProp,
    className,
    role,
    value,
    selected,
    disabled,
    selectable: selectableProp,
    interactive: interactiveProp,
    condensed: condensedProp,
    disableGutters: disableGuttersProp,
    separator,
    startAdornment,
    endAdornment,
    onClick,
    children,
    tabIndex,
    ...others
  } = useDefaultProps("HvListItem", props);

  const { classes, cx } = useClasses(classesProp);

  const {
    topContainerRef,
    condensed: condensedContext,
    disableGutters: disableGuttersContext,
    interactive: interactiveContext,
    selectable: selectableContext,
  } = useContext(HvListContext);

  const condensed = condensedProp ?? condensedContext;
  const disableGutters = disableGuttersProp ?? disableGuttersContext;
  const interactive = interactiveProp ?? interactiveContext;
  const selectable = selectableProp ?? selectableContext;

  const handleClick = useCallback<React.MouseEventHandler<HTMLLIElement>>(
    (evt) => {
      if (disabled) return;
      onClick?.(evt);
    },
    [disabled, onClick],
  );

  const clonedStartAdornment = useMemo(() => {
    if (!isValidElement(startAdornment)) return startAdornment;
    return cloneElement(startAdornment as ReactElement, {
      className: cx(classes.startAdornment, startAdornment.props.className),
    });
  }, [cx, classes?.startAdornment, startAdornment]);

  const clonedEndAdornment = useMemo(() => {
    if (!isValidElement(endAdornment)) return endAdornment;
    return cloneElement(endAdornment as ReactElement, {
      className: cx(classes.endAdornment, endAdornment.props.className),
    });
  }, [cx, classes?.endAdornment, endAdornment]);

  const roleOptionAriaProps =
    role === "option" || role === "menuitem"
      ? {
          "aria-disabled": disabled || undefined,
          "aria-selected": selected,
        }
      : {};

  const listItem = (
    // For later: this should only have an onClick event if interactive and has the appropriate role.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <li
      ref={ref}
      role={role}
      value={value}
      className={cx(
        classes.root,
        {
          [classes.gutters]: !disableGutters,
          [classes.condensed]: condensed,
          [classes.interactive]: interactive || selectable,
          [classes.selected]: selected || props["aria-selected"],
          [classes.disabled]: disabled || props["aria-disabled"],
        },
        className,
      )}
      tabIndex={interactive ? undefined : tabIndex}
      onClick={handleClick}
      {...roleOptionAriaProps}
      {...others}
    >
      {clonedStartAdornment}
      {children}
      {clonedEndAdornment}
    </li>
  );

  const item = interactive ? (
    <HvFocus
      rootRef={topContainerRef}
      selected={selected}
      disabledClass={disabled || undefined}
      strategy={role === "option" ? "listbox" : "menu"}
      classes={{ focus: classes.focus }}
      configuration={{
        tabIndex,
      }}
    >
      {listItem}
    </HvFocus>
  ) : (
    listItem
  );

  if (separator) {
    return (
      <>
        {item}
        <li role="separator" className={classes.separator} aria-hidden="true" />
      </>
    );
  }

  return item;
});
