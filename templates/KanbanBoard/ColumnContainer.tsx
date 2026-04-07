import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  HvIconButton,
  HvStack,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Add } from "@hitachivantara/uikit-react-icons";

import classes from "./styles";
import { TaskCard } from "./TaskCard";
import type { Column, Task } from "./types";

interface ColumnProps {
  column: Column;
  tasks?: Task[];
  addTask?: (columnId: string) => void;
  deleteTask?: (taskId: string) => void;
  addEnabled?: boolean;
}

export const ColumnContainer = ({
  column,
  tasks,
  addTask,
  deleteTask,
  addEnabled = true,
}: ColumnProps) => {
  const tasksIds = useMemo(() => tasks?.map((task) => task.id), [tasks]) || [];

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
        ...(isDragging && {
          opacity: 0.2,
        }),
      }}
      className={classes.columnContainer}
    >
      <div className={classes.column}>
        <div className={classes.columnHeader} {...attributes} {...listeners}>
          <div className={classes.columnTitle}>
            {column.icon}
            <HvTypography variant="title3">{column.title}</HvTypography>
            <div className={classes.count}>{tasks?.length}</div>
          </div>
          <HvIconButton
            title="Add"
            variant="primarySubtle"
            onClick={() => addTask?.(column.id)}
            disabled={!addEnabled}
          >
            <Add />
          </HvIconButton>
        </div>
        <HvStack direction="column" spacing="md">
          <SortableContext items={tasksIds}>
            {tasks &&
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  color={column.color}
                  deleteTask={deleteTask}
                />
              ))}
          </SortableContext>
        </HvStack>
      </div>
    </div>
  );
};
