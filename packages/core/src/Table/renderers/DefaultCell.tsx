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
import type { HvCellProps } from "../hooks/useHvTable";

const EM_DASH = "—";

/** Default cell renderer for `Table`. */
export const DefaultCell = <T extends object>({
  row,
  value,
}: HvCellProps<T, any>) => {
  switch (true) {
    case row.subRows.length > 0:
      // do nothing if row has sub-rows
      return value;
    case value instanceof Date:
      // render date in ISO format
      return value.toISOString().slice(0, 10);
    case typeof value === "object":
      // render objects as-is
      return value;
    case value == null || value === "":
      // render EM_DASH for empty values
      return EM_DASH;
    default:
      // stringify boolean/bigint/number/etc.
      return String(value);
  }
};
