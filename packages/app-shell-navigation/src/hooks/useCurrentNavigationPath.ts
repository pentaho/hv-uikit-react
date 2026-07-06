import { useMemo } from "react";
import { useHvMenuItems } from "@hitachivantara/app-shell-shared";

export const useHvCurrentNavigationPath = () => {
  const { items, selectedMenuItemId } = useHvMenuItems();
  return useMemo(() => {
    if (!selectedMenuItemId) {
      return [];
    }

    let currentItems = items;
    const selectedPathIds = selectedMenuItemId.split("-");
    if (selectedPathIds.length < 2) {
      return [];
    }

    const paths: { label: string; path: string | undefined }[] = [];

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
