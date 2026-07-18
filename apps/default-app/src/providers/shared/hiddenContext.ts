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
import { createContext } from "react";

type HiddenContextValue = {
  message: string;
};

export const HiddenContext = createContext<HiddenContextValue>({
  message:
    "Hidden Provider default message! Should not change as provider should not be loaded, ever!",
});
