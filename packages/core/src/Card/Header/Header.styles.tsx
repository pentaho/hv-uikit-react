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

export const { staticClasses, useClasses } = createClasses("HvCardHeader", {
  root: {
    position: "relative",
    padding: theme.spacing("xs", "sm"),
    gap: theme.space.xs,
    alignItems: "center",
    display: "flex",
  },
  title: {
    ...theme.typography.label,
    fontFamily: theme.fontFamily.body,
  },
  subheader: {
    ...theme.typography.caption1,
    fontFamily: theme.fontFamily.body,
  },
  content: {},
  action: {
    margin: 0,
  },
});
