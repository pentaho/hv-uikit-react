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

import { ServicesContext } from "../providers/ServiceManagerProvider";

export const useServicesContext = () => {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error(
      "useServicesContext must be used within an ServiceManagerProvider",
    );
  }

  return context;
};
