import { useMemo, useState, type HTMLAttributes } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  HvListContainer,
  HvListItem,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import {
  Battery,
  Cloud,
  Drag,
  Edit,
  Email,
  Favorite,
  Fire,
  Ghost,
  Heart,
  Palette,
  Share,
  Storage,
  Submit,
  Time,
} from "@hitachivantara/uikit-react-icons";

const sampleColumns = [
  { id: "column1", title: "To Do" },
  { id: "column2", title: "Done" },
];

type Column = (typeof sampleColumns)[number];

type Item = {
  id: string;
  columnId: Column["id"];
  title: string;
  icon: React.ReactNode;
};

const sampleItems: Item[] = [
  { id: "item1", title: "Item 1", columnId: "column1", icon: <Ghost /> },
  { id: "item2", title: "Item 2", columnId: "column1", icon: <Cloud /> },
  { id: "item3", title: "Item 3", columnId: "column1", icon: <Battery /> },
  { id: "item4", title: "Item 4", columnId: "column1", icon: <Fire /> },
  { id: "item5", title: "Item 5", columnId: "column1", icon: <Ghost /> },
  { id: "item6", title: "Item 6", columnId: "column1", icon: <Palette /> },
  { id: "item7", title: "Item 7", columnId: "column1", icon: <Edit /> },
  { id: "item8", title: "Item 8", columnId: "column1", icon: <Heart /> },
  { id: "item9", title: "Item 9", columnId: "column1", icon: <Favorite /> },
  { id: "item10", title: "Item 10", columnId: "column2", icon: <Email /> },
  { id: "item11", title: "Item 11", columnId: "column2", icon: <Submit /> },
  { id: "item12", title: "Item 12", columnId: "column2", icon: <Share /> },
  { id: "item13", title: "Item 13", columnId: "column2", icon: <Time /> },
  { id: "item14", title: "Item 14", columnId: "column2", icon: <Storage /> },
];

interface ColumnContainerProps {
  column: Column;
  items?: Item[];
}

interface ItemProps extends HTMLAttributes<HTMLLIElement> {
  item: Item;
}

export const ItemCard = ({ item, style: overlayStyle }: ItemProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data: { type: "Item", item } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <HvListItem
      className="p-0 flex justify-between items-center b-1 border-border bg-bgContainer my-xs mx-0"
      ref={setNodeRef}
      style={{
        ...style,
        ...(isDragging
          ? {
              border: `1px dashed ${theme.colors.primary}`,
              outline: "none",
              boxShadow: "none",
            }
          : { ...overlayStyle }),
      }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-xs">
        {item.icon}
        {item.title}
      </div>
      <Drag />
    </HvListItem>
  );
};

export const ColumnContainer = ({ column, items }: ColumnContainerProps) => {
  const itemsIds = useMemo(() => items?.map((task) => task.id), [items]) || [];

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: "Column", column } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        ...(isDragging
          ? {
              ...style,
              opacity: 0.2,
              border: `1px solid ${theme.colors.textSubtle}`,
            }
          : {}),
      }}
      className="flex flex-col p-md border-rounded-round w-250px gap-sm"
    >
      <div className="hover:cursor-grab" {...attributes} {...listeners}>
        <HvTypography variant="title4">{column.title}</HvTypography>
      </div>
      <HvListContainer selectable>
        <SortableContext items={itemsIds}>
          {items?.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </HvListContainer>
    </div>
  );
};

export default function Demo() {
  const [columns, setColumns] = useState<Column[]>(sampleColumns);
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor, {}),
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
    if (event.active.data.current?.type === "Item") {
      setActiveItem(event.active.data.current.item);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveItem(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((cs) => {
      const activeColumnIndex = cs.findIndex((col) => col.id === activeId);
      const overColumnIndex = cs.findIndex((col) => col.id === overId);

      return arrayMove(cs, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAnItem = active.data.current?.type === "Item";
    const isOverAnItem = over.data.current?.type === "Item";

    if (!isActiveAnItem) return;

    // Dropping an Item over another Item
    if (isActiveAnItem && isOverAnItem) {
      setItems((item) => {
        const activeIndex = item.findIndex((t) => t.id === activeId);
        const overIndex = item.findIndex((t) => t.id === overId);

        if (item[activeIndex].columnId !== item[overIndex].columnId) {
          item[activeIndex].columnId = item[overIndex].columnId;
          return arrayMove(item, activeIndex, overIndex - 1);
        }

        return arrayMove(item, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Dropping a Item over a Column
    if (isActiveAnItem && isOverAColumn) {
      setItems((item) => {
        const activeIndex = item.findIndex((t) => t.id === activeId);

        item[activeIndex].columnId = overId.toString();
        return arrayMove(item, activeIndex, activeIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-sm">
        <SortableContext items={columnsId}>
          {columns.map((column) => (
            <ColumnContainer
              key={column.id}
              column={column}
              items={items.filter((item) => item.columnId === column.id)}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeColumn && (
          <ColumnContainer
            column={activeColumn}
            items={items.filter((item) => item.columnId === activeColumn.id)}
          />
        )}
        {activeItem && (
          <ItemCard
            item={activeItem}
            className="b-2px border-primary bg-bgContainer"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
