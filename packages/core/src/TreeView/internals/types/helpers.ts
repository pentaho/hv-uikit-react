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
import type { TreeViewAnyPluginSignature, TreeViewPlugin } from "./plugin";

export type DefaultizedProps<
  P extends {},
  RequiredProps extends keyof P,
  AdditionalProps extends {} = {},
> = Omit<P, RequiredProps | keyof AdditionalProps> &
  Required<Pick<P, RequiredProps>> &
  AdditionalProps;

export type MergePluginsProperty<
  TPlugins extends readonly any[],
  TProperty extends keyof TreeViewAnyPluginSignature,
> = TPlugins extends readonly [plugin: infer P, ...otherPlugin: infer R]
  ? P extends TreeViewAnyPluginSignature
    ? P[TProperty] & MergePluginsProperty<R, TProperty>
    : {}
  : {};

export type ConvertPluginsIntoSignatures<TPlugins extends readonly any[]> =
  TPlugins extends readonly [plugin: infer P, ...otherPlugin: infer R]
    ? P extends TreeViewPlugin<infer TSignature>
      ? [TSignature, ...ConvertPluginsIntoSignatures<R>]
      : ConvertPluginsIntoSignatures<R>
    : [];

export interface MergePlugins<TPlugins extends readonly any[]> {
  state: MergePluginsProperty<TPlugins, "state">;
  instance: MergePluginsProperty<TPlugins, "instance">;
  params: MergePluginsProperty<TPlugins, "params">;
  defaultizedParams: MergePluginsProperty<TPlugins, "defaultizedParams">;
  dependantPlugins: MergePluginsProperty<TPlugins, "dependantPlugins">;
  events: MergePluginsProperty<TPlugins, "events">;
  models: MergePluginsProperty<TPlugins, "models">;
}
