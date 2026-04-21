import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvFilterGroupContext } from "../FilterGroupContext";
import type { HvFilterGroupFilters, HvFilterGroupValue } from "../types";
import { staticClasses, useClasses } from "./Counter.styles";

export { staticClasses as filterGroupCounterClasses };

export type HvFilterGroupCounterClasses = ExtractNames<typeof useClasses>;

export interface HvFilterGroupCounterProps {
  className?: string;
  groupId?: string;
  classes?: HvFilterGroupCounterClasses;
}

const getExistingFiltersById = (
  idx: number,
  filterValues: HvFilterGroupValue,
  filterOptions: HvFilterGroupFilters,
) => {
  let total = 0;
  filterValues[idx]?.forEach((fv) => {
    if (filterOptions[idx]?.data.find((f) => f.id === fv)) {
      total += 1;
    }
  });
  return total;
};

export const HvFilterGroupCounter = (props: HvFilterGroupCounterProps) => {
  const {
    className,
    groupId,
    classes: classesProp,
  } = useDefaultProps("HvFilterGroupCounter", props);
  const { classes, cx } = useClasses(classesProp);
  const {
    filterOptions,
    filterValues = [],
    appliedFilters = [],
  } = useContext(HvFilterGroupContext);

  const options =
    groupId && filterOptions.some((option) => option.id === groupId)
      ? [filterOptions.find((option) => option.id === groupId)!]
      : filterOptions;
  const optionIdx = filterOptions.findIndex((option) => option.id === groupId);

  let groupsCounter = 0;
  appliedFilters.forEach((fg, i) => {
    groupsCounter += getExistingFiltersById(i, filterValues, filterOptions);
  });

  const partialCounter = groupId
    ? getExistingFiltersById(optionIdx, filterValues, filterOptions) || 0
    : groupsCounter;

  const totalCounter = options.reduce(
    (acc, option) => acc + option.data.length,
    0,
  );

  return (
    <div className={cx(classes.root, className)}>
      {partialCounter > 0 ? (
        <p className={classes.partialCounter}>{partialCounter}</p>
      ) : (
        partialCounter
      )}
      {` / ${totalCounter}`}
    </div>
  );
};
