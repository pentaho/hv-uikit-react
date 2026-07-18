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

export const { staticClasses, useClasses } = createClasses("HvAdornment", {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 30,
    flexShrink: 0,
  },
  hideIcon: { display: "none" },
  disabled: {},
});
