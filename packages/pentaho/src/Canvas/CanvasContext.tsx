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
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type HvCanvasContextValue = {
  sidePanelOpen: boolean;
  handleSidePanelOpen: (open: boolean) => void;
  sidePanelWidth: number;
  handleSidePanelWidth: (width: number) => void;
  sidePanelDragging: boolean;
  handleSidePanelDragging: (dragging: boolean) => void;
};

export const HvCanvasContext = createContext<HvCanvasContextValue | null>(null);

export const HvCanvasProvider = ({
  children,
}: {
  children: React.ReactNode;
  onSidePanelResize?: (width: number) => void;
}) => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [sidePanelDragging, setSidePanelDragging] = useState(false);

  const handleSidePanelWidth = useCallback((newWidth: number) => {
    setWidth(newWidth);
  }, []);

  const handleSidePanelOpen = useCallback((open: boolean) => {
    setSidePanelOpen(open);
  }, []);

  const handleSidePanelDragging = useCallback((dragging: boolean) => {
    setSidePanelDragging(dragging);
  }, []);

  const value = useMemo(
    () => ({
      sidePanelOpen,
      handleSidePanelOpen,
      sidePanelWidth: sidePanelOpen ? width : 0,
      handleSidePanelWidth,
      sidePanelDragging,
      handleSidePanelDragging,
    }),
    [
      sidePanelOpen,
      handleSidePanelOpen,
      width,
      handleSidePanelWidth,
      sidePanelDragging,
      handleSidePanelDragging,
    ],
  );

  return (
    <HvCanvasContext.Provider value={value}>
      {children}
    </HvCanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  return useContext(HvCanvasContext);
};
