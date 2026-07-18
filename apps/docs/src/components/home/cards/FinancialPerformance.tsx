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

interface ItemProps {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean | null;
}

const data = [
  { title: "MRR", value: "$500K", percentage: "5.0", isPositive: true },
  { title: "OpEx", value: "$320K", percentage: "8.5", isPositive: false },
  { title: "GPM", value: "48.3%", percentage: "2.1", isPositive: true },
  { title: "NPM", value: "12.5%", percentage: "0.8", isPositive: true },
];

const Item = ({ title, value, percentage, isPositive }: ItemProps) => {
  const percentageColor = isPositive ? "text-positive" : "text-negative";

  return (
    <div>
      <div className="flex items-center gap-4px">
        <HvTypography variant="caption1">{title}</HvTypography>
        {isPositive && <div className="i-ph-arrow-up text-positive" />}
        {!isPositive && <div className="i-ph-arrow-down text-negative" />}
        <HvTypography className={percentageColor}>{percentage}%</HvTypography>
      </div>
      <HvTypography variant="title2">{value}</HvTypography>
    </div>
  );
};

export const FinancialPerformance = () => {
  return (
    <Card
      title="Financial Performance"
      subtitle="Company’s KPIs from the last 12 months."
    >
      <div className="grid grid-cols-2 gap-xs justify-between">
        {data.map((value) => (
          <Item key={value.title} {...value} />
        ))}
      </div>
    </Card>
  );
};
