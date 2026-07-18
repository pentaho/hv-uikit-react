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
import { sqlLanguagePlugin } from "./languages/sql";
import { xmlLanguagePlugin } from "./languages/xml";
import type { LanguagePlugin } from "./types";

/**
 * Language plugins supported by the `CodeEditor`
 * @internal
 */
export const hvLanguagePlugins: Record<string, LanguagePlugin> = {
  xml: xmlLanguagePlugin,
  sql: sqlLanguagePlugin,
};
