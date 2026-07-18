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
export interface DateRangeProp {
  startDate: Date;
  endDate?: Date;
}

export type VisibilitySelectorActions =
  | "previous_month"
  | "next_month"
  | "previous_year"
  | "next_year"
  | "month"
  | "month_year";
