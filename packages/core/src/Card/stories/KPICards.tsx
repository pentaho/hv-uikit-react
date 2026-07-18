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
import { useState } from "react";
import {
  HvActionBar,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCheckBox,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  Level1,
  Level2Average,
  Level3Bad,
  Tool,
} from "@hitachivantara/uikit-react-icons";

const data = {
  firstTitle: "Related assets",
  firstContent: "Primary asset to be worked on, other asset, other asset",
  secondTitle: "Description",
  secondContent:
    "Shaft may be bent, check for bends. Straighten if possible and replace shaft if necessary.",
};

const CardContent = ({
  value,
  icon,
}: {
  value: string;
  icon: React.ReactNode;
}) => (
  <HvCardContent className="grid gap-sm">
    <div>
      <HvTypography variant="label">Confidence score</HvTypography>
      <div className="flex items-center gap-xs">
        <span>{icon}</span>
        <HvTypography variant="title1">{value}%</HvTypography>
      </div>
    </div>
    <div>
      <HvTypography variant="label">{data.firstTitle}</HvTypography>
      <HvTypography>{data.firstContent}</HvTypography>
    </div>
    <div>
      <HvTypography variant="label">{data.secondTitle}</HvTypography>
      <HvTypography>{data.secondContent}</HvTypography>
    </div>
  </HvCardContent>
);

export const KPICards = () => {
  const [checked, setChecked] = useState(0);

  const renderFooter = ({ n, value }: { n: number; value: string }) => (
    <HvActionBar>
      <HvCheckBox
        onChange={() => setChecked(n)}
        checked={checked === n}
        value="value"
        inputProps={{
          "aria-label": `Tick to select the replace contaminated oil card with confidence score of ${value}%`,
        }}
      />
      <div style={{ flex: 1 }} />
    </HvActionBar>
  );

  return (
    <div className="grid gap-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <HvCard
        bgcolor="bgContainer"
        statusColor="info"
        selectable
        selected={checked === 1}
      >
        <HvCardHeader title="Replace contaminated oil" icon={<Tool />} />
        <CardContent value="85" icon={<Level1 color="info" />} />
        {renderFooter({ n: 1, value: "85" })}
      </HvCard>
      <HvCard
        bgcolor="bgContainer"
        statusColor="warning"
        selectable
        selected={checked === 2}
      >
        <HvCardHeader title="Replace contaminated oil" icon={<Tool />} />
        <CardContent value="45" icon={<Level2Average color="warning" />} />
        {renderFooter({ n: 2, value: "84" })}
      </HvCard>
      <HvCard
        bgcolor="bgContainer"
        statusColor="negative"
        selectable
        selected={checked === 3}
      >
        <HvCardHeader title="Replace contaminated oil" icon={<Tool />} />
        <CardContent value="19" icon={<Level3Bad color="negative" />} />
        {renderFooter({ n: 3, value: "19" })}
      </HvCard>
    </div>
  );
};
