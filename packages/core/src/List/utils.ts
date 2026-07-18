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
import type { HvListValue } from "./types";

const isItemSelected = (item: HvListValue, newItem: HvListValue) => {
  const selectionKey = item?.id ? "id" : "label";
  const selectionElement = item?.[selectionKey];
  return newItem[selectionKey] === selectionElement;
};

const checkIcons = (list: any[]) => list?.some((elem) => elem?.icon);

const parseState = (list = []) => {
  const hasLeftIcons = checkIcons(list);
  const selection = list.filter((elem: any) => elem?.selected);
  const anySelected = !!selection.length;
  const allSelected = selection.length === list.length;
  const anySelectableSelected = list.some(
    (elem: any) => elem?.selected || elem?.disabled,
  );
  const allSelectableSelected = list.every(
    (elem: any) => elem?.selected || elem?.disabled,
  );

  return {
    list,
    hasLeftIcons,
    anySelected,
    allSelected,
    anySelectableSelected,
    allSelectableSelected,
    selection,
  };
};

const parseList = (
  item: HvListValue | undefined,
  props: {
    multiSelect?: boolean;
    selectable?: boolean;
    singleSelectionToggle?: boolean;
  },
  selectAll: boolean | undefined,
  list: HvListValue[] = [],
): HvListValue[] => {
  const { multiSelect, selectable, singleSelectionToggle } = props || {};

  let anySelected = false;
  const newList = list.map((elem: any) => {
    const newItem = { ...elem };

    // reset elem item
    if (!multiSelect) {
      newItem.selected = false;
    }

    const selectItem = item ? isItemSelected(item, newItem) : elem?.selected;

    if (selectItem && selectable) {
      let selectionState;

      if (multiSelect) {
        selectionState = item ? !elem?.selected : true;
      } else {
        selectionState =
          !anySelected &&
          (item && singleSelectionToggle ? !elem?.selected : true);
      }

      newItem.selected = selectionState;
      anySelected = true;
    }

    if (typeof selectAll === "boolean" && !elem?.disabled)
      newItem.selected = selectAll;

    // normalize item selected prop if not provided
    if (!newItem?.selected) newItem.selected = false;

    return newItem;
  });

  return newList;
};

export { isItemSelected, parseList, parseState };
