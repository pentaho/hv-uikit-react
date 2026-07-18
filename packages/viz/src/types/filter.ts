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
export type HvChartFilterOperation =
  | "is"
  | "isNot"
  | "contains"
  | "notContains"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "between"
  | "ends"
  | "notEnds"
  | "starts"
  | "notStarts";

export type HvChartFilter = {
  field: string;
  operation: HvChartFilterOperation;
  value: string | string[] | number | number[];
};
