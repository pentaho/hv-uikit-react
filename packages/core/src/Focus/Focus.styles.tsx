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

import { outlineStyles } from "../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvFocus", {
  root: {},
  selected: {},
  disabled: {},
  focusDisabled: {
    outline: "none",
    "& *:focus": {
      outline: "none",
    },
    "& *": {
      outline: "none !important",
    },
  },
  focused: {
    ...outlineStyles,
    "@media (-webkit-min-device-pixel-ratio:0)": {
      ...outlineStyles,
    },
  },
  focusedVisible: {
    "&:focus-visible": {
      ...outlineStyles,
      "@media (-webkit-min-device-pixel-ratio:0)": {
        ...outlineStyles,
      },
    },
    "&:focus-within:has(:focus-visible)": {
      ...outlineStyles,
      "@media (-webkit-min-device-pixel-ratio:0)": {
        ...outlineStyles,
      },
    },
  },
  focus: {},
});
