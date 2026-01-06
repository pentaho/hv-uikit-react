import { useEffect, useMemo, useState } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvActionBar } from "../../ActionBar";
import { useBaseDropdownContext } from "../../BaseDropdown/context";
import { HvButton } from "../../Button";
import { HvCheckBox } from "../../CheckBox";
import { HvInput } from "../../Input";
import { HvList, HvListProps, HvListValue } from "../../List";
import { CounterLabel } from "../../utils/CounterLabel";
import type { HvDropdownLabels } from "../Dropdown";
import { getSelected } from "../utils";
import { staticClasses, useClasses } from "./List.styles";

export { staticClasses as dropdownListClasses };

export type HvDropdownListClasses = ExtractNames<typeof useClasses>;

export interface HvDropdownListProps {
  /**
   * Id to be applied to the root node.
   */
  id?: string;
  /**
   * A Jss Object used to override or extend the component styles.
   */
  classes?: HvDropdownListClasses;
  /**
   * The list to be rendered.
   */
  values?: HvListValue[];
  /**
   * If true renders a multi select list.
   */
  multiSelect?: boolean;
  /**
   * If true renders the search component.
   */
  showSearch?: boolean;
  /**
   * A function to be executed whenever a item is selected in the list
   * or the Apply button is activated (when `multiSelect` is `true`).
   */
  onChange: (
    /** An array containing the selected values */
    listValues: HvListValue[],
    /** If `true` the selection if finally committed the dropdown header text should reflect the new selection */
    commitChanges: boolean,
    /** If `true` the dropdown should toggle it's current state */
    toggle: boolean,
    /** If `true` the dropdown will call onChange */
    notifyChanges: boolean,
  ) => void;
  /**
   * A function to be executed whenever the Cancel button is activated.
   */
  onCancel: (event: React.MouseEvent) => void;
  /**
   * An object containing all the labels for the dropdown.
   */
  labels?: HvDropdownLabels;
  /**
   * If 'true' the dropdown will notify on the first render.
   */
  notifyChangesOnFirstRender?: boolean;
  /**
   * If `true`, selection can be toggled when single selection.
   */
  singleSelectionToggle?: boolean;
  /**
   * Experimental. Height of the dropdown, in case you want to control it from a prop. Styles can also be used through dropdownListContainer class. Required in case virtualized is used
   */
  height?: number;
  /**
   * Experimental. Max height of the dropdown, in case you want to control it from a prop. Styles can also be used through dropdownListContainer class.
   */
  maxHeight?: number;
  /**
   * Experimental. Uses dropdown in a virtualized form, where not all options are rendered initially. Good for use cases with a lot of options.
   */
  virtualized?: boolean;
}

/**
 * The values property was being deeply cloned. That created a significant performance
 * hit when the values contained complex properties' values, like React Nodes.
 *
 * For minimizing the impact of removing the clone, a shallow clone of the array and its
 * objects is performed instead. That should have the same effect in the majority of the
 * cases, where the properties' values are primitive.
 */
const clone = (values: HvListValue[]) => values.map((value) => ({ ...value }));

/**
 * Set all hidden's to false.
 */
const cleanHidden = (lst: HvListValue[]) =>
  lst.map((item) => ({ ...item, isHidden: false }));

const valuesExist = (values: HvListValue[]) =>
  values != null && values?.length > 0;

/** Filter selected ordered element `id`s (or `label`) */
const getSelectedIds = (list: HvListValue[]) =>
  getSelected(list).map((item) => item.id || item.label);

