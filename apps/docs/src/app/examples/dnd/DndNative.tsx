import { useState } from "react";
import { clsx } from "clsx";
import {
  HvListContainer,
  HvListItem,
  HvTypography,
  type HvListItemProps,
} from "@hitachivantara/uikit-react-core";
import {
  Battery,
  Cloud,
  Drag,
  Edit,
  Favorite,
  Fire,
  Ghost,
  Heart,
  Palette,
} from "@hitachivantara/uikit-react-icons";

interface Item {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sampleItems: Item[] = [
  { id: "item1", title: "Item 1", icon: <Ghost /> },
  { id: "item2", title: "Item 2", icon: <Cloud /> },
  { id: "item3", title: "Item 3", icon: <Battery /> },
  { id: "item4", title: "Item 4", icon: <Fire /> },
  { id: "item5", title: "Item 5", icon: <Ghost /> },
  { id: "item6", title: "Item 6", icon: <Palette /> },
  { id: "item7", title: "Item 7", icon: <Edit /> },
  { id: "item8", title: "Item 8", icon: <Heart /> },
  { id: "item9", title: "Item 9", icon: <Favorite /> },
];

export default function Demo() {
  const [items, setItems] = useState<Item[]>(sampleItems.filter((i) => i.id));
  const [draggedItem, setDraggedItem] = useState<Item>();
  const [dragging, setDragging] = useState(false);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const onDragStart: HvListItemProps["onDragStart"] = (event) => {
    const draggedIndex = items?.findIndex(
      (i) => i.id === (event.target as any).id,
    );
    if (draggedIndex === -1) return;
    setDragging(true);
    setDraggedItem(items[draggedIndex]);
  };

  const onDragEnd: HvListItemProps["onDragEnd"] = (event) => {
    event.preventDefault();
    setDraggedItem(undefined);
    setDragging(false);
    setDraggedOverIndex(null);
  };

  const onDragOver = (event: React.DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    setDraggedOverIndex(index);
  };

  const onDragLeave = () => {
    setDraggedOverIndex(null);
  };

  const onDrop: HvListItemProps["onDrop"] = (event) => {
    event.preventDefault();

    setDraggedOverIndex(null);
    setDraggedItem(undefined);

    const draggedIndex = items?.findIndex((i) => i === draggedItem);
    const droppedIndex =
      draggedOverIndex !== null ? draggedOverIndex : items.length;

    if (draggedIndex === -1 || droppedIndex === -1) return;

    const updatedItems = [...items];

    updatedItems.splice(draggedIndex, 1);

    // The first splice mutated the array so I'll updated the droppedIndex to take that into account
    const updatedDroppedIndex =
      droppedIndex > draggedIndex ? droppedIndex - 1 : droppedIndex;

    updatedItems.splice(updatedDroppedIndex + 1, 0, draggedItem!);

    setItems(updatedItems);
  };

  return (
    <div>
      <div className="w-250px p-md border-rounded-round">
        <div className="hover:cursor-grab">
          <HvTypography variant="title4">To Do</HvTypography>
        </div>
        <HvListContainer>
          {items?.map((item, index) => (
            <div key={item.id}>
              <HvListItem
                id={item.id}
                className={clsx(
                  "p-0 flex justify-between items-center b-1 border-border bg-bgContainer my-xs mx-0 hover:cursor-grab",
                  dragging &&
                    item.id === draggedItem?.id &&
                    "border-2 border-primary",
                )}
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={(e) => onDragOver(e, index)}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="flex items-center gap-xs">
                  {item.icon}
                  {item.title}
                </div>
                <div className="hover:cursor-grab">
                  <Drag />
                </div>
              </HvListItem>
              {draggedOverIndex === index && (
                <div className="h-2px bg-primary mx-xs my-0" />
              )}
            </div>
          ))}
        </HvListContainer>
      </div>
    </div>
  );
}
