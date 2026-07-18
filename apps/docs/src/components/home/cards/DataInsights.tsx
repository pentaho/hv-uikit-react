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
import { HvTypography } from "@hitachivantara/uikit-react-core";

import { Card } from "./Card";

const data = [
  { title: "Complete", value: "75%" },
  { title: "Consistent", value: "81%" },
  { title: "Unique", value: "61%" },
];

export const DataInsights = () => (
  <Card
    title="Powerful Data Insights"
    media={
      <img
        src="https://github.com/user-attachments/assets/3d17a64e-b5f3-4ea8-a66d-bc02a31b92e0"
        alt="Data Quality Monitoring"
      />
    }
  >
    <HvTypography variant="label">Data Quality</HvTypography>
    <div className="mt-xs grid grid-cols-3 gap-sm justify-between">
      {data.map(({ title, value }) => (
        <div key={title}>
          <HvTypography variant="caption1" className="mb-xs">
            {title}
          </HvTypography>
          <HvTypography variant="title2" className="text-primary">
            {value}
          </HvTypography>
        </div>
      ))}
    </div>
  </Card>
);
