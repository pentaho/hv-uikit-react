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
import { HvInput } from "@hitachivantara/uikit-react-core";

import { useFlowNodeUtils } from "../../hooks";
import type { HvFlowNodeTextParam } from "../../types";

interface TextProps {
  param: Omit<HvFlowNodeTextParam, "type">;
  data: any;
}

const Text = ({ param, data }: TextProps) => {
  const { id, label } = param;
  const { setNodeData } = useFlowNodeUtils();

  return (
    <HvInput
      className="nodrag" // Prevents dragging within the input field
      label={label}
      defaultValue={data[id]}
      onChange={(evt, val) => setNodeData((prev) => ({ ...prev, [id]: val }))}
    />
  );
};

export default Text;