export const HvDropdownList = (props: HvDropdownListProps) => {
  const {
    id,
    classes: classesProp,
    values = [],
    multiSelect = false,
    showSearch = false,
    onChange,
    onCancel,
    labels,
    notifyChangesOnFirstRender = false,
    singleSelectionToggle,
    height: heightProp,
    maxHeight: maxHeightProp,
    virtualized = false,
    ...others
  } = useDefaultProps("HvDropdownList", props);
  const { classes, cx } = useClasses(classesProp);

  const [searchStr, setSearchStr] = useState<string>("");
  const [list, setList] = useState<HvListValue[]>(clone(values));
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [anySelected, setAnySelected] = useState<boolean>(false);
  const { popper } = useBaseDropdownContext();
  const { maxWidth, maxHeight } = popper?.styles.popper || {};

  const hasChanges = useMemo(() => {
    return String(getSelectedIds(values)) !== String(getSelectedIds(list));
  }, [list, values]);

  /**
   * Update states associated with select all.
   */
  const updateSelectAll = (listValues: HvListValue[]) => {
    if (!listValues) return;
    const nbrSelected = getSelected(listValues).length;
    const hasSelection = nbrSelected > 0;
    const allSelect = nbrSelected === listValues.length;

    setAnySelected(hasSelection);
    setAllSelected(hasSelection && allSelect);
  };

  /**
   * After the first render, call onChange if notifyChangesOnFirstRender.
   */
  useEffect(() => {
    if (!valuesExist(values)) return;
    setList(clone(values));
    updateSelectAll(values);
    if (notifyChangesOnFirstRender) {
      onChange?.(values, false, false, true);
    }
  }, [values, notifyChangesOnFirstRender, onChange]);

  /**
   * Sets the filtered values to the state.
   *
   * @param {String} str - The value that is being looked.
   */
  const handleSearch = (str: string) => {
    const results = list?.filter(({ searchValue, label, value }) => {
      const stringValue =
        (typeof searchValue === "string" && searchValue) ||
        (typeof label === "string" && label) ||
        (typeof value === "string" && value) ||
        "";

      return stringValue.toLowerCase().indexOf(str.toLowerCase()) >= 0;
    });

    if (results != null) {
      const newList = list.map((elem) => {
        const isResult = results.find((result) => result.label === elem.label);
        return { ...elem, isHidden: !isResult };
      });

      setList(newList);
      setSearchStr(str);
    }
    return str;
  };

  /**
   * Create search element.
   *
   * @returns {*}
   */
  const renderSearch = () => (
    <div className={classes.searchContainer}>
      <HvInput
        type="search"
        value={searchStr}
        placeholder={labels?.searchPlaceholder}
        aria-label={labels?.searchPlaceholder}
        onChange={(event, str) => handleSearch(str)}
      />
    </div>
  );

  /**
   * Select all the values inside the dropdown.
   *
   */
  const handleSelectAll = () => {
    const newList = list.map((elem) => {
      if (elem.disabled) return elem;
      return { ...elem, selected: !anySelected };
    });
    setList(newList);
    updateSelectAll(newList);
  };

  const renderSelectAll = () => {
    return (
      <HvCheckBox
        label={
          <CounterLabel
            selected={getSelected(list).length}
            total={list.length}
            conjunctionLabel={labels?.multiSelectionConjunction}
          />
        }
        onChange={handleSelectAll}
        className={classes.selectAll}
        indeterminate={anySelected && !allSelected}
        checked={allSelected}
      />
    );
  };

  /**
   * When selecting the state list is updated with the corresponding selection.
   *
   * @param listValues - elements selected.
   */
  const onSelection: HvListProps["onChange"] = (listValues) => {
    if (!multiSelect) {
      onChange(cleanHidden(listValues), true, true, true);
    } else {
      updateSelectAll(listValues);
      setList(clone(listValues));
    }
  };

  /**
   * Render action buttons.
   */
  const renderActions = () => {
    return (
      <HvActionBar>
        <HvButton
          disabled={!hasChanges}
          onClick={() => onChange(cleanHidden(list), true, true, true)}
          variant="primaryGhost"
        >
          {labels?.applyLabel}
        </HvButton>
        <HvButton onClick={onCancel} variant="primaryGhost">
          {labels?.cancelLabel}
        </HvButton>
      </HvActionBar>
    );
  };

  const showList = valuesExist(values);
  /** bottom margin + Panel padding + Search size + SelectAll + ActionBar size */
  const elementsSize = theme.spacing(
    5 + 2 + (showSearch ? 5 : 0) + (showList && multiSelect ? 4 + 6 : 0),
  );

  return (
    <div className={classes.rootList}>
      <div className={classes.listBorderDown} />
      <div className={classes.listContainer}>
        {showSearch && renderSearch()}
        {showList && multiSelect && renderSelectAll()}
        {showList && (
          <HvList
            style={mergeStyles(undefined, {
              height: heightProp,
              "--maxW": maxWidth,
              "--maxH": maxHeightProp ?? `calc(${maxHeight} - ${elementsSize})`,
            })}
            classes={{
              root: cx(classes.dropdownListContainer, {
                [classes.virtualized]: virtualized,
              }),
            }}
            values={list}
            multiSelect={multiSelect}
            useSelector={multiSelect}
            showSelectAll={false}
            onChange={onSelection}
            labels={{
              selectionConjunction: labels?.multiSelectionConjunction,
            }}
            selectable
            condensed
            singleSelectionToggle={singleSelectionToggle}
            height={heightProp}
            virtualized={virtualized}
            {...others}
          />
        )}
      </div>
      {showList && multiSelect ? renderActions() : null}
    </div>
  );
};
