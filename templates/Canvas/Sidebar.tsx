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
import { useId, useState } from "react";
import {
  DragOverlay,
  useDndMonitor,
  useDroppable,
  type DndContextProps,
} from "@dnd-kit/core";
import {
  HvCanvasSidePanel,
  type HvCanvasSidePanelProps,
} from "@hitachivantara/uikit-react-pentaho";

export const CanvasSidebar = (props: HvCanvasSidePanelProps) => {
  const [overlay, setOverlay] = useState<React.ReactNode>();

  const elementId = useId();

  // The sidebar is droppable to distinguish between the canvas and the sidebar
  // Otherwise items dropped inside the sidebar will be added to the canvas
  const { setNodeRef } = useDroppable({ id: elementId });

  const handleDragStart: DndContextProps["onDragStart"] = (event) => {
    if (event.active.data.current?.dragOverlay) {
      setOverlay(event.active.data.current.dragOverlay?.component);
    }
  };

  const handleDragEnd: DndContextProps["onDragEnd"] = () => {
    setOverlay(undefined);
  };

  useDndMonitor({
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
  });

  return (
    <>
      <HvCanvasSidePanel
        id={elementId}
        ref={setNodeRef}
        labels={{
          open: "Click to Add Nodes & View Files",
        }}
        {...props}
      />
      {/** Shown when the dragged item leaves the sidebar to drop it in the canvas */}
      <DragOverlay>{overlay ?? null}</DragOverlay>
    </>
  );
};
