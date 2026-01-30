import { useMemo, useState } from "react";
import {
  HvCellProps,
  HvIconButton,
  HvStatusIcon,
  HvTableColumnConfig,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Delete } from "@hitachivantara/uikit-react-icons";

import { makeData, type AssetEvent } from "./makeData";
import { MyTable } from "./MyTable";

export default function Demo() {
  const [data] = useState(() => makeData(8));
  const columns = useMemo<HvTableColumnConfig<AssetEvent>[]>(
    () => [
      {
        Header: "Id",
        accessor: "id",
        Cell: ({ value }) => (
          <HvTypography link component="a" href="#">
            {value}
          </HvTypography>
        ),
      },
      {
        Header: "Title",
        accessor: "name",
        style: { minWidth: 120 },
        Cell: TitleDescription,
      },
      { Header: "Time", accessor: "createdDate", style: { minWidth: 100 } },
      {
        Header: "Event Type",
        accessor: "eventType",
        style: { minWidth: 100 },
        Cell: ({ value }) => <HvTag label={value} color="info" />,
      },
      {
        Header: "Status",
        accessor: "status",
        style: { minWidth: 100 },
        Cell: ({ value }) => (
          <div className="flex items-center gap-xxs">
            <HvStatusIcon
              variant={value === "Open" ? "success" : "error"}
              type="simple"
            />
            {value}
          </div>
        ),
      },
      {
        Header: "Probability",
        accessor: "riskScore",
        align: "right",
        Cell: ProgressBar,
      },
      { Header: "Severity", accessor: "severity" },
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ value }) => (
          <HvTag label={value} color={getPriorityColor(value)} />
        ),
      },
      {
        id: "delete",
        variant: "actions",
        Cell: () => (
          <HvIconButton title="Delete event">
            <Delete />
          </HvIconButton>
        ),
      },
    ],
    [],
  );

  return <MyTable<AssetEvent> data={data} columns={columns} />;
}

const TitleDescription = ({ row }: HvCellProps<AssetEvent>) => (
  <div className="p-xxs">
    <HvTypography>{row.original.name}</HvTypography>
    <HvTypography variant="caption1" className="text-textSubtle">
      {row.original.description}
    </HvTypography>
  </div>
);

const ProgressBar = ({ row }: HvCellProps<AssetEvent>) => (
  <div className="flex flex-col">
    <HvTypography variant="caption2">
      {`${row.original.riskScore * 10}%`}
    </HvTypography>
    <div className="flex h-4px bg-border">
      <div
        className="bg-text"
        style={{ width: `${row.original.riskScore * 10}%` }}
      />
    </div>
  </div>
);

function getPriorityColor(priority: AssetEvent["priority"]) {
  switch (priority) {
    case "High":
      return "negative";
    case "Medium":
      return "warning";
    case "Low":
      return "positive";
    default:
      return "neutral";
  }
}
