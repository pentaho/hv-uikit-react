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

export const { staticClasses, useClasses } = createClasses(
  "HvScrollToVertical",
  {
    root: {
      display: "flex",
      width: "32px",
      padding: "0",
      margin: 0,
      listStyleType: "none",
      flexWrap: "wrap",
      flexDirection: "column",
      backdropFilter: `blur(4px)`,
      backgroundColor: theme.alpha("bgPage", 0.9),
    },
    positionAbsolute: {
      width: "32px",
      position: "absolute",
      zIndex: `calc(${theme.zIndices.banner} - 2)`,
      right: "0",
    },
    positionFixed: {
      width: "32px",
      position: "fixed",
      zIndex: `calc(${theme.zIndices.banner} - 2)`,
      right: "0",
    },
  },
);

export const calculateOffset = (quantityOfOptions: number) => {
  const itemSize = 32;
  const halfOptions = Math.round(quantityOfOptions * 0.5);

  return halfOptions * itemSize;
};
