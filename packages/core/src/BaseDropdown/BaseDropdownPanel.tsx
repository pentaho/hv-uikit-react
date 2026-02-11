import { useMemo, useRef } from "react";
import ClickAwayListener, {
  ClickAwayListenerProps,
} from "@mui/material/ClickAwayListener";
import Popper, { PopperProps } from "@mui/material/Popper";
import { detectOverflow, type Instance, type Options } from "@popperjs/core";
import { useCss, useTheme } from "@hitachivantara/uikit-react-utils";

import { HvPanel } from "../Panel";
import { getContainerElement } from "../utils/document";
import { getFirstAndLastFocus } from "../utils/focusableElementFinder";
import { isKey } from "../utils/keyboardUtils";
import type {
  HvBaseDropdownClasses,
  HvBaseDropdownProps,
} from "./BaseDropdown";
import { BaseDropdownContext } from "./context";

export interface HvBaseDropdownPopperProps
  extends Omit<PopperProps, "children">,
    Pick<
      HvBaseDropdownProps,
      "disablePortal" | "onClickOutside" | "onContainerCreation" | "children"
    > {
  variableWidth?: boolean;
  classes: Required<HvBaseDropdownClasses>;
  containerId?: string;
  onToggle: (event: any) => void;
  onClickAway: ClickAwayListenerProps["onClickAway"];
}

export const HvBaseDropdownPopper = ({
  classes,
  className,
  containerId,
  children,
  variableWidth,
  anchorEl,
  disablePortal,
  modifiers: modifiersProp,
  popperOptions,
  onToggle,
  onClickAway,
  onContainerCreation,
  ...others
}: HvBaseDropdownPopperProps) => {
  const { cx } = useCss();
  const { rootId } = useTheme();
  const popperRef = useRef<Instance>(null);

  const modifiers = usePopperModifiers({
    variableWidth,
    modifiers: modifiersProp,
  });

  /** Handle keyboard inside children container. */
  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (isKey(event, "Esc")) {
      onToggle(event);
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
    <ClickAwayListener onClickAway={onClickAway}>
      <Popper
        anchorEl={anchorEl}
        popperRef={popperRef}
        disablePortal={disablePortal}
        container={!disablePortal ? getContainerElement(rootId) : undefined}
        className={cx(classes.container, className)}
        onKeyDown={handleKeyDown}
        modifiers={modifiers}
        popperOptions={{
          onFirstUpdate: ({ elements }) => {
            onContainerCreation?.(elements?.popper ?? null);
          },
          ...popperOptions,
        }}
        {...others}
      >
        <HvPanel
          // TODO: review in v6. `containerId` needs to be on the role element (`children` has it)
          id={containerId}
          data-popper-placement={popperRef.current?.state?.placement}
          className={classes.panel}
        >
          <BaseDropdownContext.Provider value={{ popper: popperRef.current }}>
            {children}
          </BaseDropdownContext.Provider>
        </HvPanel>
      </Popper>
    </ClickAwayListener>
  );
};

function usePopperModifiers({
  variableWidth,
  modifiers,
}: Pick<HvBaseDropdownPopperProps, "variableWidth" | "modifiers">) {
  return useMemo<Options["modifiers"]>(
    () => [
      {
        name: "variableWidth",
        enabled: !variableWidth,
        phase: "beforeWrite",
        requires: ["computeStyles"],
        fn: ({ state }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
        },
        effect: ({ state }) => {
          state.elements.popper.style.width = `${
            (state.elements.reference as HTMLElement).offsetWidth
          }px`;
        },
      },
      {
        name: "maxSize",
        enabled: true,
        phase: "main",
        requiresIfExists: ["offset", "preventOverflow", "flip"],
        fn: ({ state, name, options }) => {
          const overflow = detectOverflow(state, options);

          const x = state.modifiersData.preventOverflow?.x || 0;
          const y = state.modifiersData.preventOverflow?.y || 0;

          const popperWidth = state.rects.popper.width;
          const popperHeight = state.rects.popper.height;

          const basePlacement = state.placement.split("-")[0];

          const widthProp = basePlacement === "left" ? "left" : "right";
          const heightProp = basePlacement === "top" ? "top" : "bottom";

          state.modifiersData[name] = {
            width: popperWidth - overflow[widthProp] - x,
            height: popperHeight - overflow[heightProp] - y,
          };
        },
      },
      {
        name: "applyMaxSize",
        enabled: true,
        phase: "beforeWrite",
        requires: ["maxSize"],
        fn: ({ state }) => {
          // The `maxSize` modifier provides this data
          const { width, height } = state.modifiersData.maxSize;
          state.styles.popper.maxWidth = `${width}px`;
          state.styles.popper.maxHeight = `${height}px`;
        },
      },
      ...(modifiers || []),
    ],
    [modifiers, variableWidth],
  );
}
