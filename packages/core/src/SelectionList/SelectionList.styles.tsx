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

export const { staticClasses, useClasses } = createClasses("HvSelectionList", {
  root: { display: "inline-block", padding: 0, margin: 0 },
  error: { width: "100%", float: "left", clear: "both" },
  listbox: {
    display: "flex",
    float: "left",
    clear: "both",
    width: "100%",
    paddingBottom: theme.space.xs,
  },
  label: {},
  description: { float: "left" },
  horizontal: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: -theme.space.sm,
    "&>*": {
      marginLeft: theme.space.sm,
    },
  },
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
  invalid: { borderBottom: `1px solid ${theme.form.errorColor}` },
});
