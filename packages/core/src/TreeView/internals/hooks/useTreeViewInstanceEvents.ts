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

import type { TreeViewPlugin } from "../types";
import type { TreeViewEventListener } from "../types/events";
import { EventManager } from "../utils/EventManager";
import type { UseTreeViewInstanceEventsSignature } from "./useTreeViewInstanceEvents.types";
import { populateInstance } from "./utils";

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

/**
 * Plugin responsible for the registration of the nodes defined as JSX children of the TreeView.
 * When we will have both a SimpleTreeView using JSX children and a TreeView using a data prop,
 * this plugin will only be used by SimpleTreeView.
 */
export const useTreeViewInstanceEvents: TreeViewPlugin<
  UseTreeViewInstanceEventsSignature
> = ({ instance }) => {
  const [eventManager] = React.useState(() => new EventManager());

  const publishEvent = React.useCallback(
    (...args: any[]) => {
      const [name, params, event = {}] = args;
      event.defaultMuiPrevented = false;

      if (isSyntheticEvent(event) && event.isPropagationStopped()) {
        return;
      }

      eventManager.emit(name, params, event);
    },
    [eventManager],
  );

  const subscribeEvent = React.useCallback(
    (event: string, handler: TreeViewEventListener<any>) => {
      eventManager.on(event, handler);
      return () => {
        eventManager.removeListener(event, handler);
      };
    },
    [eventManager],
  );

  populateInstance<UseTreeViewInstanceEventsSignature>(instance, {
    $$publishEvent: publishEvent,
    $$subscribeEvent: subscribeEvent,
  });
};
