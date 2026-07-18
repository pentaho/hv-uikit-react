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
// eslint-disable-next-line extensions review need of .js extensions
export * from "./vite-plugin.js";

// reexport types from shared package
export type {
  HvAppShellConfig,
  HvAppShellIcon,
  HvAppShellLogo,
  HvAppShellMenuConfig,
  HvAppShellMainPanelConfig,
  HvAppShellViewsConfig,
} from "@hitachivantara/app-shell-shared";
