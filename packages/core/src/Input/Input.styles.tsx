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

import { suggestionsClasses } from "../FormElement/Suggestions";

export const { staticClasses, useClasses } = createClasses("HvInput", {
  root: { display: "block" },
  labelContainer: {},
  label: {},
  description: {},
  adornmentsBox: {
    display: "flex",
    flexDirection: "row",
    height: "30px",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "inherit",
    flexShrink: 0,
  },
  icon: {},
  adornmentButton: {
    borderRadius: "inherit",
  },
  iconClear: { display: "none" },
  hasSuggestions: {},
  suggestionsContainer: { width: "100%", position: "relative" },
  suggestionList: {
    [`& .${suggestionsClasses.root} .${suggestionsClasses.list} &`]: {
      width: "100%",
    },
  },
  input: {},
  inputRoot: {
    ":is(:hover,:focus-within) $iconClear": {
      display: "block",
    },
  },
  inputRootFocused: {
    "& $iconClear": {
      display: "block",
    },
  },
  inputRootDisabled: {},
  inputRootMultiline: { padding: 0 },
  error: {},
});
