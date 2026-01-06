import type { HvAppShellMenuConfig } from "../types/Config";
import type { MenuItem } from "../types/menu";

/**
 * Compute the target href for menu item.
 *
 * @param menuItem The root target href.
 *
 * @returns The menu item target href. If empty, returns the first child that has it defined or empty string if none.
 */
const getMenuTargetHref = (menuItem: HvAppShellMenuConfig): string => {
  const { target } = menuItem;
  if (target) {
    return target;
  }

  if (menuItem.submenus) {
    return getMenuTargetHref(menuItem.submenus[0]);
  }

  return "";
};

/**
 * Adds a dot to the href to indicate that it is a relative path.
 */
const addPrefixToHref = (href: string): string => {
  return !href.startsWith(".") ? `.${href}` : href;
};

/**
 * Creates a navigation data structure ({@link MenuItem}) from the provided menu configuration ({@link HvAppShellMenuConfig}).
 *
 * Note: The menu configuration received here has already been filtered based on conditions.
 *
 * @param t Translation function
 * @param menuItems The set of menu items from configuration (already filtered)
 * @param maxDepth The maximum depth up until the recursiveness should occur for the creation of the menu items
 * @param parentMenuItem The parent menu item of the set of menu items
 *
 * @returns An array of {@link MenuItem}
 */
const createMenuItems = (
  t: (key: string) => string,
  menuItems?: HvAppShellMenuConfig[],
  maxDepth?: number,
  parentMenuItem?: MenuItem,
): MenuItem[] => {
  if (maxDepth !== undefined && maxDepth <= 0) {
    return [];
  }

  return (
    menuItems?.reduce<MenuItem[]>((accumulator, currentValue, index) => {
      const navItem: MenuItem = {
        id: parentMenuItem ? `${parentMenuItem.id}-${index}` : `${index}`,
        label: t(currentValue.label),
        href: addPrefixToHref(getMenuTargetHref(currentValue)),
        icon: currentValue.icon,
        parent: parentMenuItem,
      };

      if (currentValue.submenus) {
        const updatedDepth = maxDepth !== undefined ? maxDepth - 1 : undefined;
        const data = createMenuItems(
          t,
          currentValue.submenus,
          updatedDepth,
          navItem,
        );
        if (data.length > 0) {
          navItem.data = data;
        }
      }

      accumulator.push(navItem);
      return accumulator;
    }, []) ?? []
  );
};

/**
 * Removes the items that do not have path and replaces it by its children, recursively.
 *
 * @param items The list of {@link MenuItem}.
 *
 * @returns A flat array of {@link MenuItem}.
 */
const flatMenuItems = (items: MenuItem[]) => {
  return items.reduce<MenuItem[]>((acc, item) => {
    if (item.data) {
      acc.push(...flatMenuItems(item.data));
    } else {
      acc.push(item);
    }

    return acc;
  }, []);
};

/**
 * Helper function that uses a cumulative reduction to derive an array of cumulative hrefs based on the components
 * of the input string.
 * @example
 * // returns ['/', '/app', '/app/details', '/app/details/1']
 * // normalizedHref: "/app/details/1"
 *
 * @param normalizedHref The href string to be reduced.
 *
 * @returns the array of cumulative hrefs.
 */
const decomposeHrefStringToArray = (normalizedHref: string): string[] => {
  const hrefArray = normalizedHref
    .split("/")
    .reduce<string[]>((accumulator, currentValue) => {
      if (currentValue === "") {
        return accumulator;
      }

      const prefix = accumulator.length === 0 ? "" : accumulator[0];
      const href =
        currentValue === "." ? currentValue : `${prefix}/${currentValue}`;
      accumulator.unshift(href);
      return accumulator;
    }, []);

  hrefArray.push("./");

  return hrefArray;
};

/**
 * Algorithm implementation of the searchHrefInMenuItems function.
 *
 * @returns An object containing an item id or empty, if no match is found, and a flag to indicate if a
 * full href match was found. If the id is filled but the flag is 'false', then only partial match was found.
 */
