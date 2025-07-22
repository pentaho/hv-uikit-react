import { forwardRef, useMemo } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { HvSize } from "@hitachivantara/uikit-styles";

import { HvBaseDropdown } from "../BaseDropdown";
import { useBaseDropdownContext } from "../BaseDropdown/context";
import { HvButtonVariant } from "../Button";
import { HvDropdownButton, HvDropdownButtonProps } from "../DropdownButton";
import { useControlled } from "../hooks/useControlled";
import { useLabels } from "../hooks/useLabels";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvIcon } from "../icons";
import { HvList, HvListProps, HvListValue } from "../List";
import { HvBaseProps } from "../types/generic";
import { getPrevNextFocus } from "../utils/focusableElementFinder";
import { isKey } from "../utils/keyboardUtils";
import { staticClasses, useClasses } from "./DropDownMenu.styles";

export { staticClasses as dropDownMenuClasses };

export type HvDropDownMenuClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  dropdownMenu: "Dropdown menu",
};

export interface HvDropDownMenuProps
  extends HvBaseProps<HTMLDivElement, "onClick" | "onToggle"> {
  /** Icon. */
  icon?: React.ReactElement<any>;
  /**
   * A list containing the elements to be rendered.
   *
   * - label: The label of the element to be rendered.
   * - selected: The selection state of the element.
   * - disabled: The disabled state of the element.
   * - icon: The icon node to be rendered on the left.
   * - showNavIcon: If true renders the navigation icon on the right.
   */
  dataList: HvListValue[];
  /** Placement of the dropdown. */
  placement?: "left" | "right";
  /** Disable the portal behavior. The children stay within it's parent DOM hierarchy. */
  disablePortal?: boolean;
  /** Function executed on toggle of the dropdown. Should receive the open status. */
  onToggle?: (
    event:
      | Event
      | React.KeyboardEvent<HTMLUListElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLLIElement>,
    open: boolean,
  ) => void;
  /** Function executed in each onClick. Should received the clicked element. */
  onClick?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLLIElement>,
    value: HvListValue,
  ) => void;
  /** Keep the Dropdown Menu opened after clicking one option */
  keepOpened?: boolean;
  /** Defines if the component is disabled. */
  disabled?: boolean;
  /** If true it should be displayed open. */
  expanded?: boolean;
  /** When uncontrolled, defines the initial expanded state. */
  defaultExpanded?: boolean;
  /**
   * The variant to be used in the header.
   * @deprecated Use `variant` instead
   */
  category?: HvButtonVariant;
  /** The variant to be used in the header. */
  variant?: HvButtonVariant;
  /** Button size. */
  size?: HvSize;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvDropDownMenuClasses;
  /** An object containing all the labels. */
  labels?: Partial<typeof DEFAULT_LABELS>;
}

const HeaderComponent = forwardRef<HTMLButtonElement, HvDropdownButtonProps>(
  function HeaderComponent(props, ref) {
    const { open, icon, disabled, ...others } = props;
    const { popperPlacement } = useBaseDropdownContext();

    return (
      <HvDropdownButton
        icon
        ref={ref}
        open={open}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="menu"
        placement={popperPlacement}
        {...others}
      >
        {icon || <HvIcon name="DotsVertical" />}
      </HvDropdownButton>
    );
  },
);

/**
 * A dropdown menu is a graphical control element, similar to a list box, that allows the user to choose a value from a list.
 */
export const HvDropDownMenu = forwardRef<
  React.ComponentRef<typeof HvBaseDropdown>,
  HvDropDownMenuProps
>(function HvDropDownMenu(props, ref) {
  const {
    id: idProp,
    classes: classesProp,
    className,
    icon,
    placement = "right",
    dataList,
    disablePortal = false,
    onToggle,
    onClick,
    keepOpened = true,
    disabled = false,
    expanded,
    defaultExpanded = false,
    category = "secondaryGhost", // TODO - remove and update variant default in v6
    variant,
    size = "md",
    labels: labelsProp,
    ...others
  } = useDefaultProps("HvDropDownMenu", props);

  const { classes, cx } = useClasses(classesProp);

  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  const [open, setOpen] = useControlled(expanded, Boolean(defaultExpanded));
  const id = useUniqueId(idProp);

  const handleClose = (
    event:
      | React.KeyboardEvent<HTMLUListElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLLIElement>,
  ) => {
    // this will only run if uncontrolled
    setOpen(false);
    onToggle?.(event, false);
  };

  // If the ESCAPE key is pressed inside the list, the close handler must be called.
  const handleKeyDown: HvListProps["onKeyDown"] = (event) => {
    if (isKey(event, "Tab")) {
      const focusNodes = getPrevNextFocus();
      const node = event.shiftKey ? focusNodes.prevFocus : focusNodes.nextFocus;
      if (node) setTimeout(() => node.focus(), 0);
      handleClose(event);
    }
    event.preventDefault();
  };

  const condensed = useMemo(() => dataList.every((el) => !el.icon), [dataList]);

  return (
    <HvBaseDropdown
      ref={ref}
      id={id}
      className={cx(classes.root, className, {
        [classes.open]: open,
      })}
      classes={{
        panel: classes.menuListRoot,
      }}
      expanded={open && !disabled}
      headerComponent={HeaderComponent}
      // @ts-expect-error infer HeaderComponent typings
      size={size}
      variant={variant ?? category}
      open={open}
      aria-label={labels.dropdownMenu}
      icon={icon}
      placement={placement}
      variableWidth
      disablePortal={disablePortal}
      onToggle={(e, s) => {
        // this will only run if uncontrolled
        setOpen(s);
        onToggle?.(e, s);
      }}
      disabled={disabled}
      onContainerCreation={(containerEl) => {
        containerEl?.getElementsByTagName("li")[0]?.focus();
      }}
      {...others}
    >
      <HvList
        values={dataList}
        selectable={false}
        condensed={condensed}
        onClick={(event, item) => {
          if (!keepOpened) handleClose(event);
          onClick?.(event, item);
        }}
        onKeyDown={handleKeyDown}
        classes={{
          root: classes.menuList,
        }}
      />
    </HvBaseDropdown>
  );
});
