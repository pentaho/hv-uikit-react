import { css, cx } from "@emotion/css";
import {
  Handle,
  NodeToolbar,
  Position,
  type NodeProps as ReactFlowNodeProps,
} from "reactflow";
import { HvIconButton, HvTypography } from "@hitachivantara/uikit-react-core";
import { Level0Good } from "@hitachivantara/uikit-react-icons";
import {
  useFlowNodeEdges,
  useHvNode,
  type HvFlowNodeInput,
  type HvFlowNodeOutput,
} from "@hitachivantara/uikit-react-lab";
import { mergeStyles } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

const classes = {
  root: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    backgroundColor: theme.colors.bgContainer,
    boxShadow: theme.colors.shadow,
    borderWidth: "1px",
    minWidth: "200px",
    minHeight: "100px",
    borderColor: "var(--color)",
  }),
  content: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing("sm"),
    gap: theme.space.xs,
  }),
  cornerIcon: css({
    position: "absolute",
    top: -8,
    right: -8,
  }),
  contentIcon: css({
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radii.round,
    backgroundColor: "var(--color)",
  }),
  nodeToolbar: css({
    backgroundColor: theme.colors.bgContainer,
    borderRadius: theme.radii.full,
  }),
  handle: css({
    backgroundColor: theme.colors.textSubtle,
    border: `1px solid ${theme.colors.bgContainer}`,
    height: 8,
    width: 8,
  }),
};

interface NodeProps extends ReactFlowNodeProps {
  groupId: string;
  input?: HvFlowNodeInput;
  output?: HvFlowNodeOutput;
}

export const Node = ({ id, groupId = "teapot", input, output }: NodeProps) => {
  const {
    toggleShowActions,
    getNodeToolbarProps,
    handleDefaultAction,
    nodeActions,
    title,
    icon,
    color,
    subtitle,
  } = useHvNode({
    id,
    groupId,
    inputs: input ? [input] : undefined,
    outputs: output ? [output] : undefined,
  });

  const edges = useFlowNodeEdges();

  return (
    <div
      style={mergeStyles(undefined, {
        "--color": color,
      })}
      className={cx("nowheel", classes.root)}
      onMouseEnter={toggleShowActions}
      onMouseLeave={toggleShowActions}
    >
      <NodeToolbar className={classes.nodeToolbar} {...getNodeToolbarProps()}>
        {nodeActions?.map((action) => (
          <HvIconButton
            key={action.id}
            title={action.label}
            onClick={() => handleDefaultAction(action)}
          >
            {action.icon as React.ReactNode}
          </HvIconButton>
        ))}
      </NodeToolbar>
      {edges.length > 0 && (
        <div className={classes.cornerIcon}>
          <Level0Good color="positive" />
        </div>
      )}
      {input && (
        <Handle
          className={classes.handle}
          type="target"
          position={Position.Left}
          id={input.id ?? "0"}
        />
      )}
      {output && (
        <Handle
          className={classes.handle}
          type="source"
          position={Position.Right}
          id={output.id ?? "0"}
        />
      )}
      <div className={classes.content}>
        <div
          className={cx(classes.contentIcon, css({ backgroundColor: color }))}
        >
          {icon}
        </div>
        <div>
          <HvTypography variant="title4" component="h2">
            {title}
          </HvTypography>
          <HvTypography variant="caption1">{subtitle}</HvTypography>
        </div>
      </div>
    </div>
  );
};
