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
import { HvIconButton } from "@hitachivantara/uikit-react-core";
import { HazyDay } from "@hitachivantara/uikit-react-icons";

import { DefaultAppContext } from "../../providers/DefaultAppProvider";

export default function ChangeContextValue() {
  const { setText } = useContext(DefaultAppContext);

  return (
    <HvIconButton
      variant="secondaryGhost"
      title="Change default-app context value from default-app"
      onClick={() => {
        setText("Change default-app context value from default-app");
      }}
    >
      <HazyDay />
    </HvIconButton>
  );
}
