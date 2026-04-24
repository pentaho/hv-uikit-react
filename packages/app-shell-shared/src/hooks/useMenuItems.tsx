import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { useHvAppShellModel } from "../AppShellModelContext";
import { useHvAppShellRuntimeContext } from "../AppShellRuntimeContext";
import { CONFIG_TRANSLATIONS_NAMESPACE, useHvAppShellI18n } from "../i18n";
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

  // Register for any language changes.
  useHvAppShellI18n();

  // Get the internal i18next instance
  const { i18n } = useHvAppShellRuntimeContext();

  // Extracted so the linter recognizes it as an independent reactive dependency
  // (i18n is a stable reference; resolvedLanguage is what actually changes).
  const resolvedLanguage = i18n.resolvedLanguage;

  const tConfig = useMemo(
    () =>
      i18n.getFixedT(resolvedLanguage ?? null, CONFIG_TRANSLATIONS_NAMESPACE),
    [i18n, resolvedLanguage],
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
