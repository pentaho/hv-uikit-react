import { useId, useState } from "react";
import {
  DndContextProps,
  DragOverlay,
  useDndMonitor,
  useDroppable,
} from "@dnd-kit/core";
import {
  HvCanvasSidePanel,
  HvCanvasSidePanelProps,
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
