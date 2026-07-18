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
import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  HvActionBar,
  HvAvatar,
  HvAvatarGroup,
  HvButton,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvIconButton,
  HvOverflowTooltip,
  HvStack,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  Add,
  Delete,
  Level0Good,
  Level1,
  Level3Bad,
  Level4,
  Level5,
} from "@hitachivantara/uikit-react-icons";

import type { Column, Task } from "./types";

interface TaskProps {
  task: Task;
  color?: Column["color"];
  deleteTask?: (taskId: string) => void;
}

const getStatusIcon = (statusLevel?: number) => {
  switch (statusLevel) {
    case 1:
      return <Level1 color="info" />;
    case 2:
      return <Level3Bad color="warningStrong" />;
    case 3:
      return <Level4 color="negativeStrong" />;
    case 4:
      return <Level5 color="negativeStrong" />;
    case 5:
      return <Level0Good color="positive" />;
    default:
      return null;
  }
};

const getStatusColor = (statusLevel?: number) => {
  switch (statusLevel) {
    case 1:
      return "positive";
    case 2:
      return "warning";
    case 3:
      return "negative";
    case 4:
      return "negativeDeep";
    default:
      return "info";
  }
};

interface ColumnProps {
  column: Column;
  tasks?: Task[];
  addTask?: (columnId: string) => void;
  deleteTask?: (taskId: string) => void;
  addEnabled?: boolean;
}

export const TaskCard = ({ task, deleteTask }: TaskProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

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
      {...attributes}
      {...listeners}
    >
      <HvCard
        bgcolor="bgContainer"
        classes={{
          root: "border-rounded-round",
          semanticBar: "h-20px border-rounded-round top--2px",
        }}
        statusColor={getStatusColor(task.statusLevel)}
      >
        <HvCardHeader
          title={
            <>
              <HvTypography variant="title3">{task.title}</HvTypography>
              <HvTypography variant="caption2">Some time ago</HvTypography>
            </>
          }
          className="hover:cursor-grab bg-bgContainer z-200"
          icon={getStatusIcon(task.statusLevel)}
        />
        <HvCardContent>
          <HvOverflowTooltip
            paragraphOverflow
            data={
              <HvTypography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                vitae ex sem. Ut posuere nibh risus, vel pellentesque elit
                varius sed. Etiam eleifend consequat tortor, ac ultrices nunc
                viverra pretium. Praesent rutrum congue justo fermentum varius.
                Aenean malesuada magna ut purus tincidunt tempor. Quisque urna
                erat, finibus quis mi vitae, vehicula gravida dui. In vitae
                elementum felis, sed interdum nunc. Integer varius nibh ac
                congue rutrum. Pellentesque vel auctor risus. Cras quis
                sollicitudin odio.
              </HvTypography>
            }
          />
          <HvButton
            icon
            onClick={() => deleteTask?.(task.id)}
            classes={{ root: "absolute top-xs right-xs" }}
          >
            <Delete />
          </HvButton>
        </HvCardContent>
        <HvActionBar classes={{ root: "b-t-0" }}>
          {task.users ? (
            <HvAvatarGroup size="xs" maxVisible={2} highlight>
              {task.users.map((user) => (
                <HvAvatar key={user.name} alt={user.name} src={user.avatar} />
              ))}
            </HvAvatarGroup>
          ) : (
            <HvButton variant="primaryGhost">Assign</HvButton>
          )}
          <div style={{ flex: 1 }} />
        </HvActionBar>
      </HvCard>
    </div>
  );
};

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
      className="w-full"
    >
      <div className="flex flex-col py-sm px-xs b-1 border-border border-rounded-large bg-bgPage">
        <div
          className="flex flex-row justify-between items-center mb-lg py-0 px-xs hover:cursor-grab"
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center gap-xs">
            <HvTypography variant="title3">{column.title}</HvTypography>
            <div className="border-rounded-round w-20px h-20px place-items-center grid bg-bgHover">
              {tasks?.length}
            </div>
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
