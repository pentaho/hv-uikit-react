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
import {
  MiniMap,
  type GetMiniMapNodeAttribute,
  type MiniMapProps,
} from "reactflow";
import type { ExtractNames } from "@hitachivantara/uikit-react-core";
import { getColor, type HvColorAny } from "@hitachivantara/uikit-styles";

import { staticClasses, useClasses } from "./Minimap.styles";

export { staticClasses as flowMinimapClasses };

export type HvFlowMinimapClasses = ExtractNames<typeof useClasses>;

export interface HvFlowMinimapProps<NodeData = any> extends Omit<
  MiniMapProps<NodeData>,
  "nodeColor" | "nodeStrokeColor" | "maskColor" | "maskStrokeColor"
> {
  /** Node color. */
  nodeColor?: HvColorAny | GetMiniMapNodeAttribute<NodeData>;
  /** Node stroke color. */
  nodeStrokeColor?: HvColorAny | GetMiniMapNodeAttribute<NodeData>;
  /** Mask color. */
  maskColor?: HvColorAny;
  /** Mask stroke color. */
  maskStrokeColor?: HvColorAny;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFlowMinimapClasses;
}

export const HvFlowMinimap = ({
  nodeColor = "border",
  maskColor = "borderSubtle",
  maskStrokeColor = "borderSubtle",
  nodeStrokeColor = "border",
  classes: classesProp,
  className,
  ...others
}: HvFlowMinimapProps) => {
  const { classes, cx } = useClasses(classesProp);

  return (
    <MiniMap
      className={cx(classes.root, className)}
      nodeColor={
        typeof nodeColor === "string"
          ? getColor(nodeColor, "border")
          : nodeColor
      }
      nodeStrokeColor={
        typeof nodeStrokeColor === "string"
          ? getColor(nodeStrokeColor, "border")
          : nodeStrokeColor
      }
      maskColor={getColor(maskColor, "borderSubtle")}
      maskStrokeColor={getColor(maskStrokeColor, "borderSubtle")}
      {...others}
    />
  );
};
