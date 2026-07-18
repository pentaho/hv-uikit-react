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
import { css } from "@emotion/css";
import { HvSlider } from "@hitachivantara/uikit-react-core";

import { useFlowNodeUtils } from "../../hooks";
import type { HvFlowNodeSliderParam } from "../../types";

interface SliderProps {
  param: Omit<HvFlowNodeSliderParam, "type">;
  data: any;
}

const classes = {
  labelContainer: css({
    marginRight: 0,
    marginLeft: 0,
  }),
  sliderBase: css({
    padding: 0,
  }),
};

const Slider = ({ param, data }: SliderProps) => {
  const { id } = param;
  const { setNodeData } = useFlowNodeUtils();

  return (
    <HvSlider
      className="nodrag" // Prevents dragging within the input field
      defaultValues={data[id]}
      onChange={(val) => setNodeData((prev) => ({ ...prev, [id]: val }))}
      classes={{
        labelContainer: classes.labelContainer,
        sliderBase: classes.sliderBase,
      }}
      {...param}
    />
  );
};

export default Slider;
