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
  HvCard,
  HvCardContent,
  HvStatusIcon,
  HvTypography,
  type HvColor,
} from "@hitachivantara/uikit-react-core";

const colors = ["positive", "warning", "negative", "info"] satisfies HvColor[];

export default function Demo() {
  return (
    <div className="grid gap-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {colors.map((color) => (
        <HvCard
          key={color}
          statusColor={color}
          bgcolor="bgContainer"
          icon={
            <HvStatusIcon
              variant={colorVariantMap[color]}
              type="simple"
              weight="duotone"
            />
          }
        >
          <Kpi title="KPI Label" value="10 352" unit="GB" />
        </HvCard>
      ))}
    </div>
  );
}

function Kpi({
  title,
  value,
  unit,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
  unit: React.ReactNode;
}) {
  return (
    <HvCardContent className="grid gap-sm pb-xs!">
      <div className="flex items-center gap-xxs">
        <HvStatusIcon
          size="xs"
          variant="default"
          customIcon={<div className="i-ph-tree-structure" />}
        />
        <span>{title}</span>
      </div>
      <div className="flex items-baseline gap-2px">
        <HvTypography variant="title3">{value}</HvTypography>
        <HvTypography variant="caption2" className="text-textSubtle">
          {unit}
        </HvTypography>
      </div>
    </HvCardContent>
  );
}

const colorVariantMap = {
  positive: "success",
  warning: "warning",
  negative: "error",
  info: "info",
} as const;
