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
import { useContext } from "react";
import {
  HvGlobalActions,
  HvGrid,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";

import { DefaultAppContext } from "../../providers/DefaultAppProvider";

export const DisplayDefaultAppContext = () => {
  const { text } = useContext(DefaultAppContext);

  return (
    <>
      <HvGlobalActions
        title="Display default-app context value"
        style={{ marginBottom: theme.space.xs }}
      />

      <HvGrid container>
        <HvGrid item xs={12} display="flex">
          <HvTypography variant="label">{text}</HvTypography>
        </HvGrid>
      </HvGrid>
    </>
  );
};
