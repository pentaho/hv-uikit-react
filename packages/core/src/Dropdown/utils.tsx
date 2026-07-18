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
import type { HvListValue } from "../List";
import type { HvDropdownLabels } from "./Dropdown";

/** Filter selected elements. */
export const getSelected = (list: HvListValue[] = []) =>
  list.filter((elem) => elem.selected);

/** Gets the selection label according to selection. */
export const getSelectionLabel = (
  labels: HvDropdownLabels | undefined,
  placeholder: string,
  multiSelect: boolean,
  list: HvListValue[] = [],
) => {
  const { select } = labels || {};
  const selected = getSelected(list);

  if (select) return { selected: select };

  if (multiSelect) {
    return {
      selected: selected.length,
      total: list.length,
    };
  }
  return { selected: selected.length > 0 ? selected[0].label : placeholder };
};
