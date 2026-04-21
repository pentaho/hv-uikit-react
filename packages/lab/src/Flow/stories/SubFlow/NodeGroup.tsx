import { useEffect, useState } from "react";
import { css, cx } from "@emotion/css";
import {
  NodeResizeControl,
  NodeResizer,
  type NodeProps as ReactFlowNodeProps,
} from "reactflow";
import {
  HvDropDownMenu,
  HvTypography,
  theme,
  type HvListValue,
} from "@hitachivantara/uikit-react-core";
import { Fullscreen } from "@hitachivantara/uikit-react-icons";
import { useHvNode } from "@hitachivantara/uikit-react-lab";

const dashedBorder = `1px dashed ${theme.colors.border}`;
const containerBorderRadius = "0 16px 16px 16px";
const minWidth = 300;
const minHeight = 200;

const classes = {
  root: css({
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.bgContainer,
    borderRadius: containerBorderRadius,
    minWidth,
    minHeight,
    border: `1px solid transparent`,
  }),
  content: css({
    display: "flex",
    borderRadius: containerBorderRadius,
    backgroundColor: theme.colors.primaryDimmed,
    width: "100%",
    border: dashedBorder,
  }),
  header: css({
    display: "flex",
    width: "100%",
    height: "100%",
    padding: theme.spacing("2px", "xs", "2px", "xs"),
    borderRadius: "16px 16px 0 0",
    border: dashedBorder,
    borderBottom: "none",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryDimmed,
  }),
  headerBackground: css({
    display: "flex",
    position: "absolute",
    top: "-34px",
    backgroundColor: theme.colors.bgContainer,
    borderRadius: "16px 16px 0 0",
    borderBottom: "none",
  }),
  title: css({
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  actions: css({
    marginLeft: "auto",
  }),
  nodeResizeIcon: css({
    position: "relative",
    left: -50,
    bottom: -20,
    display: "inline-block",
    border: dashedBorder,
    borderRadius: theme.radii.round,
  }),
  nodeResizeLine: {
    borderColor: "transparent",
    borderRadius: containerBorderRadius,
  },
};

interface NodeProps extends ReactFlowNodeProps {
  groupId: string;
  actions?: HvListValue[];
}

export const NodeGroup = ({ id: idProp, groupId, actions = [] }: NodeProps) => {
  const { title, icon, id, node, intersections, setNodeParent } = useHvNode({
    id: idProp,
    groupId,
  });

  /** this variable is used to only run the logic when the dragging has stopped by saving the previous state */
  const [draggingFlag, setDraggingFlag] = useState(false);

  useEffect(() => {
    if (!node) return;
    if (node.dragging && !draggingFlag) {
      /** when node was still (draggingFlag == false)
       * and dragging has started change the flag to true */
      setDraggingFlag(true);
    }
    if (!node.dragging && draggingFlag) {
      /**  when node was being dragged (draggingFlag == true)
       * and has stopped run logic to check intersections */
      const groupIntersections = intersections.filter(
        (n) => n.type === "group" && n.id !== node.parentId,
      );
      if (Array.isArray(groupIntersections) && groupIntersections.length >= 1)
        setNodeParent(groupIntersections[groupIntersections.length - 1]);
      setDraggingFlag(false);
    }
  }, [draggingFlag, intersections, node, setNodeParent]);

  return (
    <div id={id} className={cx("nowheel", classes.root)}>
      <NodeResizer
        lineStyle={classes.nodeResizeLine}
        minWidth={minWidth}
        minHeight={minHeight}
      />
      <NodeResizeControl position="top-right" minWidth={300} minHeight={200}>
        <div className={classes.nodeResizeIcon}>
          <Fullscreen />
        </div>
      </NodeResizeControl>
      <div
        className={cx(classes.headerBackground, css({ zIndex: node?.zIndex }))}
      >
        <div className={classes.header}>
          {icon}
          <HvTypography
            variant="title4"
            component="p"
            className={classes.title}
          >
            {title}
          </HvTypography>
          {actions && (
            <HvDropDownMenu
              dataList={actions}
              classes={{ root: classes.actions }}
            />
          )}
        </div>
      </div>
      <div className={classes.content} />
    </div>
  );
};
