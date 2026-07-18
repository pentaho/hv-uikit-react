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
import { render } from "@testing-library/react";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import TestProvider from "./TestProvider";

/**
 * Utility function to render the test components wrapped in the TestProvider.
 * It also mocks the useAppShellConfig hook with the passed `config` parameter
 */
const renderTestProvider = (
  children: React.ReactNode,
  config: Partial<HvAppShellConfig> = {},
  bundles: Record<string, object> = {},
) => {
  return render(
    <TestProvider config={config} bundles={bundles}>
      {children}
    </TestProvider>,
  );
};

export default renderTestProvider;
