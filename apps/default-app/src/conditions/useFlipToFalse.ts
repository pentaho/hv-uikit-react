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
import { useEffect, useState } from "react";
import type { UseConditionResult } from "@hitachivantara/app-shell-shared";

const FLIP_DURATION = 10000;

/**
 * A condition hook that starts with a true result and automatically
 * flips to false after 10 seconds. Useful for demonstrating dynamic
 * conditions or timed UI hiding.
 *
 * @returns UseConditionResult with isPending: false and result that
 *          transitions from true to false after 10 seconds
 */
const useFlipToFalse = (): UseConditionResult => {
  const [result, setResult] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setResult(false);
    }, FLIP_DURATION);

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timeout);
  }, []);

  return {
    isPending: false,
    error: null,
    result,
  };
};

export default useFlipToFalse;
