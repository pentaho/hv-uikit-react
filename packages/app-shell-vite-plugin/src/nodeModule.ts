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
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { normalizePath } from "vite";

export const require = createRequire(import.meta.url);

/**
 * Resolves the module entrypoint by name and normalizes slashes to be posix/unix-like forward slashes.
 *
 * @param moduleName The name of the module to be searched for
 * @param suffix to be added after the module path
 * @returns The module path normalized
 */
export function resolveModule(moduleName: string, suffix?: string) {
  const entrypoint = require.resolve(moduleName);
  return normalizePath(suffix ? join(dirname(entrypoint), suffix) : entrypoint);
}
