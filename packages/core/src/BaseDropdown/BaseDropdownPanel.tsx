import { useMemo, useRef, useState } from "react";
import ClickAwayListener, {
  type ClickAwayListenerProps,
} from "@mui/material/ClickAwayListener";
import Popper, { type PopperProps } from "@mui/material/Popper";
import type { Instance, OptionsGeneric, Placement } from "@popperjs/core";
import {
  createClasses,
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvPanel } from "../Panel";
import { getContainerElement } from "../utils/document";
import { getFirstAndLastFocus } from "../utils/focusableElementFinder";
import { isKey } from "../utils/keyboardUtils";
import type { HvBaseDropdownProps } from "./BaseDropdown";
import { usePopperModifiers } from "./utils";

const name = "HvDropdownPanel";
const { useClasses } = createClasses(name, {
  container: {
    zIndex: theme.zIndices.popover,
    width: "auto",
  },
  panel: {
    padding: theme.space.xs,
    border: `1px solid ${theme.colors.text}`,
  },
});

export interface HvDropdownPanelProps
  extends
    Omit<PopperProps, "children">,
    Pick<HvBaseDropdownProps, "disablePortal" | "children"> {
  variableWidth?: boolean;
  classes?: ExtractNames<typeof useClasses>;
  containerId?: string;
  onToggle?: (event: any) => void;
  onFirstUpdate?: OptionsGeneric<any>["onFirstUpdate"];
  onClickAway: ClickAwayListenerProps["onClickAway"];
}

export const HvDropdownPanel = (props: HvDropdownPanelProps) => {
  const {
    classes: classesProp,
    className,
    containerId,
    children,
    variableWidth = true,
    anchorEl,
    disablePortal,
    modifiers: modifiersProp,
    popperOptions: popperOptionsProp,
    onToggle,
    onClickAway,
    onFirstUpdate,
    ...others
  } = useDefaultProps(name, props);
  const { classes, cx } = useClasses(classesProp, false);
  const { rootId } = useTheme();
  const popperRef = useRef<Instance>(null);
  const [placement, setPlacement] = useState<Placement>();

  const modifiers = usePopperModifiers({
    variableWidth,
    modifiers: modifiersProp,
    onPlacementChange: setPlacement,
  });

  const popperOptions = useMemo(() => {
    // memo popperOptions to ensure `onFirstUpdate` isn't re-created
    return { ...popperOptionsProp, onFirstUpdate };
  }, [onFirstUpdate, popperOptionsProp]);

  /** Handle keyboard inside children container. */
  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (isKey(event, "Esc")) {
      onToggle?.(event);
    }
    if (isKey(event, "Tab") && !event.shiftKey) {
      const focusList = getFirstAndLastFocus(
        popperRef.current?.state?.elements.popper as HTMLElement,
      );
      if (document.activeElement === focusList?.last) {
        event.preventDefault();
        focusList?.first?.focus();
      }
    }
  };

  return (
    <Popper
      anchorEl={anchorEl}
      popperRef={popperRef}
      disablePortal={disablePortal}
      container={!disablePortal ? getContainerElement(rootId) : undefined}
      className={cx(classes.container, className)}
      modifiers={modifiers}
      onKeyDown={handleKeyDown}
      popperOptions={popperOptions}
      {...others}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <HvPanel
          id={containerId} // TODO(major): move `containerId` to role'd element
          className={classes.panel}
          data-popper-placement={placement}
        >
          {children}
        </HvPanel>
      </ClickAwayListener>
    </Popper>
  );
};
