import { forwardRef } from "react";
import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import { HvButton } from "../Button";
import { useControlled } from "../hooks/useControlled";
import type { HvBaseProps } from "../types/generic";

export interface HvToggleButtonProps extends HvBaseProps<
  HTMLButtonElement,
  "onClick"
> {
  /** When uncontrolled, defines the initial selected state. */
  defaultSelected?: boolean;
  /** Defines if the button is selected. When defined the button state becomes controlled. */
  selected?: boolean;
  /** Defines if the button is disabled. */
  disabled?: boolean;
  /** Icon for when not selected. Ignored if the component has children. */
  notSelectedIcon?: React.ReactNode;
  /** Icon for when selected. Ignored if the component has children. */
  selectedIcon?: React.ReactNode;
  /** Function called when icon is clicked. */
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
    selected: boolean,
  ) => void;
}

/**
 * Use when two opposing states are represented and the on/off analogy doesn’t fit.
 *
 * Only use well-known icons—otherwise, prefer a single checkbox instead.
 */
export const HvToggleButton = forwardRef<
  HTMLButtonElement,
  HvToggleButtonProps
>(function HvToggleButton(props, ref) {
  const {
    defaultSelected,
    selected,
    notSelectedIcon,
    selectedIcon = null,
    onClick,
    children,
    ...others
  } = useDefaultProps("HvToggleButton", props);

  const [isSelected, setIsSelected] = useControlled(
    selected,
    Boolean(defaultSelected),
  );

  return (
    <HvButton
      ref={ref}
      icon
      selected={isSelected}
      onClick={(event) => {
        setIsSelected(!isSelected);
        onClick?.(event, !isSelected);
      }}
      {...others}
    >
      {children || (!isSelected ? notSelectedIcon : selectedIcon)}
    </HvButton>
  );
});
