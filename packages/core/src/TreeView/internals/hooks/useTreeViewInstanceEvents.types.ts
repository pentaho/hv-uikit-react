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
import type { TreeViewPluginSignature } from "../types";
import type { TreeViewEventListener } from "../types/events";

export interface UseTreeViewInstanceEventsInstance {
  /**
   * Should never be used directly.
   * Please use `useInstanceEventHandler` instead.
   * @param {string} eventName Name of the event to subscribe to.
   * @param {TreeViewEventListener<any>} handler Event handler to call when the event is published.
   * @returns {() => void} Cleanup function.
   */
  $$subscribeEvent: (
    eventName: string,
    handler: TreeViewEventListener<any>,
  ) => () => void;
  /**
   * Should never be used directly.
   * Please use `publishTreeViewEvent` instead.
   * @param {string} eventName Name of the event to publish.
   * @param {any} params The params to publish with the event.
   */
  $$publishEvent: (eventName: string, params: any) => void;
}

export type UseTreeViewInstanceEventsSignature = TreeViewPluginSignature<
  {},
  {},
  UseTreeViewInstanceEventsInstance,
  {},
  {},
  never,
  []
>;
