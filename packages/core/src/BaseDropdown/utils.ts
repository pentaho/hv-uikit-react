import { useMemo } from "react";
import type { PopperProps } from "@mui/material/Popper";
import { detectOverflow, type Options, type Placement } from "@popperjs/core";

export interface UsePopperModifiers extends Pick<PopperProps, "modifiers"> {
  variableWidth?: boolean;
  onPlacementChange?: (placement: Placement) => void;
}

export function usePopperModifiers({
  variableWidth,
  modifiers,
  onPlacementChange,
}: UsePopperModifiers) {
  return useMemo<Options["modifiers"]>(
    () => [
      {
        name: "placementListener",
        enabled: true,
        phase: "main",
        fn: ({ state }) => onPlacementChange?.(state.placement),
      },
      {
        name: "fixedWidth",
        enabled: !variableWidth,
        phase: "beforeWrite",
        requires: ["computeStyles"],
        fn: ({ state }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
        },
        effect: ({ state }) => {
          const { popper, reference } = state.elements;
          popper.style.width = `${(reference as HTMLElement).offsetWidth}px`;
        },
      },
      {
        name: "minSize",
        enabled: true,
        phase: "main",
        fn: ({ state }) => {
          state.styles.popper.minWidth = `${state.rects.reference.width}px`;
        },
        effect: ({ state }) => {
          const { popper, reference } = state.elements;
          popper.style.minWidth = `${(reference as HTMLElement).offsetWidth}px`;
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
