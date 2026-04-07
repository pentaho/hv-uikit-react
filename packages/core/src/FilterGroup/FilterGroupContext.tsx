import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import { isEqual } from "../utils/helpers";
import { useSavedState } from "../utils/useSavedState";
import type { HvFilterGroupFilters, HvFilterGroupValue } from "./types";

interface HvFilterGroupContextValue {
  activeGroup: number;
  setActiveGroup: Dispatch<SetStateAction<number>>;
  filterOptions: HvFilterGroupFilters;
  setFilterValues: (value?: HvFilterGroupValue, save?: boolean) => void;
  rollbackFilters: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  applyDisabled: boolean;
  appliedFilters?: HvFilterGroupValue;
  defaultValue?: HvFilterGroupValue;
  filterValues?: HvFilterGroupValue;
}

export const HvFilterGroupContext = createContext<HvFilterGroupContextValue>({
  activeGroup: 0,
  setActiveGroup: () => {},
  filterOptions: [],
  setFilterValues: () => {},
  rollbackFilters: () => {},
  clearFilters: () => {},
  applyFilters: () => {},
  applyDisabled: false,
  filterValues: [],
  appliedFilters: undefined,
  defaultValue: undefined,
});

const groups = (filters: HvFilterGroupFilters) => filters.map(() => []);

interface HvFilterGroupProviderProps {
  children: React.ReactNode;
  filters: HvFilterGroupFilters;
  defaultValue?: HvFilterGroupValue;
  value?: HvFilterGroupValue;
}

export const HvFilterGroupProvider = (props: HvFilterGroupProviderProps) => {
  const { defaultValue, value, filters, children } = useDefaultProps(
    "HvFilterGroupProvider",
    props,
  );

  const [group, setActiveGroup] = useState<number>(0);
  const [filterValues, setFilterValues, rollbackFilters, appliedFilters] =
    useSavedState<HvFilterGroupValue>(value || groups(filters));
  const [applyDisabled, setApplyDisabled] = useState<boolean>(false);

  useEffect(() => {
    setFilterValues(value, true);
  }, [value, setFilterValues]);

  useEffect(() => {
    setApplyDisabled(isEqual(filterValues, appliedFilters));
  }, [filterValues, appliedFilters]);

  const clearFilters = useCallback(() => {
    setFilterValues(defaultValue || groups(filters));
  }, [filters, setFilterValues, defaultValue]);

  const applyFilters = useCallback(() => {
    setFilterValues(filterValues, true);
  }, [filterValues, setFilterValues]);

  const contextValue: HvFilterGroupContextValue = useMemo(
    () => ({
      activeGroup: group,
      setActiveGroup,
      filterOptions: filters,
      filterValues,
      setFilterValues,
      appliedFilters,
      rollbackFilters,
      clearFilters,
      applyFilters,
      applyDisabled,
      defaultValue,
    }),
    [
      appliedFilters,
      applyDisabled,
      applyFilters,
      clearFilters,
      filterValues,
      filters,
      group,
      rollbackFilters,
      setFilterValues,
      defaultValue,
    ],
  );

  return (
    <HvFilterGroupContext.Provider value={contextValue}>
      {children}
    </HvFilterGroupContext.Provider>
  );
};
