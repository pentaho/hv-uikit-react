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

export const { staticClasses, useClasses } = createClasses("HvBreadCrumb", {
  root: { display: "flex", alignItems: "center", zIndex: 0 },
  link: {},
  orderedList: {
    display: "flex",
    paddingLeft: 0,
    marginLeft: `-${theme.space.xs}`,
  },
  currentPage: { padding: `8px ${theme.space.xs}` },
  centerContainer: {},
  separatorContainer: {},
  a: {},
});
