import { useContext, useState } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvDropdown, HvDropdownProps } from "../../Dropdown";
import { HvListValue } from "../../List";
import { HvBaseProps } from "../../types/generic";
import { HvControlsContext } from "../context/ControlsContext";
import { staticClasses, useClasses } from "./RightControl.styles";

export { staticClasses as rightControlClasses };

export type HvRightControlClasses = ExtractNames<typeof useClasses>;

export interface HvRightListControls extends HvListValue {
  accessor: string;
  desc: boolean;
}

export interface HvRightControlProps extends HvBaseProps {
  /** if `true` the hide sort by dropdown is not rendered */
  hideSortBy?: boolean;
  /** options for the dropdown to sort */
  values?: HvRightListControls[];
  /** Callback called when a sort action occurs */
  onSort?: (selected: HvRightListControls | undefined) => void;
  /** Extra props passed to dropdown */
  sortProps?: HvDropdownProps;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvRightControlClasses;
}

export const HvRightControl = ({
  id,
  classes: classesProp,
  className,
  children,
  values,
  onSort,
  hideSortBy = false,
  sortProps,
  ...others
}: HvRightControlProps) => {
  const { classes, cx } = useClasses(classesProp);

  const [dropDownValues, setDropdownValues] = useState(values);

  const { onSort: onSortHandler } = useContext(HvControlsContext);

  const handleChangeSort: HvDropdownProps["onChange"] = (value: any) => {
    onSort?.(value);
    onSortHandler?.(value);
    // this should be changed when dropdown changes his "values" behavior
    setDropdownValues((prevValues) =>
      prevValues?.map((prevValue) => ({
        ...prevValue,
        selected: prevValue.id === value.id,
      })),
    );
  };

  return (
    <div id={id} className={cx(classes.root, className)} {...others}>
      {!hideSortBy && (
        <HvDropdown
          values={dropDownValues}
          className={classes.sortDropdown}
          onChange={handleChangeSort}
          singleSelectionToggle={false}
          {...sortProps}
        />
      )}
      {children}
    </div>
  );
};
