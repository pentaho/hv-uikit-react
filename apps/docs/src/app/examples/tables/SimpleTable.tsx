import { useMemo, useState } from "react";
import {
  HvIconButton,
  HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";
import { Delete } from "@hitachivantara/uikit-react-icons";

import { makeData, type AssetEvent } from "./makeData";
import { MyTable } from "./MyTable";

export default function Demo() {
  const [data] = useState(() => makeData(8));
  const columns = useMemo<HvTableColumnConfig<AssetEvent>[]>(
    () => [
      { Header: "Title", accessor: "name", style: { minWidth: 120 } },
      { Header: "Time", accessor: "createdDate", style: { minWidth: 100 } },
      { Header: "Event Type", accessor: "eventType", style: { minWidth: 100 } },
      { Header: "Status", accessor: "status", style: { minWidth: 100 } },
      {
        Header: "Probability",
        accessor: "riskScore",
        align: "right",
        Cell: ({ value }) => `${value}%`,
      },
      { Header: "Severity", accessor: "severity" },
      { Header: "Priority", accessor: "priority" },
      {
        id: "delete",
        variant: "actions",
        Cell: () => (
          <HvIconButton title="Delete">
            <Delete />
          </HvIconButton>
        ),
      },
    ],
    [],
  );

  return <MyTable<AssetEvent> data={data} columns={columns} />;
}
