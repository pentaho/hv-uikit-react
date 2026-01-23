import { useMemo } from "react";
import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  useHvHeaderGroups,
  useHvTable,
} from "@hitachivantara/uikit-react-core";

import { AssetEvent, makeData } from "../storiesUtils";

const getGroupedColumns = (): HvTableColumnConfig<AssetEvent>[] => [
  { Header: "Title", accessor: "name", style: { minWidth: 120 } },
  { Header: "Time", accessor: "createdDate", style: { minWidth: 100 } },
  { Header: "Event Type", accessor: "eventType", style: { minWidth: 100 } },
  {
    id: "eventInfo",
    Header: "Event Info",
    columns: [
      { Header: "Status", accessor: "status", style: { width: 140 } },
      {
        Header: "Probability",
        accessor: "riskScore",
        align: "right", // numeric values should be right-aligned
        Cell: ({ value }) => `${value}%`,
      },
      { Header: "Severity", accessor: "severity" },
    ],
  },
  { Header: "Priority", accessor: "priority" },
];

export const UseHvHeaderGroups = () => {
  const columns = useMemo(() => getGroupedColumns(), []);
  const data = useMemo(() => makeData(), []);

  const table = useHvTable<AssetEvent>(
    {
      columns,
      data,
    },
    useHvHeaderGroups,
  );

  return (
    <HvTableContainer>
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
            const { key, ...rowProps } = row.getRowProps();

            return (
              <HvTableRow key={key} {...rowProps}>
                {row.cells.map((cell) => (
                  <HvTableCell
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
  );
};
