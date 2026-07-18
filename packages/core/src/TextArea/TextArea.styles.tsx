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

export const { staticClasses, useClasses } = createClasses("HvTextArea", {
  root: { display: "inline-block", width: "100%" },
  disabled: {},
  resizable: { width: "fit-content" },
  invalid: {},
  baseInput: { clear: "both", float: "left" },
  input: {},
  inputResizable: {},
  labelContainer: {},
  label: {},
  description: {},
  characterCounter: {
    textAlign: "right",
    marginLeft: "auto",
  },
  error: { float: "left" },
});
