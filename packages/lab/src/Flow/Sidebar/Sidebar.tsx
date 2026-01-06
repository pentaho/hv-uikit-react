import { useEffect, useMemo, useState } from "react";
import {
  DndContextProps,
  DragOverlay,
  DragOverlayProps,
  useDndMonitor,
  useDroppable,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  ExtractNames,
  HvDrawer,
  HvDrawerProps,
  HvInput,
  HvTypography,
  useLabels,
  useUniqueId,
} from "@hitachivantara/uikit-react-core";
import { Add } from "@hitachivantara/uikit-react-icons";

import { useFlowContext } from "../hooks";
import { HvFlowNodeGroups } from "../types";
import { staticClasses, useClasses } from "./Sidebar.styles";
import { HvFlowSidebarGroup } from "./SidebarGroup";
import {
  HvFlowDraggableSidebarGroupItem,
  HvFlowSidebarGroupItem,
} from "./SidebarGroup/SidebarGroupItem";

export { staticClasses as flowSidebarClasses };

export type HvFlowSidebarClasses = ExtractNames<typeof useClasses>;

export interface HvFlowSidebarProps
  extends Omit<HvDrawerProps, "classes" | "title"> {
  /** Sidebar title. */
  title?: string;
  /** Sidebar description. */
  description?: string;
  /** Flatten sidebar items */
  flatten?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFlowSidebarClasses;
  /** Labels used on the sidebar. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /**
   * Dnd Kit drag overlay props for customization.
   *
   * More information can be found in the [Dnd Kit documentation](https://docs.dndkit.com/api-documentation/draggable/drag-overlay).
   */
  dragOverlayProps?: DragOverlayProps;
}

const DEFAULT_LABELS = {
  itemAriaRoleDescription: "Draggable",
  expandGroupButtonAriaLabel: "Expand group",
  searchPlaceholder: "Search node...",
  searchAriaLabel: "Search node...",
};

export const HvFlowSidebar = ({
  id,
  title,
  description,
  anchor = "right",
  buttonTitle = "Close",
  flatten = false,
  classes: classesProp,
  labels: labelsProps,
  dragOverlayProps,
  ...others
}: HvFlowSidebarProps) => {
  const { classes } = useClasses(classesProp);

  const { nodeGroups, setExpandedNodeGroups } = useFlowContext();

  const [filterValue, setFilterValue] = useState("");
  const [draggingLabel, setDraggingLabel] = useState<string>();

  const labels = useLabels(DEFAULT_LABELS, labelsProps);

  const drawerElementId = useUniqueId(id);
  const groupsElementId = useUniqueId();

  // The sidebar is droppable to distinguish between the canvas and the sidebar
  // Otherwise items dropped inside the sidebar will be added to the canvas
  const { setNodeRef } = useDroppable({ id: drawerElementId });

  const handleDragStart: DndContextProps["onDragStart"] = (event) => {
    if (event.active.data.current?.hvFlow) {
      setDraggingLabel(event.active.data.current.hvFlow?.label);
    }
  };

  const handleDragEnd: DndContextProps["onDragEnd"] = () => {
    setDraggingLabel(undefined);
  };

  useDndMonitor({
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
  });

  const filteredGroups = useMemo(() => {
    if (!filterValue || !nodeGroups) return nodeGroups || {};

    return filterValue
      ? Object.entries(nodeGroups).reduce<HvFlowNodeGroups>(
          (acc, [groupId, group]) => {
            // Filter items by search
            const filteredItems = (group.items || []).filter((item) =>
              item.label.toLowerCase().includes(filterValue.toLowerCase()),
            );
            const itemsCount = Object.keys(filteredItems).length;

            // Only show groups with nodes
            if (itemsCount > 0) {
              acc[groupId] = {
                ...group,
                items: filteredItems,
              };
            }

            return acc;
          },
          {},
        )
      : nodeGroups;
  }, [filterValue, nodeGroups]);

  useEffect(() => {
    setExpandedNodeGroups?.(filterValue ? Object.keys(filteredGroups) : []);
  }, [filterValue, filteredGroups, setExpandedNodeGroups]);

  return (
    <HvDrawer
      BackdropComponent={undefined}
      variant="persistent"
      classes={{
        paper: classes.drawerPaper,
      }}
      hideBackdrop
      anchor={anchor}
      buttonTitle={buttonTitle}
      {...others}
    >
      <div id={drawerElementId} ref={setNodeRef}>
        <div className={classes.titleContainer}>
          <Add />
          <HvTypography component="p" variant="title3">
            {title}
          </HvTypography>
        </div>
        <div className={classes.contentContainer}>
          <HvTypography className={classes.description}>
            {description}
          </HvTypography>
          <HvInput
            className={classes.searchRoot}
            type="search"
            placeholder={labels?.searchPlaceholder}
            aria-label={labels?.searchAriaLabel}
            aria-controls={groupsElementId}
            aria-owns={groupsElementId}
            onChange={(evt, val) => setFilterValue(val.trim())}
            inputProps={{ autoComplete: "off" }}
          />
          <ul id={groupsElementId} className={classes.groupsContainer}>
            {Object.entries(filteredGroups).map(([groupId, group]) => {
              if (flatten) {
                return (group.items || []).map((item, i) => (
                  <HvFlowDraggableSidebarGroupItem
                    key={`${item.nodeType}-${i}`}
                    aria-roledescription={labels?.itemAriaRoleDescription}
                    {...item}
                  />
                ));
              }

              return (
                <HvFlowSidebarGroup
                  key={groupId}
                  id={groupId}
                  expandButtonProps={{
                    "aria-label": labels?.expandGroupButtonAriaLabel,
                  }}
                  itemProps={{
                    "aria-roledescription": labels?.itemAriaRoleDescription,
                  }}
                  {...group}
                />
              );
            })}
          </ul>
        </div>
      </div>
      <DragOverlay modifiers={[restrictToWindowEdges]} {...dragOverlayProps}>
        {draggingLabel ? (
          <HvFlowSidebarGroupItem label={draggingLabel} isDragging />
        ) : null}
      </DragOverlay>
    </HvDrawer>
  );
};
