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
import type { HvFlowNodeParam } from "../../types";
import Select from "./Select";
import Slider from "./Slider";
import Text from "./Text";

export type ParamRendererProps = {
  params: HvFlowNodeParam[];
  data: any;
};

const renderers = {
  text: Text,
  select: Select,
  slider: Slider,
};

export const ParamRenderer = ({ params, data }: ParamRendererProps) => {
  return (
    <>
      {params.map((param) => {
        const Renderer = renderers[param.type];
        if (!Renderer) return null;

        return <Renderer key={param.id} param={param} data={data} />;
      })}
    </>
  );
};
