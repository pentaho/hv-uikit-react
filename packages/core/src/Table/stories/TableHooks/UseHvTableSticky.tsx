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
  useHvTable,
  useHvTableSticky,
} from "@hitachivantara/uikit-react-core";

import { AssetEvent, makeData } from "../storiesUtils";

export const UseHvTableSticky = () => {
  const columns = useMemo<HvTableColumnConfig<AssetEvent>[]>(
    () => [
      { Header: "Title", accessor: "name", sticky: "left", width: 120 },
      {
        Header: "Time",
        accessor: "createdDate",
        sticky: "right",
        width: 120,
      },
      { Header: "Event Type", accessor: "eventType" },
      { Header: "Status", accessor: "status", width: 70 },
      {
        Header: "Probability",
        accessor: "riskScore",
        align: "right",
        Cell: ({ value }) => <>{value}%</>,
        width: 80,
      },
      {
        Header: "Severity",
        accessor: "severity",
        sticky: "left",
        width: 100,
      },
      { Header: "Priority", accessor: "priority", width: 80 },
    ],
    [],
  );
  const data = useMemo(() => makeData(100), []);

  const table = useHvTable<AssetEvent>(
    {
      columns,
      data,
      stickyHeader: true,
    },
    useHvTableSticky,
  );

  return (
    <HvTableContainer style={{ maxHeight: 480 }}>
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
        <HvTableBody tabIndex={0} {...table.getTableBodyProps()}>
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
