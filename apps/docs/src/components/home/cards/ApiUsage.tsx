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
"use client";

import { HvLineChart } from "@hitachivantara/uikit-react-viz";

import { Card } from "./Card";

export const ApiUsage = () => {
  return (
    <Card
      title="API Usage and Latency"
      subtitle="Overview of API call success rates and average response times."
    >
      <HvLineChart
        height={130}
        data={{
          Date: [
            "01 Sep",
            "05 Sep",
            "10 Sep",
            "15 Sep",
            "20 Sep",
            "25 Sep",
            "30 Sep",
          ],
          SuccessRate: [98, 97, 99, 95, 96, 94, 99],
          AvgLatency: [200, 210, 180, 230, 220, 250, 190], // in milliseconds
        }}
        groupBy="Date"
        measures={["SuccessRate", "AvgLatency"]}
        onOptionChange={(option) => {
          option.legend = {
            show: false,
          };
          option.grid = {
            top: 10,
            right: 0,
            bottom: 0,
            left: 0,
          };
          option.yAxis[0] = {
            ...option.yAxis[0],
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          };
          return option;
        }}
      />
    </Card>
  );
};
