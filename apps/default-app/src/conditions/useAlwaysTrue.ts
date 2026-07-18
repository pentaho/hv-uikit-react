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
import type { UseConditionResult } from "@hitachivantara/app-shell-shared";

const useAlwaysTrue = (): UseConditionResult => {
  return {
    isPending: false,
    error: null,
    result: true,
  };
};

export default useAlwaysTrue;
