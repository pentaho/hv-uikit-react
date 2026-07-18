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
import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import {
  HvVerticalNavigationTree,
  type HvVerticalNavigationTreeProps,
} from "../Navigation";
import type { NavigationData } from "../VerticalNavigationContext";
import { useClasses } from "./NavigationPopup.styles";
import {
  NavigationPopupContainer,
  type HvVerticalNavigationPopupClasses,
} from "./NavigationPopupContainer";

export interface HvVerticalNavigationPopupProps extends HvBaseProps<HTMLDivElement> {
  id?: string;
  anchorEl?: HTMLElement | null;
  fixedMode?: boolean;
  data?: NavigationData[];
  selected?: string;
  onClose?: () => void;
  onChange?: any;
  classes?: HvVerticalNavigationPopupClasses;
}

export const HvVerticalNavigationPopup = (
  props: HvVerticalNavigationPopupProps,
) => {
  const {
    id,
    anchorEl,
    fixedMode,
    onClose,
    data,
    selected,
    onChange,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvVerticalNavigationPopup", props);

  const { classes } = useClasses(classesProp);

  const handleChange: HvVerticalNavigationTreeProps["onChange"] = (
    event,
    selectedItem,
  ) => onChange(event, selectedItem.id, selectedItem);

  const handleMouseLeave = () => {
    if (fixedMode) return;
    onClose?.();
  };

  return (
    <NavigationPopupContainer
      anchorEl={anchorEl}
      onClose={onClose}
      classes={classes}
      {...others}
    >
      <HvVerticalNavigationTree
        className={classes.popup}
        collapsible
        defaultExpanded
        selected={selected}
        onChange={handleChange}
        data={data}
        onMouseLeave={handleMouseLeave}
      />
    </NavigationPopupContainer>
  );
};
