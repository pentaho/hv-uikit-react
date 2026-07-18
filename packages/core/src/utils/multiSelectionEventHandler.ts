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
const cycleThroughSelection = (
  selectedState: boolean[],
  index: number,
  allValues: any[],
  selectionCheck: any,
) => {
  const newValue: any[] = [];
  selectedState.forEach((isSelected, i) => {
    if (i === index) {
      if (selectionCheck || !isSelected) {
        newValue.push(allValues[i]);
      }
    } else if (isSelected) {
      newValue.push(allValues[i]);
    }
  });

  return newValue;
};

export const multiSelectionEventHandler = (
  evt: any,
  index: number,
  selectionAnchor: any,
  allValues: any[],
  selectedState: boolean[],
  selectionCheck: any,
) => {
  let newValue: any[] = [];

  if (evt.nativeEvent.shiftKey) {
    if (selectionAnchor.current === undefined) {
      selectionAnchor.current = index;
      newValue.push(allValues[index]);
    } else {
      let selectionStart;
      let selectionEnd;
      if (selectionAnchor.current > index) {
        selectionStart = index;
        selectionEnd = selectionAnchor.current + 1;
      } else {
        selectionStart = selectionAnchor.current;
        selectionEnd = index + 1;
      }

      const selectedValues = allValues.slice(selectionStart, selectionEnd);

      newValue.push(...selectedValues);
    }
  } else if (evt.nativeEvent.metaKey) {
    selectionAnchor.current = index;

    newValue = cycleThroughSelection(
      selectedState,
      index,
      allValues,
      selectionCheck,
    );
  } else {
    selectionAnchor.current = index;

    newValue = cycleThroughSelection(
      selectedState,
      index,
      allValues,
      selectionCheck,
    );
  }

  return newValue;
};
