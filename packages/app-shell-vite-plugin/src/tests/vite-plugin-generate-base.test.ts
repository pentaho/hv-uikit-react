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

import { getAppTitle } from "../vite-plugin-generate-base";

describe("test vite-generate-base plugin", () => {
  describe("test `getAppTitle` method", () => {
    test.each<[boolean, HvAppShellConfig, string]>([
      [false, { name: "dummyName" }, "dummyName"],
      [true, {}, "%%APPSHELL_TITLE%%"],
    ])("At mode %b, %j,  app title matches %s", (value, config, expected) => {
      expect(getAppTitle(value, config)).toBe(expected);
    });
  });
});
