import { MenuItem } from "@hitachivantara/app-shell-shared";

import { MenuIcon } from "../components/MenuIcon";
import { NavigationMenuItem } from "../types";

/**
 * Creates a navigation data structure ({@link MenuItem}) from the provided menu configuration ({@link NavigationMenuItem}).
 *
 * @param t
 * @param menuItems The set of menu items from configuration.
 * @param maxDepth The maximum depth up until the recursiveness should occur for the creation of the menu items.
 *
 * @returns An array of {@link MenuItem}.
 */
const createNavigationMenuItems = (
  // eslint-disable-next-line only-used-in-recursion
  t: (key: string) => string,
  menuItems?: MenuItem[],
  maxDepth?: number,
): NavigationMenuItem[] => {
  if (maxDepth !== undefined && maxDepth <= 0) {
    return [];
  }

  return (
    menuItems?.reduce<NavigationMenuItem[]>((accumulator, currentValue) => {
      const updatedDepth = maxDepth !== undefined ? maxDepth - 1 : undefined;
      const navItem: NavigationMenuItem = {
        ...currentValue,
        icon: currentValue.icon && <MenuIcon icon={currentValue.icon} />,
        data: currentValue.data
          ? createNavigationMenuItems(t, currentValue.data, updatedDepth)
          : undefined,
      };
      accumulator.push(navItem);
      return accumulator;
    }, []) ?? []
  );
};

/**
 * Searches for an item with the specified id.
 *
 * @param {NavigationMenuItem[]} data - The navigation data structure.
 * @param {string} itemId - The item id.
 * @returns The item with matching id.
 */
const findItemById = (
  data: NavigationMenuItem[],
  itemId: string,
): NavigationMenuItem | null => {
  let foundItem: NavigationMenuItem | null = null;
  data.some((obj) => {
    const { id: objId, data: childData } = obj;
    if (objId === itemId) {
      foundItem = obj;
      return true;
    }
    if (childData && childData.length > 0) {
      foundItem = findItemById(childData, itemId);
      return foundItem !== null;
    }
    return false;
  });
  return foundItem;
};

//
const getAppIdFromBundle = (bundle: string): string => {
  const bundleTokens = bundle.split("/");
  let appId: string;

  if (bundleTokens[0].startsWith("@")) {
    appId = `${bundleTokens[0]}/${bundleTokens[1]}`;
  } else {
    [appId] = bundleTokens;
  }

  return appId;
};

/**
 * Recursively removes the href property from items in the array if they have a non-empty data property.
 *
 * @param items - The array of items.
 * @returns The new array with the href property removed from items with children.
 */
const removeHrefFromMenuItemsWithChildren = (
  items: NavigationMenuItem[],
): NavigationMenuItem[] => {
  return items.map((item: NavigationMenuItem) => {
    const { href, data, ...rest } = item;
    if (data && data.length > 0) {
      return { ...rest, data: removeHrefFromMenuItemsWithChildren(data) };
    }
    return item;
  });
};

export {
  createNavigationMenuItems,
  findItemById,
  removeHrefFromMenuItemsWithChildren,
  getAppIdFromBundle,
};
