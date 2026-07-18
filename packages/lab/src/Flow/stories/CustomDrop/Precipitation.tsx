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
import { HvFlowNode, type HvFlowNodeFC } from "@hitachivantara/uikit-react-lab";

import { data } from "./data";

export const Precipitation: HvFlowNodeFC = (props) => {
  return (
    <HvFlowNode
      description="Precipitation data"
      groupId="sources"
      expanded
      params={[
        {
          id: "country",
          label: "Country",
          type: "select",
          options: Object.keys(data).map((key) => ({
            id: key,
            label: key,
          })),
        },
      ]}
      outputs={[
        {
          label: "Data",
          isMandatory: true,
          provides: "data",
        },
      ]}
      {...props}
    />
  );
};
