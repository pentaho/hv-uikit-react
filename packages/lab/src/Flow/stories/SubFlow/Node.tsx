import { useEffect, useMemo, useState } from "react";
import { css, cx } from "@emotion/css";
import type { NodeProps as ReactFlowNodeProps } from "reactflow";
import { theme } from "@hitachivantara/uikit-react-core";
import {
  useFlowNodeIntersections,
  useHvNode,
} from "@hitachivantara/uikit-react-lab";

import { FactTable } from "./FactTable";
import { Level, type HierarchyData } from "./Level";

const classes = {
  root: css({
    width: 250,
    maxHeight: 300,
    overflow: "auto",
    borderRadius: "16px",
    boxShadow: theme.colors.shadow,
  }),
  levelRoot: css({
    boxShadow: theme.colors.shadow,
    borderWidth: 0,
  }),
  levelHeader: css({
    padding: theme.spacing("xxs", "xs"),
    boxShadow: theme.colors.shadow,
    borderWidth: 0,
  }),
};

const renderItem = ({
  label,
  children,
  type,
  id,
  ...others
}: HierarchyData) => {
  if (type === "level") {
    return (
      <Level title={label} {...others} key={id} id={id}>
        {children?.map(renderItem)}
      </Level>
    );
  }

  return (
    <FactTable title={label} {...others} key={id} id={id}>
      {children?.map(renderItem)}
    </FactTable>
  );
};

interface NodeProps extends ReactFlowNodeProps {
  groupId: string;
  hierarchyData: HierarchyData[];
}

export const Node = ({ id: idProp, groupId, hierarchyData }: NodeProps) => {
  const { title, icon, id, node, setNodeParent } = useHvNode({
    id: idProp,
    groupId,
  });

  const intersections = useFlowNodeIntersections(id);

  /** this variable is used to only run the logic when the dragging has stopped by saving the previous state */
  const [draggingFlag, setDraggingFlag] = useState(false);

  const sublevels = useMemo(
    () => hierarchyData.map((level) => renderItem(level)),
    [hierarchyData],
  );

  useEffect(() => {
    if (!node) return;
    /** when node was still (draggingFlag == false) and dragging has started change the flag to true */
    if (node.dragging && !draggingFlag) {
      setDraggingFlag(true);
    }
    /**  when node was being dragged (draggingFlag == true) and has stopped run logic to check intersections */
    if (!node.dragging && draggingFlag) {
      const groupIntersections = intersections.filter(
        (n) => n.type === "group" && n.id !== node.parentId,
      );
      if (Array.isArray(groupIntersections) && groupIntersections.length >= 1)
        groupIntersections.forEach((elem) => setNodeParent(elem));
      else {
        setNodeParent();
      }
      setDraggingFlag(false);
    }
  }, [draggingFlag, intersections, node, setNodeParent]);

  return (
    <div className={cx("nowheel", classes.root)}>
      <Level
        id={id}
        title={title}
        icon={icon}
        actions={[]}
        classes={{
          root: classes.levelRoot,
          header: classes.levelHeader,
        }}
        collapsible
      >
        {sublevels}
      </Level>
    </div>
  );
};
