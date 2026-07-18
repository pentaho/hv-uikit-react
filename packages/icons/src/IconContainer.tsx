/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { forwardRef } from "react";
import styled from "@emotion/styled";
import {
  getColor,
  type HvColorAny,
  type HvSize,
} from "@hitachivantara/uikit-styles";

import type { IconSize } from "./IconBase";
import { getSizeStyles } from "./utils";

function getRotation(rotation?: HvIconContainerProps["rotate"]) {
  switch (rotation) {
    case "up":
      return "-90deg";
    case "down":
      return "90deg";
    case true:
      return "180deg";
    case false:
    default:
      return undefined;
  }
}

const StyledIconContainer = styled("div")({
  display: "flex",
  flex: "0 0 auto", // ensure icon doesn't flex grow/shrink
  fontSize: 16,
  // box has a default icon container size of 32px (`xs` & `sm`)
  width: "var(--icsize, 32px)",
  height: "var(--icsize, 32px)",
  transition: "rotate 0.2s ease",
  justifyContent: "center",
  alignItems: "center",
});

export interface HvIconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * A color to override the default icon colors.
   * Accepts any valid CSS color or color from the UI Kit palette.
   * @example "primary"
   */
  color?: HvColorAny;
  /**
   * The size of the icon container. Takes in a `number` in pixels or any `HvSize` or `IconSize`.
   *
   * This will also affect the size of the icon by changing the `font-size`.
   *
   * @example
   * size={16} // 32px container 16px svg
   * size="S" // 32px container 16px svg
   * size="sm" // 32px container 16px svg
   * size="md" // 48px container 32px svg
   *
   * @default "S"
   */
  size?: HvSize | IconSize | number;
  /** Whether to rotate the icon @private WIP */
  rotate?: boolean | "up" | "down";
}

/**
 * A component used to contain icons in the established margins.
 *
 * This allows using external icons UI Kit components that expect padding around the icon.
 * It also makes the use of theme colors easier through the `color` prop.
 *
 * @example
 * <HvIconContainer color="warning" size="lg">
 *  <svg />
 * </HvIconContainer>
 */
export const HvIconContainer = forwardRef<
  // no-indent
  HTMLDivElement,
  HvIconContainerProps
>(function HvIconContainer(props, ref) {
  const { size, style, color, rotate, children, ...others } = props;
  return (
    <StyledIconContainer
      ref={ref}
      style={{
        ...getSizeStyles("", size),
        color: getColor(color),
        rotate: getRotation(rotate),
        ...style,
      }}
      {...others}
    >
      {children}
    </StyledIconContainer>
  );
});
