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
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { HvDashboardProps } from "@hitachivantara/uikit-react-lab";

export interface LayoutConfig extends Pick<
  HvDashboardProps,
  "layout" | "cols"
> {
  items?: {
    id: string;
    type: string;
    label: string;
    predefined?: boolean;
    connected?: boolean;
  }[];
}

export type Layouts = Record<string, LayoutConfig | undefined>;

export interface LayoutsContextValue {
  layouts?: Layouts;
  setLayouts?: Dispatch<SetStateAction<Layouts>>;
}

const LayoutsContext = createContext<LayoutsContextValue>({});

interface LayoutsProviderProps {
  layouts?: Layouts;
  children?: React.ReactNode;
}

export const LayoutsProvider = ({
  children,
  layouts: layoutsProp,
}: LayoutsProviderProps) => {
  const [layouts, setLayouts] = useState<Layouts>(layoutsProp || {});

  const value = useMemo(
    () => ({
      layouts,
      setLayouts,
    }),
    [layouts],
  );

  return (
    <LayoutsContext.Provider value={value}>{children}</LayoutsContext.Provider>
  );
};

export const useLayoutsContext = () => useContext(LayoutsContext);
