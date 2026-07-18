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
import { createContext, useMemo, useReducer } from "react";

type Action = { type: "setItemFocused"; itemFocused: EventTarget & Element };

const reducer: React.Reducer<FocusContextType, Action> = (state, action) => {
  switch (action.type) {
    case "setItemFocused":
      return { itemFocused: action.itemFocused };
    default:
      return state;
  }
};

const initialState = { itemFocused: undefined, dispatch: undefined };

type FocusContextType = {
  itemFocused?: EventTarget & Element;
  dispatch?: React.Dispatch<Action>;
};

export const FocusContext = createContext<FocusContextType>(initialState);

export const FocusProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch],
  );

  return (
    <FocusContext.Provider value={contextValue}>
      {children}
    </FocusContext.Provider>
  );
};
