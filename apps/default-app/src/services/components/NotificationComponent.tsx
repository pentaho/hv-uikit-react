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
import { RocketLaunchIcon } from "@phosphor-icons/react/RocketLaunch";
import { HvTypography } from "@hitachivantara/uikit-react-core";

import type { BasicNotification } from "../types";

const NotificationComponent: BasicNotification = ({ message, variant }) => {
  return (
    <>
      <RocketLaunchIcon />
      <HvTypography variant={variant} style={{ marginBottom: "16px" }}>
        {message}
      </HvTypography>
    </>
  );
};

export default NotificationComponent;
