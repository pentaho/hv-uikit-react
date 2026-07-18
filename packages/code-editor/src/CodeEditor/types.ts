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
import type { Monaco } from "@monaco-editor/react";

export type Formatter = (
  content: string,
  editor: any,
  monaco: Monaco,
  options?: any,
) => Promise<string | undefined>;

/**
 * The structure of a Language Plugin.
 * @internal
 */
export interface LanguagePlugin {
  completionProvider?: (monaco: Monaco, schema?: string) => any;
  validator?: (
    content: string,
    editor: any,
    monaco: Monaco,
    schema?: string,
  ) => Promise<any[]>;
  formatter?: Formatter;
  keyDownListener?: (event: any, editor: any, monaco: Monaco) => void;
  editorOptions?: any;
}
