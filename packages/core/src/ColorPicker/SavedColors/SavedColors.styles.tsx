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

export const { useClasses } = createClasses("HvColorPickerSavedColors", {
  root: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    gap: theme.space.xs,
    alignItems: "center",
  },
  swatchRoot: {
    position: "relative",
    height: 32,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    transform: "translate(25%, -25%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 16,
    // background: theme.colors.bgContainer,
    // borderRadius: theme.radii.base,
  },
});
