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
import { createClasses } from "@hitachivantara/uikit-react-core";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvWizardContent", {
  contentContainer: {
    position: "relative",
    padding: 20,
    marginLeft: 0,
    minHeight: 400,
    overflowX: "hidden",
  },
  fixedHeight: {
    minHeight: "calc(100vh - 387px)",
  },
  summaryRef: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
  summarySticky: {
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  summaryContainer: {
    position: "absolute",
    top: 0,
    minWidth: 280,
    boxShadow: theme.colors.shadow,
    backgroundColor: theme.colors.bgContainer,
    transition: "transform 0.3s",
    transitionTimingFunction: "ease-in-out",
    overflowY: "scroll",
  },
});
