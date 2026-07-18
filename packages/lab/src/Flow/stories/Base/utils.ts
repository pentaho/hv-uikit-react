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
import type { LayoutConfig } from "./LayoutsContext";

export const buildLayout = (
  items?: LayoutConfig["items"],
  layout?: LayoutConfig["layout"],
  cols = 12,
) => {
  const itemsToPosition = items?.filter(
    (i) => !layout?.find((x) => x.i === i.id),
  );

  return itemsToPosition?.reduce((acc, item, idx) => {
    const w = 4;
    const h = 1;
    const perRow = cols / w;
    let x = (idx * w) % cols;
    let y = Math.floor(idx / perRow) * h;

    const maxY = acc ? Math.max(...acc.map((i) => i.y)) : undefined;
    const maxX =
      maxY != null && acc
        ? Math.max(...acc.filter((i) => i.y === maxY).map((i) => i.x))
        : undefined;
    const lastItem = acc?.find((i) => i.x === maxX && i.y === maxY);
    const newLine = lastItem ? cols - (lastItem.x + lastItem.w) < w : undefined;

    if (newLine != null && lastItem) {
      if (newLine) {
        x = 0;
        y = lastItem.y + h;
      } else {
        x = lastItem.x + lastItem.w;
        y = lastItem.y;
      }
    }

    acc.push({
      i: item.id,
      w,
      h,
      x,
      y,
    });

    return acc;
  }, layout || []);
};
