import { useTreeViewInstanceEvents } from "./hooks/useTreeViewInstanceEvents";
import type { ConvertPluginsIntoSignatures, MergePlugins } from "./types";

/**
 * Internal plugins that creates the tools used by the other plugins.
 * These plugins are used by the tree view components.
 */
export const TREE_VIEW_CORE_PLUGINS = [useTreeViewInstanceEvents] as const;

// @ts-ignore
export type TreeViewCorePluginsSignature = MergePlugins<
  ConvertPluginsIntoSignatures<typeof TREE_VIEW_CORE_PLUGINS>
>;
