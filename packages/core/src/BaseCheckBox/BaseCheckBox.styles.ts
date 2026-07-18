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

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvBaseCheckBox", {
  root: {
    padding: 0,
    width: 32,
    minWidth: 32,
    height: 32,
    borderRadius: theme.radii.round,
    cursor: "pointer",
    ":hover": {
      backgroundColor: theme.colors.bgHover,
    },
  },
  disabled: {
    cursor: "not-allowed",
    pointerEvents: "initial",
  },
  focusVisible: {
    "& svg": {
      ...outlineStyles,
    },
  },
  icon: {},
  checked: {},
  indeterminate: {},
  semantic: {},
});
