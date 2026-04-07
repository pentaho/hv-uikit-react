import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  HvActionBar,
  HvAvatar,
  HvAvatarGroup,
  HvButton,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvOverflowTooltip,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  Delete,
  Level0Good,
  Level1,
  Level3Bad,
  Level4,
  Level5,
} from "@hitachivantara/uikit-react-icons";

import classes from "./styles";
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
      return <Level5 color="negativeDeep" />;
    case 5:
      return <Level0Good color="positive" />;
    default:
      return null;
  }
};

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
        classes={{ root: classes.card, semanticBar: classes.cardSemanticBar }}
      >
        <HvCardHeader
          title={
            <>
              <HvTypography variant="caption2">Some time ago</HvTypography>
              <HvTypography variant="title3">{task.title}</HvTypography>
            </>
          }
          className={classes.cardHeader}
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
            classes={{ root: classes.cardDeleteIcon }}
          >
            <Delete />
          </HvButton>
        </HvCardContent>
        <HvActionBar classes={{ root: classes.cardActions }}>
          {task.users ? (
            <HvAvatarGroup size="xs" maxVisible={2}>
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
