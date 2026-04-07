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
