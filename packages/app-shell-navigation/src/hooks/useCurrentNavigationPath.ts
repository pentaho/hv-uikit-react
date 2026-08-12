import { useMemo } from "react";
import { useHvMenuItems } from "@pentaho/app-shell-shared";

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
