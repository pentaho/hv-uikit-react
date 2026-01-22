import { useMemo, useState } from "react";
import {
  HvCellProps,
  HvIconButton,
  HvStatusIcon,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvTag,
  HvTypography,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import { Delete } from "@hitachivantara/uikit-react-icons";

import { getPriorityColor, makeData, type AssetEvent } from "./makeData";

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

  return <MyTable data={data} columns={columns} />;
}

/** A simple generic client-side table. */
export const MyTable = <T extends object>(props: {
  columns: HvTableColumnConfig<T>[];
  data: T[] | undefined;
}) => {
  const { columns, data } = props;

  const table = useHvTable<T>({ columns, data });

  return (
    <HvTableSection>
      <HvTableContainer className="max-h-500px">
        <HvTable {...table.getTableProps()}>
          <HvTableHead {...table.getTableHeadProps?.()}>
            {table.headerGroups.map((headerGroup) => (
              <HvTableRow
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.getHeaderGroupProps().key}
              >
                {headerGroup.headers.map((col) => (
                  <HvTableHeader
                    {...col.getHeaderProps()}
                    key={col.getHeaderProps().key}
                  >
                    {col.render("Header")}
                  </HvTableHeader>
                ))}
              </HvTableRow>
            ))}
          </HvTableHead>
          <HvTableBody {...table.getTableBodyProps()}>
            {table.rows.map((row) => {
              table.prepareRow(row);
              return (
                <HvTableRow {...row.getRowProps()} key={row.getRowProps().key}>
                  {row.cells.map((cell) => (
                    <HvTableCell
                      className="text-nowrap"
                      {...cell.getCellProps()}
                      key={cell.getCellProps().key}
                    >
                      {cell.render("Cell")}
                    </HvTableCell>
                  ))}
                </HvTableRow>
              );
            })}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
    </HvTableSection>
  );
};

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
      {row.original.riskScore * 10}%
    </HvTypography>
    <div className="flex h-4px">
      <div
        className="bg-text"
        style={{ width: `${row.original.riskScore * 10}%` }}
      />
      <div
        className="bg-border"
        style={{ width: `${100 - row.original.riskScore * 10}%` }}
      />
    </div>
  </div>
);
