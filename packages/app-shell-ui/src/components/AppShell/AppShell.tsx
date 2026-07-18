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
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { HvAppShellContainer } from "./AppShellContainer";
import { HvAppShellRouter } from "./AppShellRouter";

export interface HvAppShellProps {
  config?: Partial<HvAppShellConfig>;
  configUrl?: string;
}

/**
 *  The main App Shell UI component that:
 * - Loads the configuration via `config` or `configUrl`
 * - Instantiates Global Providers (i18n, theming, error boundary, etc)
 * - Renders the App Shell Header & Vertical Navigation Layout
 * - Instantiates the App Shell Router for the given configuration
 */
export default function HvAppShell({ config, configUrl }: HvAppShellProps) {
  return (
    <HvAppShellContainer config={config} configUrl={configUrl}>
      <HvAppShellRouter />
    </HvAppShellContainer>
  );
}
