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
export type HvRadius = "none" | "base" | "round" | "large" | "full";

/** @experimental */
export interface HvThemeRadii extends Record<HvRadius, string> {}

export const radii: HvThemeRadii = {
  none: "0px",
  base: "2px",
  round: "6px",
  large: "8px",
  full: "9999px",
};
