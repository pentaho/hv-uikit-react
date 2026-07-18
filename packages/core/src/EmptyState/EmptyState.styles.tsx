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

export const { staticClasses, useClasses } = createClasses("HvEmptyState", {
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  container: { display: "flex", flexDirection: "row" },
  containerMessageOnly: {
    alignItems: "center",
    "& $textContainer": {
      marginLeft: 0,
    },
  },
  iconContainer: {},
  titleContainer: {
    marginTop: theme.space.xxs,
    marginBottom: theme.space.sm,
  },
  textContainer: {
    background: "transparent",
    maxWidth: "510px",
    overflow: "hidden",
  },
  messageContainer: {},
  actionContainer: { marginTop: theme.space.sm },
});