const searchHrefMatch = (
  items: MenuItem[],
  normalizedHref: string,
  normalizedFullHref: string,
): string | undefined => {
  let toBeSelectedId: string | undefined;
  let toBeSelectedHref: string | undefined;

  const reducedNormalizedHref = decomposeHrefStringToArray(normalizedHref);

  flatMenuItems(items).some((item) => {
    let normalizedItemHref: string | undefined;
    let normalizedItemHrefParams: string | undefined;

    const idx = item.href?.indexOf("?");
    if (idx !== -1) {
      normalizedItemHref = item.href?.slice(0, idx).toLowerCase();
      normalizedItemHrefParams = item.href?.slice(idx).toLowerCase();
    } else {
      normalizedItemHref = item.href?.toLowerCase();
      normalizedItemHrefParams = "";
    }

    if (
      normalizedItemHref &&
      normalizedItemHref.length > 1 &&
      normalizedItemHref.endsWith("/")
    ) {
      normalizedItemHref = normalizedItemHref.slice(
        0,
        normalizedItemHref.length - 1,
      );
    }

    const normalizedFullItemHref = `${normalizedItemHref}${normalizedItemHrefParams}`;

    // if the normalized full href is met, then search is complete
    if (normalizedFullItemHref === normalizedFullHref) {
      toBeSelectedId = item.id;
      return true;
    }

    // since it is not a full href match, we want to keep searching for a full href match,
    // while storing only the first/longer partial match found
    const matchedHref = reducedNormalizedHref.find(
      (href: string) => normalizedItemHref === href,
    );
    if (
      matchedHref &&
      (!toBeSelectedHref || matchedHref.length > toBeSelectedHref?.length)
    ) {
      toBeSelectedId = item.id;
      toBeSelectedHref = matchedHref;
    }

    return false;
  });

  return toBeSelectedId;
};

/**
 * Searches for the href and parameters on all the menu items and its children until an exact match is found. If no
 * exact match is found but partial is, then the parent id for the first partial match found is returned.
 * @example
 * // returns '2'
 * // href: '/home', parameters: '?x=y', items: [{id:'1', href:'/home?z=v'},{id:'2', href:'/home'}
 *
 * For consistency purposes and based on the Router behavior, if either the href or the item href
 * (stripped of its query params) ends with a forward slash, then the comparison will ignore it
 * @example
 * // returns '1'
 * // href: '/home/', parameters: <empty>, items: [{id:'1', href:'/home'}]
 *
 * @param items The list of menu items to be searched.
 * @param href The url href after the domain up to the query parameters.
 * @param [parameters] The url query string after pathname.
 *
 * @returns The id of a parent menu item or an empty string.
 */
const searchHrefInMenuItems = (
  items: MenuItem[],
  href: string,
  parameters?: string,
): string | undefined => {
  if (!href) {
    return undefined;
  }

  const normalizedHref =
    href.length > 1 && href.endsWith("/")
      ? href.slice(0, href.length - 1).toLowerCase()
      : href.toLowerCase();

  const normalizedFullHref = parameters
    ? normalizedHref.concat(parameters.toLowerCase())
    : normalizedHref;

  return searchHrefMatch(items, normalizedHref, normalizedFullHref);
};

/**
 * Get root menu id from the path (in the format 0-0-0 - id's separated by `-`)
 * @param menuItemId
 * @returns the Id of the first menu or undefined if the provided value is undefined
 */
const getRootIdFromItemId = (
  menuItemId: string | undefined,
): string | undefined => {
  if (!menuItemId) {
    return undefined;
  }
  return menuItemId.split("-")[0];
};

/**
 * Searches for an item with the specified id.
 *
 * @param {MenuItem[]} data - The navigation data structure.
 * @param {string} itemId - The item id.
 * @returns The item with matching id.
 */
const findItemById = (data: MenuItem[], itemId: string): MenuItem | null => {
  let foundItem: MenuItem | null = null;
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

/**
 * Finds the first leaf item (item with children) inside the received structure.
 *
 * @param {MenuItem[]} data - The navigation data structure.
 * @returns - The first leaf item inside the structure.
 */
const findFirstLeafItem = (data: MenuItem[]): MenuItem | null => {
  let foundItem: MenuItem | null = null;
  data.some((obj) => {
    if (!obj.data || obj.data.length === 0) {
      foundItem = obj;
      return true;
    }
    foundItem = findFirstLeafItem(obj.data);
    return foundItem !== null;
  });
  return foundItem;
};

export {
  createMenuItems,
  searchHrefInMenuItems,
  getRootIdFromItemId,
  addPrefixToHref,
  findItemById,
  findFirstLeafItem,
};
