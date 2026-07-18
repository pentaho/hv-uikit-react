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
import { useState } from "react";
import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import { HvBaseDropdown, type HvBaseDropdownProps } from "../BaseDropdown";
import { HvListItem, type HvListItemProps } from "../ListContainer";
import { HvPanel } from "../Panel";
import { HvSelectionList, type HvSelectionListProps } from "../SelectionList";
import { useClasses } from "./Select.styles";

export const Option = ({ ...props }: Partial<HvListItemProps>) => (
  <HvListItem {...props} />
);

export interface HvPaginationSelectProps extends Omit<
  HvBaseDropdownProps,
  "onChange"
> {
  onChange: (event: React.SyntheticEvent, val: number) => void;
  value: number;
}

const HvSelect = (props: HvPaginationSelectProps) => {
  const {
    className,
    classes: classesProp,
    onChange,
    disabled,
    value,
    children,
    ...others
  } = useDefaultProps("HvPaginationSelect", props);
  const { classes } = useClasses(classesProp);
  const [open, setOpen] = useState(false);

  const handleSelect: HvSelectionListProps["onChange"] = (evt, val) => {
    onChange?.(evt, val);
    setOpen(false);
  };

  const handleToggle: HvBaseDropdownProps["onToggle"] = (_evt, s) => {
    setOpen(s);
  };

  const setFocusToContent: HvBaseDropdownProps["onContainerCreation"] = (
    containerRef,
  ) => {
    const listItems =
      containerRef != null ? [...containerRef.getElementsByTagName("li")] : [];
    listItems.every((listItem) => {
      if (listItem.tabIndex >= 0) {
        listItem.focus();
        return false;
      }
      return true;
    });
  };

  return (
    <HvBaseDropdown
      className={className}
      classes={{
        selection: classes.selection,
        header: classes.header,
        headerOpen: classes.headerOpen,
        root: classes.root,
      }}
      expanded={open}
      onToggle={handleToggle}
      onContainerCreation={setFocusToContent}
      placeholder={value}
      disabled={disabled}
      variableWidth
      {...others}
    >
      <HvPanel>
        <HvSelectionList value={value} onChange={handleSelect}>
          {children}
        </HvSelectionList>
      </HvPanel>
    </HvBaseDropdown>
  );
};

export default HvSelect;
