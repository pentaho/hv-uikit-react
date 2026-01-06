import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { useHvAppShellModel } from "../AppShellModelContext";
import { HvAppShellRuntimeContext } from "../AppShellRuntimeContext";
import { CONFIG_TRANSLATIONS_NAMESPACE } from "../i18n";
import type { MenuItemsContext } from "../types/menu";
import {
  addPrefixToHref,
  createMenuItems,
  findFirstLeafItem,
  findItemById,
  getRootIdFromItemId,
  searchHrefInMenuItems,
} from "../utils/navigationUtils";

const MAX_TOP_MENU_DEPTH = 2;

export const useHvMenuItems = (): MenuItemsContext => {
  const { pathname, search, state: locationState } = useLocation();
  const { navigationMode, menu } = useHvAppShellModel();

  // use the i18n instance from the app shell runtime context to ensure we're using
  // the app shell instance of i18n and not the one from the embedded app
  const { i18n } = useContext(HvAppShellRuntimeContext) ?? {};
  const tConfig = useMemo(
    () =>
      i18n?.getFixedT(i18n.language, CONFIG_TRANSLATIONS_NAMESPACE) ??
      // should not happen, but fallback if the i18n instance is not available
      ((l: string) => l),
    [i18n],
  );

  const items = useMemo(() => {
    const menuItemsDepth =
      navigationMode === "ONLY_TOP" ? MAX_TOP_MENU_DEPTH : undefined;

    return createMenuItems(tConfig, menu, menuItemsDepth);
  }, [navigationMode, menu, tConfig]);

  const [selectedMenuItemId, setSelectedMenuItemId] = useState<
    string | undefined
  >(searchHrefInMenuItems(items, addPrefixToHref(pathname), search));

  const [rootMenuItemId, setRootMenuItemId] = useState<string | undefined>(
    getRootIdFromItemId(selectedMenuItemId),
  );

  useEffect(() => {
    // no menu items, nothing to select
    if (!items.length) {
      return;
    }
    // state property is used when we already know which menu is to be selected
    if (locationState?.selectedItemId) {
      setRootMenuItemId(getRootIdFromItemId(locationState.selectedItemId));
      // If the selected item has children we want to select the first child instead
      const selectedItem = findItemById(items, locationState.selectedItemId);
      if (selectedItem?.data?.length) {
        const firstItemToSelect = findFirstLeafItem(selectedItem.data);
        setSelectedMenuItemId(firstItemToSelect?.id);
      } else {
        setSelectedMenuItemId(selectedItem?.id);
      }
      return;
    }
    const toBeSelected = searchHrefInMenuItems(
      items,
      addPrefixToHref(pathname),
      search,
    );
    if (toBeSelected) {
      setRootMenuItemId(getRootIdFromItemId(toBeSelected));
      setSelectedMenuItemId(toBeSelected);
      return;
    }
    // if none of the previous scenarios, then nothing is marked as selected
    setRootMenuItemId(undefined);
    setSelectedMenuItemId(undefined);
  }, [items, locationState, pathname, search]);
  return {
    items,
    selectedMenuItemId,
    rootMenuItemId,
  };
};
