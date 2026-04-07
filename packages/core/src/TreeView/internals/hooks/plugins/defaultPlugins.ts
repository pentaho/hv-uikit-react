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
> extends UseTreeViewNodesParameters,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewContextValueBuilderParameters {}
