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
