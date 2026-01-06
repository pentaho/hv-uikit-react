import { forwardRef, useId, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { css, cx } from "@emotion/css";
import {
  HvInput,
  HvInputProps,
  HvListContainer,
  HvListItem,
  HvListItemProps,
  HvTypography,
  outlineStyles,
  theme,
  useForkRef,
} from "@hitachivantara/uikit-react-core";
import { Drag } from "@hitachivantara/uikit-react-icons";

import { NodeData } from "./Node";
import { iconsMapping, iconsMappingKeys } from "./utils";

const classes = {
  root: css({ display: "flex", flexDirection: "column", gap: theme.space.sm }),
  item: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: `1px solid ${theme.colors.borderSubtle}`,
    borderRadius: "12px",
    backgroundColor: theme.colors.bgContainer,
    padding: theme.space.xs,
    height: "unset",
    "&:focus-visible": {
      ...outlineStyles,
    },
  }),
  itemTitle: css({
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
  }),
  icon: css({
    borderRadius: theme.radii.round,
    backgroundColor: theme.colors.cat6,
  }),
  dragging: css({
    border: `2px solid ${theme.colors.primaryStrong}`,
  }),
};

const items = iconsMappingKeys.map((key, index) => ({
  id: `item${index + 1}`,
  title: `Item ${index + 1}`,
  subtitle: `Description ${index + 1}`,
  icon: key,
}));

interface ItemProps {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface ItemCardProps
  extends Omit<HvListItemProps, "title">,
    Omit<ItemProps, "id"> {
  isDragging?: boolean;
}

const ItemCard = forwardRef<HTMLLIElement, ItemCardProps>(
  ({ icon, title, subtitle, isDragging, ...others }, ref) => {
    return (
      <HvListItem
        ref={ref}
        classes={{ root: cx(classes.item, { [classes.dragging]: isDragging }) }}
        {...others}
      >
        <div className={classes.itemTitle}>
          <div className={classes.icon}>
            {iconsMapping[icon as keyof typeof iconsMapping]}
          </div>
          <HvTypography variant="label">{title}</HvTypography>
        </div>
        <Drag />
      </HvListItem>
    );
  },
);

const DraggableItemCard = ({ icon, title, id, subtitle }: ItemProps) => {
  const itemRef = useRef<HTMLLIElement>(null);

  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id,
      data: {
        // Data needed to be dropped in HvFlow
        hvFlow: {
          // HvFlow will use this value to populate the node's data.nodeLabel
          label: title,
          // Node type from nodeTypes property provided to HvFlow
          type: "node",
          // Item position: used by HvFlow to position the node when dropped
          x: itemRef.current?.getBoundingClientRect().x,
          y: itemRef.current?.getBoundingClientRect().y,
          // Values to be added to the node's data
          data: {
            subtitle,
            color: "cat6",
            icon,
            output: {
              id: "data",
              label: "Data",
            },
            input: {
              id: "data",
              label: "Data",
            },
          } satisfies NodeData,
        },
        // Data needed for the DragOverlay component
        dragOverlay: {
          component: (
            <ItemCard
              icon={icon}
              title={title}
              subtitle={subtitle}
              isDragging
            />
          ),
        },
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const forkedRef = useForkRef(itemRef, setNodeRef);

  return (
    <ItemCard
      ref={forkedRef}
      style={style}
      icon={icon}
      title={title}
      subtitle={subtitle}
      isDragging={isDragging}
      {...attributes}
      {...listeners}
    />
  );
};

export const ListView = () => {
  const [listItems, setListItems] = useState(items);
  const listId = useId();

  const handleSearch: HvInputProps["onChange"] = (event, value) => {
    if (value) {
      setListItems(
        items.filter((item) =>
          item.title.toLowerCase().trim().includes(value.toLowerCase().trim()),
        ),
      );
    } else {
      setListItems(items);
    }
  };

  return (
    <div className={classes.root}>
      <HvInput
        type="search"
        placeholder="Search for a node..."
        aria-controls={listId}
        aria-owns={listId}
        onChange={handleSearch}
        inputProps={{ autoComplete: "off" }}
      />
      <HvListContainer id={listId}>
        {listItems.map((item) => (
          <DraggableItemCard key={item.id} {...item} />
        ))}
      </HvListContainer>
    </div>
  );
};
