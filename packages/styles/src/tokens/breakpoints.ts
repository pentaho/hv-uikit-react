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
export type HvBreakpoints = "xs" | "sm" | "md" | "lg" | "xl";

/** @experimental extendable theme breakpoints */
export interface HvThemeBreakpoints {
  unit: string;
  step: number;
  values: Record<HvBreakpoints, number>;
}

export const breakpoints = {
  unit: "px",
  step: 5,
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1270,
    xl: 1920,
  },
} satisfies HvThemeBreakpoints;
