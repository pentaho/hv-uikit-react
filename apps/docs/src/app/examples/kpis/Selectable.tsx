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
import { useId, useState } from "react";
import {
  HvCard,
  HvCardContent,
  HvRadio,
  HvStatusIcon,
  HvTypography,
  type HvColor,
} from "@hitachivantara/uikit-react-core";

const colors = ["positive", "warning", "negative", "info"] satisfies HvColor[];

export default function Demo() {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div className="grid gap-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {colors.map((color, i) => (
        <HvCard
          key={color}
          statusColor={color}
          bgcolor="bgContainer"
          className="cursor-pointer"
          onClick={() => setSelectedIndex(i)}
          selectable
          selected={i === selectedIndex}
        >
          <Kpi
            title="KPI Label"
            value="10 352"
            unit="GB"
            selected={i === selectedIndex}
            onSelect={() => setSelectedIndex(i)}
          />
        </HvCard>
      ))}
    </div>
  );
}

function Kpi({
  title,
  value,
  unit,
  selected,
  onSelect,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
  unit: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  const titleId = useId();

  return (
    <HvCardContent className="grid gap-sm pb-xs!">
      <div className="flex items-center gap-xxs">
        <HvStatusIcon
          size="xs"
          variant="default"
          customIcon={<div className="i-ph-tree-structure" />}
        />
        <span id={titleId}>{title}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-baseline gap-2px">
          <HvTypography variant="title3">{value}</HvTypography>
          <HvTypography variant="caption2" className="text-textSubtle">
            {unit}
          </HvTypography>
        </div>
        <HvRadio
          name="kpi"
          aria-labelledby={titleId}
          checked={selected}
          onClick={onSelect}
        />
      </div>
    </HvCardContent>
  );
}
