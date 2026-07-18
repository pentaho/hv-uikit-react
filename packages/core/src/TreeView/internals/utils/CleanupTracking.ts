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
export type UnregisterToken = { cleanupToken: number };

export type UnsubscribeFn = () => void;

export interface CleanupTracking {
  register(
    object: any,
    unsubscribe: UnsubscribeFn,
    unregisterToken: UnregisterToken,
  ): void;
  unregister(unregisterToken: UnregisterToken): void;
  reset(): void;
}
