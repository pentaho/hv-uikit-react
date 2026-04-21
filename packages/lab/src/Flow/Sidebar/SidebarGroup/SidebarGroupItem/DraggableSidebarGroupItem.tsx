import { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useForkRef } from "@mui/material/utils";
import { useUniqueId } from "@hitachivantara/uikit-react-core";

import type { HvFlowGroupItem } from "../../../types";
import {
  HvFlowSidebarGroupItem,
  type HvFlowSidebarGroupItemProps,
} from "./SidebarGroupItem";

export interface HvFlowDraggableSidebarGroupItemProps
  extends HvFlowSidebarGroupItemProps, HvFlowGroupItem {}

export const HvFlowDraggableSidebarGroupItem = ({
  id: idProp,
  label,
  nodeType,
  data,
  ...others
}: HvFlowDraggableSidebarGroupItemProps) => {
  const itemRef = useRef<HTMLElement>(null);
  const id = useUniqueId(idProp);

  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id,
      data: {
        hvFlow: {
          // Needed to know which item is being dragged and dropped
          type: nodeType,
          // Needed for the drag overlay: otherwise the item is cut by the drawer because of overflow
          label,
          // Item position: used to position the item when dropped
          x: itemRef.current?.getBoundingClientRect().x,
          y: itemRef.current?.getBoundingClientRect().y,
          // Data
          data,
        },
      },
    });

  const forkedRef = useForkRef(itemRef, setNodeRef);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <HvFlowSidebarGroupItem
      ref={forkedRef}
      style={style}
      label={label}
      isDragging={isDragging}
      {...listeners}
      {...attributes}
      {...others}
    />
  );
};
