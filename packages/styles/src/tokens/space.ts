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
export type HvSpace = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export type HvSize = "xs" | "sm" | "md" | "lg" | "xl";

/** @experimental extendable theme spacing units */
export interface HvThemeSpace extends Record<HvSpace, string> {
  base: number;
}

export const space: HvThemeSpace = {
  base: 8,
  xxs: "4px",
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "48px",
  xl: "80px",
};
