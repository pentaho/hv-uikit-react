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
import type { AsyncResult } from "@hitachivantara/app-shell-services";

export type UseConditionResult = AsyncResult<boolean, Error, "result">;

export type UseCondition = (
  config?: Record<string, unknown>,
) => UseConditionResult;
