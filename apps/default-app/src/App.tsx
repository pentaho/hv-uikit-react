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
import HvAppShell from "@hitachivantara/app-shell-ui";

export default function App() {
  return <HvAppShell configUrl={document.baseURI + "app-shell.config.json"} />;
}
