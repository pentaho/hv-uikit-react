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
export type HvFilterGroupFilters = {
  id: string;
  name: string;
  data: {
    id: string | number;
    name: string;
    disabled?: boolean;
  }[];
}[];

export type HvFilterGroupValue = (string | number)[][];

export type HvFilterGroupHorizontalPlacement = "left" | "right";
