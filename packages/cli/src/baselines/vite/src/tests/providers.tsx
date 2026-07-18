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
import { Suspense } from "react";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import { SUSPENSE_LABEL } from "./mocks";

/** Base Test Provider */
export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={SUSPENSE_LABEL}>
      <HvProvider>{children}</HvProvider>
    </Suspense>
  );
};
