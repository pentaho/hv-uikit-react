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
import type { UseTreeViewInstanceEventsInstance } from "../hooks/useTreeViewInstanceEvents.types";
import type { TreeViewAnyPluginSignature, TreeViewUsedEvents } from "../types";

export const publishTreeViewEvent = <
  Instance extends UseTreeViewInstanceEventsInstance & {
    $$signature: TreeViewAnyPluginSignature;
  },
  E extends keyof TreeViewUsedEvents<Instance["$$signature"]>,
>(
  instance: Instance,
  eventName: E,
  params: TreeViewUsedEvents<Instance["$$signature"]>[E]["params"],
) => {
  instance.$$publishEvent(eventName as string, params);
};
