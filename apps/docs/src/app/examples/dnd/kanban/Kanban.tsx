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
import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import { ColumnContainer, TaskCard } from "./Components";
import { defaultColumns, defaultTasks } from "./data";
import type { Column, Task } from "./types";

export default function Demo() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
  );

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [creatingTask, setCreatingTask] = useState<boolean>(false);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

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
    console.log(active, over);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((ts) => {
        const activeIndex = ts.findIndex((t) => t.id === activeId);
        const overIndex = ts.findIndex((t) => t.id === overId);

        if (ts[activeIndex].columnId !== ts[overIndex].columnId) {
          ts[activeIndex].columnId = ts[overIndex].columnId;
          return arrayMove(ts, activeIndex, overIndex - 1);
        }

        return arrayMove(ts, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Dropping a Task over a Column
    if (isActiveATask && isOverAColumn) {
      setTasks((ts) => {
        const activeIndex = ts.findIndex((t) => t.id === activeId);

        ts[activeIndex].columnId = overId.toString();
        return arrayMove(ts, activeIndex, activeIndex);
      });
    }
  };

  const addTask = async (columnId: string) => {
    try {
      setCreatingTask(true);

      const highestId = tasks.reduce((acc, task) => {
        const taskId = Number.parseInt(task.id.replace("task", ""), 10);
        return taskId > acc ? taskId : acc;
      }, 0);

      setTasks((ts) => [
        ...ts,
        {
          id: `task${highestId + 1}`,
          columnId,
          title: `Task ${highestId + 1}`,
        },
      ]);
    } finally {
      setCreatingTask(false);
    }
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  };

  return (
    <div className="mt-md">
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
                tasks={tasks.filter((task) => task.columnId === column.id)}
                addTask={addTask}
                deleteTask={deleteTask}
                addEnabled={!creatingTask}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            />
          )}
          {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
