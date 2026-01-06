import * as React from "react";
import type { EventHandlers } from "@mui/base";
import { useForkRef } from "@mui/material/utils";

import { TREE_VIEW_CORE_PLUGINS } from "../corePlugins";
import {
  DEFAULT_TREE_VIEW_CONTEXT_VALUE,
  TreeViewContextValue,
} from "../TreeViewProvider";
import {
  ConvertPluginsIntoSignatures,
  MergePluginsProperty,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewPlugin,
} from "../types";
import { useTreeViewModels } from "./useTreeViewModels";

export type UseTreeViewParameters<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> = {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  plugins: TPlugins;
} & MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, "params">;

export type UseTreeViewDefaultizedParameters<
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
> = {
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  plugins: TPlugins;
} & MergePluginsProperty<
  ConvertPluginsIntoSignatures<TPlugins>,
  "defaultizedParams"
>;

export interface UseTreeViewRootSlotProps
  extends Pick<
    React.HTMLAttributes<HTMLUListElement>,
    | "onFocus"
    | "onBlur"
    | "onKeyDown"
    | "id"
    | "aria-activedescendant"
    | "aria-multiselectable"
    | "role"
    | "tabIndex"
  > {
  ref: React.Ref<HTMLUListElement>;
}

export interface UseTreeViewReturnValue<
  TPlugins extends readonly TreeViewAnyPluginSignature[],
> {
  getRootProps: <TOther extends EventHandlers = {}>(
    otherHandlers?: TOther,
  ) => UseTreeViewRootSlotProps;
  rootRef: React.RefCallback<HTMLUListElement> | null;
  contextValue: TreeViewContextValue<TPlugins>;
}

export const useTreeView = <
  Plugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
>(
  inParams: UseTreeViewParameters<Plugins>,
): UseTreeViewReturnValue<ConvertPluginsIntoSignatures<Plugins>> => {
  const plugins = [...TREE_VIEW_CORE_PLUGINS, ...inParams.plugins];
  type Signatures = ConvertPluginsIntoSignatures<typeof plugins>;

  const params = plugins.reduce((acc, plugin) => {
    if (plugin.getDefaultizedParams) {
      return plugin.getDefaultizedParams(acc);
    }

    return acc;
  }, inParams) as unknown as UseTreeViewDefaultizedParameters<Plugins>;

  const models = useTreeViewModels(
    plugins,
    params as MergePluginsProperty<Signatures, "defaultizedParams">,
  );
  const instanceRef = React.useRef<TreeViewInstance<Signatures>>(
    {} as TreeViewInstance<Signatures>,
  );
  const instance = instanceRef.current;
  const innerRootRef = React.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, inParams.rootRef);

  const [state, setState] = React.useState(() => {
    const temp = {} as MergePluginsProperty<Signatures, "state">;
    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(
          temp,
          plugin.getInitialState(
            params as UseTreeViewDefaultizedParameters<any>,
          ),
        );
      }
    });

    return temp;
  });

  const rootPropsGetters: (<TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>)[] = [];
  let contextValue: TreeViewContextValue<Signatures> =
    DEFAULT_TREE_VIEW_CONTEXT_VALUE;

  const runPlugin = (plugin: TreeViewPlugin<any>) => {
    const pluginResponse =
      plugin({
        instance,
        params,
        state,
        setState,
        rootRef: innerRootRef,
        models,
      }) || {};

    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }

    if (pluginResponse.contextValue) {
      contextValue = pluginResponse.contextValue;
    }
  };

  plugins.forEach(runPlugin);

  const getRootProps = <TOther extends EventHandlers = {}>(
    otherHandlers: TOther = {} as TOther,
  ) => {
    const rootProps: UseTreeViewRootSlotProps = {
      role: "tree",
      tabIndex: 0,
      ...otherHandlers,
      ref: handleRootRef,
    };

    rootPropsGetters.forEach((rootPropsGetter) => {
      Object.assign(rootProps, rootPropsGetter(otherHandlers));
    });

    return rootProps;
  };

  return { getRootProps, rootRef: handleRootRef, contextValue };
};
