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
import { useMemo } from "react";

import { HvOverflowTooltip } from "../../OverflowTooltip";

export interface HvDateColumnCellProp {
  /** Date to render. */
  date?: string;
}

const formatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "medium",
});

export const HvDateColumnCell = ({ date }: HvDateColumnCellProp) => {
  const formattedDate = useMemo(() => {
    return date ? formatter.format(new Date(date)) : "—";
  }, [date]);

  return <HvOverflowTooltip data={formattedDate} />;
};
