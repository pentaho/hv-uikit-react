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
import type {
  CleanupTracking,
  UnregisterToken,
  UnsubscribeFn,
} from "./CleanupTracking";

export class FinalizationRegistryBasedCleanupTracking implements CleanupTracking {
  registry = new FinalizationRegistry<UnsubscribeFn>((unsubscribe) => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });

  register(
    object: any,
    unsubscribe: UnsubscribeFn,
    unregisterToken: UnregisterToken,
  ): void {
    this.registry.register(object, unsubscribe, unregisterToken);
  }

  unregister(unregisterToken: UnregisterToken): void {
    this.registry.unregister(unregisterToken);
  }

  // eslint-disable-next-line class-methods-use-this
  reset() {}
}
