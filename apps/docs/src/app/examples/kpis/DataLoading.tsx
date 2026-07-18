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
import useSWR from "swr";
import {
  HvCard,
  HvCardContent,
  HvLoading,
  HvRadio,
  HvRadioGroup,
  HvStatusIcon,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [endpoint, setEndpoint] = useState("1");

  return (
    <div className="grid gap-sm">
      <HvRadioGroup
        orientation="horizontal"
        label="Choose endpoint"
        value={endpoint}
        onChange={(evt, val) => setEndpoint(val)}
      >
        <HvRadio label="Option 1" value="1" />
        <HvRadio label="Option 2" value="2" />
        <HvRadio label="Bad fetch" value="error" />
      </HvRadioGroup>
      <HvCard statusColor="info" bgcolor="bgContainer" className="w-300px">
        <HvCardContent className="grid gap-sm pb-xs! h-90px">
          <KpiData id={endpoint} />
        </HvCardContent>
      </HvCard>
    </div>
  );
}

function KpiData({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR(id, fetchData);

  if (isLoading) {
    return <HvLoading small label="Loading data..." className="flex-row" />;
  }

  if (error) {
    return (
      <div className="flex gap-xs items-center justify-center text-negative">
        <HvStatusIcon variant="error" />
        <HvTypography>{error.message}</HvTypography>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-xxs">
        <HvStatusIcon size="xs" variant="info" />
        <span>{data?.title}</span>
      </div>
      <div className="flex items-baseline gap-2px">
        <HvTypography variant="title3">{data?.value}</HvTypography>
        <HvTypography variant="caption2" className="text-textSubtle">
          {data?.unit}
        </HvTypography>
      </div>
    </>
  );
}

function fetchData(id: string) {
  interface Data {
    title: string;
    value: number;
    unit: string;
  }

  return new Promise<Data>((resolve, reject) => {
    setTimeout(() => {
      if (Number.isNaN(Number(id))) {
        reject(new Error("Error fetching data"));
        return;
      }

      resolve({
        title: `Title ${id}`,
        value: Number.parseInt(id.repeat(6), 8) % 10 ** 5,
        unit: "GB",
      });
    }, 4000);
  });
}
