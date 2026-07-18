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
import { useHvMenuItems } from "@hitachivantara/app-shell-shared";

export const useHvCurrentNavigationPath = () => {
  const { items, selectedMenuItemId } = useHvMenuItems();
  return useMemo(() => {
    let currentItems = items;

    if (!selectedMenuItemId) {
      return [];
    }
    const paths: { label: string; path: string | undefined }[] = [];

    const selectedPathIds = selectedMenuItemId.split("-");
    selectedPathIds.forEach((item) => {
      const currentItem = currentItems[Number(item)];
      paths.push({
        label: currentItem.label,
        path: currentItem.data ? undefined : currentItem.href,
      });
      if (currentItem.data) {
        currentItems = currentItem.data;
      }
    });

    return paths;
  }, [items, selectedMenuItemId]);
};
