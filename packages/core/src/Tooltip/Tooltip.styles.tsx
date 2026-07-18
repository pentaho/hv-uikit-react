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

export const { staticClasses, useClasses } = createClasses("HvTooltip", {
  root: {},
  tooltip: {
    ...theme.typography.body,
    display: "flex",
    width: "fit-content",
    maxWidth: 532,
    backgroundColor: theme.colors.bgContainer,
    boxShadow: theme.colors.shadow,
    padding: theme.space.sm,
    borderRadius: theme.radii.round,

    "& p": {
      display: "-webkit-box",
      width: "fit-content",
      boxOrient: "vertical",
      textOverflow: "ellipsis",
      wordBreak: "break-word",
      overflow: "hidden",
    },
  },
  popper: {},
});
