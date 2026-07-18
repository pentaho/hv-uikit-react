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
import type ColumnTable from "arquero/dist/types/table/column-table";

/** Empty cell mode */
export const emptyCellMode = ["connect", "void"] as const;
export type HvChartEmptyCellMode = (typeof emptyCellMode)[number];

/** Chart data */
export type HvChartData =
  | Map<string | number, (string | number)[]>
  | Record<string | number, (string | number)[]>
  | Record<string | number, string | number>[]
  | ColumnTable;
