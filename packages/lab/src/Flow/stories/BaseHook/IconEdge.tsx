import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";
import { Level0Good } from "@hitachivantara/uikit-react-icons";

export const CustomEdge = (props: EdgeProps) => {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition } =
    props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge {...props} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
        >
          <Level0Good color="positive" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
