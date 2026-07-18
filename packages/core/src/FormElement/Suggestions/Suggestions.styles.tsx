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

export const { staticClasses, useClasses } = createClasses("HvSuggestions", {
  root: {
    position: "relative",
  },
  panel: {},
  list: {
    width: "100%",
  },
  popper: {
    width: "var(--popper-width, 100%)",
  },
  portal: {},
});
