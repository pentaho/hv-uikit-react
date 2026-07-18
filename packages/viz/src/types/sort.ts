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
/** Order functions */
export type HvChartOrder = "asc" | "desc";

type FullSortBy = {
  /** Column name. */
  field: string;
  /** Order function to use. If no `order` is defined, it will default to `asc`. */
  order?: HvChartOrder;
};

export type HvChartSortBy = string | FullSortBy;
