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
import { useEffect, useState } from "react";

export interface HvHeaderNavigationItemProp {
  id: string;
  label: string;
  path?: string;
  href?: string;
  target?: string;
  data?: HvHeaderNavigationItemProp[];
}

const getSelectionPath = (
  data: HvHeaderNavigationItemProp[] | undefined,
  selectedId: string | undefined,
  selection: string[] = [],
  idx = -1,
  parent: HvHeaderNavigationItemProp[] = [],
): string[] => {
  data?.forEach((item: HvHeaderNavigationItemProp, i) => {
    const hasData = item.data?.length;

    const isSelected = item.id === selectedId;

    if (isSelected)
      selection.push(...(idx > -1 ? [parent[idx].id] : []), item.id);

    if (hasData) getSelectionPath(item.data, selectedId, selection, i, data);
  });

  return selection;
};

export const useSelectionPath = (
  data: HvHeaderNavigationItemProp[],
  selectedId?: string,
): string[] => {
  const [selectionPath, setSelectionPath] = useState<string[]>([]);

  useEffect(() => {
    const path = getSelectionPath(data, selectedId);

    setSelectionPath(path);
  }, [data, selectedId]);

  return selectionPath;
};
