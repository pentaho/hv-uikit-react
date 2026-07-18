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
import { createClasses, theme } from "@hitachivantara/uikit-react-core";

import { staticClasses as nodeClasses } from "../Node/Node.styles";

const baseClasses = Object.fromEntries(
  Object.keys(nodeClasses).map((key) => [key, {}]),
) as Record<keyof typeof nodeClasses, {}>;

export const { staticClasses, useClasses } = createClasses("HvDashboardNode", {
  empty: {
    padding: theme.spacing("sm", 0, 0, 0),
  },
  // Spread here to know if we are overriding classes from parents
  ...baseClasses,
});
