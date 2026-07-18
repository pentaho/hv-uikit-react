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

export const { staticClasses, useClasses } = createClasses("HvWizardActions", {
  actionsContainer: {},
  buttonWidth: {
    width: 120,
    "& span": {
      whiteSpace: "normal",
      lineHeight: theme.lineHeights.sm,
    },
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
  },
  buttonSpacing: {},
});
