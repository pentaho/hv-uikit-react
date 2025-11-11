import { useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellRuntimeContext,
  useHvAppShellModel,
  useHvMenuItems,
} from "@hitachivantara/app-shell-shared";

import { MenuItemsContext } from "../types";
import { createNavigationMenuItems } from "../utils/navigationUtil";

const MAX_TOP_MENU_DEPTH = 2;

const useNavigationMenuItems = (): MenuItemsContext => {
  // use the i18n instance from the app shell runtime context to ensure we're using
  // the app shell instance of i18n and not the one from the embedded app
  const { pathname } = useLocation();
  const { navigationMode } = useHvAppShellModel();
  const { navigate } = useHvNavigation();
  const { i18n } = useContext(HvAppShellRuntimeContext) ?? {};
  const tConfig = useMemo(
    () =>
      i18n?.getFixedT(i18n.language, CONFIG_TRANSLATIONS_NAMESPACE) ??
      // should not happen, but fallback if the i18n instance is not available
      ((l: string) => l),
    [i18n],
  );

  const { items, selectedMenuItemId, rootMenuItemId } = useHvMenuItems();
  const navigationMenuItemsTmp = createNavigationMenuItems(
    tConfig,
    items,
    navigationMode === "ONLY_TOP" ? MAX_TOP_MENU_DEPTH : undefined,
  );
  useEffect(() => {
    // First render (or a refresh) without written user url, then navigate to the first menu item
    if (!selectedMenuItemId && pathname === "/" && items[0]?.href) {
      navigate(items[0].href);
    }
  }, [pathname, items, navigate, selectedMenuItemId]);
  return {
    items: navigationMenuItemsTmp,
    selectedMenuItemId,
    rootMenuItemId,
  };
};

export default useNavigationMenuItems;
