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
import type { HvProviderProps } from "@hitachivantara/uikit-react-core";

export const HvAppShellEventThemeTrigger = "@hv/app-shell:theme:trigger";

export interface HvAppShellEventTheme extends Pick<
  HvProviderProps,
  "theme" | "colorMode"
> {}
