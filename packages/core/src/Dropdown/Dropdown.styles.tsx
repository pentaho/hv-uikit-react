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
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvDropdown", {
  root: {
    width: "100%",
    position: "relative",
    display: "inline-block",
  },
  labelContainer: {},
  label: {},
  description: {},
  error: {},
  placeholder: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  placeholderClosed: {
    color: theme.colors.textSubtle,
  },
  selectionDisabled: {
    lineHeight: theme.space.md,
    color: theme.colors.textDisabled,
  },
  dropdown: {
    width: "100%",
    borderRadius: theme.radii.base,
  },
  arrow: {},
  dropdownHeader: {},
  dropdownHeaderInvalid: {
    borderColor: theme.form.errorColor,
  },
  dropdownHeaderOpen: {},
  dropdownListContainer: {},
  rootList: {},
  disabled: {
    color: theme.colors.textDisabled,
  },
  readOnly: {
    "& $dropdownHeader": {
      borderColor: theme.colors.textSubtle,
      backgroundColor: theme.colors.bgContainer,
    },
  },
});
