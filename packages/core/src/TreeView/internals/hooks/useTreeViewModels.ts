import * as React from "react";

import type {
  ConvertPluginsIntoSignatures,
  MergePluginsProperty,
  TreeViewAnyPluginSignature,
  TreeViewPlugin,
} from "../types";

/**
 * Implements the same behavior as `useControlled` but for several models.
 * The controlled models are never stored in the state and the state is only updated if the model is not controlled.
 */
export const useTreeViewModels = <
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
>(
  plugins: TPlugins,
  props: MergePluginsProperty<
    ConvertPluginsIntoSignatures<TPlugins>,
    "defaultizedParams"
  >,
) => {
  const modelsRef = React.useRef<Record<string, {
      controlledProp: keyof typeof props;
      defaultProp: keyof typeof props;
      isControlled: boolean;
    }>>({});

  const [modelsState, setModelsState] = React.useState<Record<string, any>>(() => {
    const initialState: Record<string, any> = {};

    plugins.forEach((plugin) => {
      if (plugin.models) {
        Object.entries(plugin.models).forEach(([modelName, model]) => {
          modelsRef.current[modelName] = {
            controlledProp: model.controlledProp as keyof typeof props,
            defaultProp: model.defaultProp as keyof typeof props,
            isControlled:
              props[model.controlledProp as keyof typeof props] !== undefined,
          };
          initialState[modelName] =
            props[model.defaultProp as keyof typeof props];
        });
      }
    });

    return initialState;
  });

  const models = Object.fromEntries(
    Object.entries(modelsRef.current).map(([modelName, model]) => {
      const value = model.isControlled
        ? props[model.controlledProp]
        : modelsState[modelName];

      return [
        modelName,
        {
          value,
          setValue: (newValue: any) => {
            if (!model.isControlled) {
              setModelsState((prevState) => ({
                ...prevState,
                [modelName]: newValue,
              }));
            }
          },
        },
      ];
    }),
  ) as MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, "models">;

  return models;
};
