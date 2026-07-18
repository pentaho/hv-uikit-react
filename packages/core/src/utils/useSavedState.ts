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
import { useCallback, useState } from "react";

export function useSavedState<T>(defaultState: T) {
  const [state, setState] = useState<T | undefined>(defaultState);
  const [submittedState, setSubmittedState] = useState<T | undefined>(
    defaultState,
  );

  const changeState = useCallback((value?: T, save = false) => {
    setState(value);
    if (save) setSubmittedState(value);
  }, []);

  const rollback = () => {
    setState(submittedState);
  };

  return [state, changeState, rollback, submittedState] as const;
}
