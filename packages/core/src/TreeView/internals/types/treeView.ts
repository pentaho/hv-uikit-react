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
import * as React from "react";

import type { MergePluginsProperty } from "./helpers";
import type { TreeViewAnyPluginSignature } from "./plugin";

export interface TreeViewNode {
  id: string;
  idAttribute: string | undefined;
  index: number;
  parentId: string | null;
  expandable: boolean;
  disabled: boolean | undefined;
}

export interface TreeViewItemRange {
  start?: string | null;
  end?: string | null;
  next?: string | null;
  current?: string;
}

export interface TreeViewModel<TValue> {
  name: string;
  value: TValue;
  setValue: React.Dispatch<React.SetStateAction<TValue>>;
}

export type TreeViewInstance<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
> = MergePluginsProperty<TSignatures, "instance">;
