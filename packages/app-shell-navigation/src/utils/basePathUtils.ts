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

/**
 * Returns the app base path.
 * - The path is calculated by returning the sub-path value for the main app.
 * - Main app is the first app that baseUrl matches window.location
 * - App baseUrl don't have case restrictions
 * - If the main app is not discovered, returns "/"
 *
 * @return The main app baseUrl, or "/" otherwise. Value is always returned in lowercase.
 * @param config The app configuration definition
 */
const getBasePath = (config: HvAppShellConfig) => {
  return config?.baseUrl ?? "/";
};

export default getBasePath;
