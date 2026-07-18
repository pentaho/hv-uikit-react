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

export const { useClasses, staticClasses } = createClasses("HvBanner", {
  /** Styles applied to the component root class when the component is closed. */
  rootClosed: {
    display: "none",
  },
  /** Styles applied to the component root class. */
  root: {
    minWidth: `calc(100% - ${theme.space.sm})`,
  },
  /** Styles applied to the component when define as top. */
  anchorOriginTopCenter: {
    top: theme.space.xs,
  },
  /** Styles applied to the component when define as bottom. */
  anchorOriginBottomCenter: {
    bottom: theme.space.xs,
  },
});
