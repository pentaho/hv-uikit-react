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

export const { staticClasses, useClasses } = createClasses("HvControls", {
  root: {
    display: "inline-flex",
    width: "100%",
    justifyContent: "space-between",
  },
  section: { display: "inline-flex", alignItems: "flex-end", gap: 10 },
  rightSection: {},
  leftSection: {},
});
