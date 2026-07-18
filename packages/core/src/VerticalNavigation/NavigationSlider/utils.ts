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
/**
 * Recursively searches in a collection the first element where the property matches the specified value.
 *
 * @param collection - Collection where the search will be performed
 * @param childrenPropName - The children property name where the recursive search will be performed
 * @param propName - The name of the property to be used on the search
 * @param propValue - The value of the property to be used on the search
 * @returns The element that matches the requirement or null if none is found
 */
const searchInCollection = (
  collection: any,
  childrenPropName: any,
  propName: any,
  propValue: any,
): any => {
  if (collection[propName] === propValue) {
    return collection;
  }

  const items = collection[childrenPropName] || collection;

  let foundItem = null;
  for (let index = 0; foundItem === null && index < items.length; index += 1) {
    foundItem = searchInCollection(
      items[index],
      childrenPropName,
      propName,
      propValue,
    );
  }
  return foundItem;
};

/**
 * Returns the navigation item with the specified id.
 *
 * @param navigationItems - The collection of navigation items.
 * @param navigationItemId - The id to be used on the search
 * @returns The navigation item with the specified id.
 */
const getNavigationItemById = (navigationItems: any, navigationItemId: any) => {
  return searchInCollection(navigationItems, "data", "id", navigationItemId);
};

/**
 * Returns the parent item for the received item id.
 *
 * @param navigationItems - The collection of navigation items.
 * @param navigationItemId - The id to be used on the search
 * @returns The parent navigation item.
 */
const getParentItemById = (navigationItems: any, navigationItemId: any) => {
  const parentId = getNavigationItemById(
    navigationItems,
    navigationItemId,
  )?.parent;
  return getNavigationItemById(navigationItems, parentId);
};

/**
 * Fills the data structure with the parent id on each one of the nodes.
 *
 * @param navigationItems - The collection of navigation items.
 * @param parentItemId - The parent id to be added.
 * @returns The structure now filled with the parent id.
 */
const fillDataWithParentId = (navigationItems: any, parentItemId?: any) => {
  return navigationItems.map((item: any) => {
    if (item?.data?.length > 0) {
      return {
        ...item,
        parent: parentItemId,
        data: fillDataWithParentId(item.data, item.id),
      };
    }
    return { ...item, parent: parentItemId };
  });
};

export { getNavigationItemById, getParentItemById, fillDataWithParentId };
