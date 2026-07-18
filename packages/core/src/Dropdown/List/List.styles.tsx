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

export const { staticClasses, useClasses } = createClasses("HvDropdownList", {
  rootList: {},
  dropdownListContainer: {
    overflow: "auto",
    padding: 4,
    margin: -4,
    maxWidth: "var(--maxW)",
    maxHeight: "var(--maxH)",
  },
  virtualized: {
    maxWidth: "inherit",
    maxHeight: "inherit",
    overflow: "inherit",
    padding: 0,
  },
  searchContainer: { marginBottom: theme.space.xs },
  listBorderDown: {},
  listContainer: { padding: theme.space.sm },
  selectAll: {},
});
