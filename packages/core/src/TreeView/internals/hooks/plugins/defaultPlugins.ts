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
import type { ConvertPluginsIntoSignatures } from "../../types";
import {
  useTreeViewContextValueBuilder,
  type UseTreeViewContextValueBuilderParameters,
} from "./useTreeViewContextValueBuilder";
import {
  useTreeViewExpansion,
  type UseTreeViewExpansionParameters,
} from "./useTreeViewExpansion";
import {
  useTreeViewFocus,
  type UseTreeViewFocusParameters,
} from "./useTreeViewFocus";
import { useTreeViewKeyboardNavigation } from "./useTreeViewKeyboardNavigation";
import {
  useTreeViewNodes,
  type UseTreeViewNodesParameters,
} from "./useTreeViewNodes";
import {
  useTreeViewSelection,
  type UseTreeViewSelectionParameters,
} from "./useTreeViewSelection";

export const DEFAULT_TREE_VIEW_PLUGINS = [
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewContextValueBuilder,
] as const;

export type DefaultTreeViewPlugins = ConvertPluginsIntoSignatures<
  typeof DEFAULT_TREE_VIEW_PLUGINS
>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface DefaultTreeViewPluginParameters<
  Multiple extends boolean | undefined,
>
  extends
    UseTreeViewNodesParameters,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewContextValueBuilderParameters {}
