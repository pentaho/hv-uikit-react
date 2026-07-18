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
import { NavLink } from "react-router-dom";
import { HvIconButton } from "@hitachivantara/uikit-react-core";
import { Debug } from "@hitachivantara/uikit-react-icons";

export default function DebugLink() {
  if (import.meta.env.PROD) return null;

  return (
    <HvIconButton component={NavLink} to="/debug" title="Debug Page">
      <Debug />
    </HvIconButton>
  );
}
