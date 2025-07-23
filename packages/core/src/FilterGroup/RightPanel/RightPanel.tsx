import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvCheckBox } from "../../CheckBox";
import { HvInput } from "../../Input";
import { HvList, HvListProps } from "../../List";
import { HvPanel } from "../../Panel";
import { CounterLabel } from "../../utils/CounterLabel";
import { HvFilterGroupContext } from "../FilterGroupContext";
import { staticClasses, useClasses } from "./RightPanel.styles";

export { staticClasses as filterGroupRightPanelClasses };

export type HvFilterGroupRightPanelClasses = ExtractNames<typeof useClasses>;

export interface HvFilterGroupRightPanelProps {
  id?: string;
  className?: string;
  labels?: {
    searchBoxPlaceholder?: string;
    multiSelectionConjunction?: string;
  };
  emptyElement?: React.ReactNode;
  classes?: HvFilterGroupRightPanelClasses;
}

export const HvFilterGroupRightPanel = ({
  className,
  labels,
  emptyElement,
  classes: classesProp,
}: HvFilterGroupRightPanelProps) => {
  const { classes } = useClasses(classesProp);
  const [searchStr, setSearchStr] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  const [anySelected, setAnySelected] = useState(false);

  const {
    filterOptions,
    filterValues = [],
    setFilterValues,
    activeGroup,
  } = useContext(HvFilterGroupContext);

  const { all: allActiveGroupOptions, enabled: enabledActiveGroupOptions } =
    useMemo(() => {
      const filteredOptions = filterOptions[activeGroup]?.data.filter(
        (option) => option.name.toLowerCase().includes(searchStr.toLowerCase()),
      );

      return {
        all: filteredOptions?.map((option) => option.id) || [],
        enabled:
          filteredOptions
            ?.filter((option) => !option.disabled)
            ?.map((option) => option.id) || [],
      };
    }, [filterOptions, activeGroup, searchStr]);

  const activeFilterValues = useMemo(
    () =>
      filterValues[activeGroup]?.filter((value) =>
        allActiveGroupOptions.includes(value),
      ) || [],
    [filterValues, allActiveGroupOptions, activeGroup],
  );

  const listValues = useMemo(
    () =>
      filterOptions[activeGroup]?.data.map((option) => ({
        ...option,
        label: option.name,
        selected: filterValues[activeGroup]?.includes(option.id),
        isHidden:
          option.name.toLowerCase().indexOf(searchStr.toLowerCase()) < 0,
      })) || [],
    [filterOptions, filterValues, activeGroup, searchStr],
  );

  const updateSelectAll = useCallback(() => {
    const nbrSelected = activeFilterValues?.length;
    const hasSelection = nbrSelected > 0;
    const allSelect = nbrSelected === allActiveGroupOptions.length;

    setAnySelected(hasSelection);
    setAllSelected(hasSelection && allSelect);
  }, [activeFilterValues, allActiveGroupOptions]);

  useEffect(() => {
    updateSelectAll();
  }, [activeFilterValues, updateSelectAll]);

  useEffect(() => setSearchStr(""), [activeGroup]);

  const onChangeHandler: HvListProps["onChange"] = (values) => {
    const newFilterValues = filterOptions.map((_, i) =>
      activeGroup === i
        ? values.filter((v) => v.selected).map((v) => v.id)
        : [...(filterValues[i] || [])],
    );
    setFilterValues(newFilterValues as any);
  };

  const handleSelectAll = useCallback(() => {
    const newFilterValues = structuredClone(filterValues);

    if (anySelected) {
      if (searchStr !== "") {
        newFilterValues[activeGroup] = filterValues[activeGroup]?.filter(
          (value) => !enabledActiveGroupOptions.includes(value),
        );
      } else {
        newFilterValues[activeGroup] = [];
      }
    } else {
      const currentOptions = newFilterValues[activeGroup] || [];
      newFilterValues[activeGroup] = [
        ...currentOptions,
        ...enabledActiveGroupOptions,
      ];
    }

    setFilterValues(newFilterValues);
  }, [
    activeGroup,
    enabledActiveGroupOptions,
    anySelected,
    filterValues,
    setFilterValues,
    searchStr,
  ]);

  const SelectAll = useCallback(() => {
    return (
      <div className={classes.selectAllContainer}>
        <HvCheckBox
          label={
            <CounterLabel
              selected={activeFilterValues?.length}
              total={allActiveGroupOptions.length}
              conjunctionLabel={labels?.multiSelectionConjunction}
            />
          }
          onChange={handleSelectAll}
          className={classes.selectAll}
          indeterminate={anySelected && !allSelected}
          checked={allSelected}
        />
      </div>
    );
  }, [
    activeFilterValues?.length,
    allActiveGroupOptions.length,
    allSelected,
    anySelected,
    handleSelectAll,
    labels?.multiSelectionConjunction,
    classes?.selectAllContainer,
    classes?.selectAll,
  ]);

  return (
    <HvPanel className={className}>
      {listValues.length > 0 ? (
        <>
          <HvInput
            classes={{
              root: classes.search,
            }}
            type="search"
            placeholder={labels?.searchBoxPlaceholder}
            value={searchStr}
            onChange={(_, str) => setSearchStr(str)}
          />
          <SelectAll />
          <HvList
            key={activeGroup}
            values={listValues}
            className={classes.list}
            multiSelect
            useSelector
            showSelectAll={false}
            onChange={onChangeHandler}
            selectable
            condensed
          />
        </>
      ) : (
        emptyElement
      )}
    </HvPanel>
  );
};
