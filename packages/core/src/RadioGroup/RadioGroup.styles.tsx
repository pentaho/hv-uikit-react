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

export const { staticClasses, useClasses } = createClasses("HvRadioGroup", {
  root: {
    display: "inline-block",
    overflow: "clip",
    overflowClipMargin: 4,
    verticalAlign: "top",
  },
  label: {},
  group: { display: "flex" },
  vertical: {
    flexDirection: "column",

    // Prevent the focus ring to be hidden by sibling hover background
    "&>*": {
      zIndex: 0,
    },
    "&>*:focus-within": {
      zIndex: 1,
    },
  },
  horizontal: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.sm,
  },
  invalid: {
    paddingBottom: theme.space.xs,
    borderBottom: `1px solid ${theme.form.errorColor}`,
  },
  error: {},
});
