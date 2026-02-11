import { useMemo, useRef, useState } from "react";
import ClickAwayListener, {
  ClickAwayListenerProps,
} from "@mui/material/ClickAwayListener";
import Popper, { PopperProps } from "@mui/material/Popper";
import {
  detectOverflow,
  type Instance,
  type Options,
  type OptionsGeneric,
  type Placement,
} from "@popperjs/core";
import {
  createClasses,
  ExtractNames,
  useDefaultProps,
  useTheme,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvPanel } from "../Panel";
import { getContainerElement } from "../utils/document";
import { getFirstAndLastFocus } from "../utils/focusableElementFinder";
import { isKey } from "../utils/keyboardUtils";
import type { HvBaseDropdownProps } from "./BaseDropdown";

const name = "HvBaseDropdownPopper";
const { useClasses } = createClasses(name, {
  container: {
    zIndex: theme.zIndices.popover,
    width: "auto",
  },
  panel: {
    padding: 0, // TODO(major): remove padding as most elements need it
    border: `1px solid ${theme.colors.text}`,
  },
});

export interface HvBaseDropdownPopperProps
  extends Omit<PopperProps, "children">,
    Pick<HvBaseDropdownProps, "disablePortal" | "onClickOutside" | "children"> {
  variableWidth?: boolean;
  classes?: ExtractNames<typeof useClasses>;
  containerId?: string;
  onToggle?: (event: any) => void;
  onFirstUpdate?: OptionsGeneric<any>["onFirstUpdate"];
  onClickAway: ClickAwayListenerProps["onClickAway"];
}

export const HvBaseDropdownPopper = (props: HvBaseDropdownPopperProps) => {
  const {
    classes: classesProp,
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
      popperOptions={{
        onFirstUpdate,
        ...popperOptions,
      }}
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

interface UsePopperModifiers
  extends Pick<HvBaseDropdownPopperProps, "variableWidth" | "modifiers"> {
  onPlacementChange?: (placement: Placement) => void;
}

function usePopperModifiers({
  variableWidth,
  modifiers,
  onPlacementChange,
}: UsePopperModifiers) {
  return useMemo<Options["modifiers"]>(
    () => [
      {
        enabled: true,
        phase: "main",
        fn: ({ state }) => {
          onPlacementChange?.(state.placement);
        },
      },
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
    [modifiers, variableWidth, onPlacementChange],
  );
}
