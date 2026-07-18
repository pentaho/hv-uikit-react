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
import { useMemo } from "react";
import type ColumnTable from "arquero/dist/types/table/column-table";
import {
  HvCard,
  HvLoading,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

interface KpiProps {
  loading: boolean;
  aggregation?: string;
  title?: string;
  measure?: string;
  data?: ColumnTable;
  unit?: string;
}

export const Kpi = ({
  loading,
  title,
  data,
  measure,
  unit,
  aggregation,
}: KpiProps) => {
  const count = useMemo(() => {
    if (data && measure && aggregation) {
      const tb = data.rollup({ total: `${aggregation}(d["${measure}"])` });

      return tb.get("total");
    }
  }, [aggregation, data, measure]);

  return (
    <HvCard className="w-full" bgcolor="bgContainer">
      {loading ? (
        <div className="flex items-center justify-center h-full p-sm">
          <HvLoading small />
        </div>
      ) : (
        <div className="flex flex-col flex-wrap p-sm break-words">
          <HvTypography className="pr-sm pb-xs" variant="label">
            {title}
          </HvTypography>
          {count != null && (
            <HvTypography variant="title2">
              {unit} {count}
            </HvTypography>
          )}
        </div>
      )}
    </HvCard>
  );
};
