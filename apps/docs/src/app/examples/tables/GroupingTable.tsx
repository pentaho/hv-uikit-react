import { useState } from "react";
import { useGroupBy } from "react-table";
import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  theme,
  useHvHeaderGroups,
  useHvRowExpand,
  useHvTable,
  type HvCellInstance,
  type HvRowInstance,
  type HvTableColumnConfig,
  type HvTableState,
} from "@hitachivantara/uikit-react-core";

import { makeData, type AssetEvent } from "./makeData";

const defaultColumns: HvTableColumnConfig<AssetEvent>[] = [
  { Header: "Title", accessor: "name", style: { minWidth: 120 } },
  { Header: "Time", accessor: "createdDate", style: { minWidth: 100 } },
  { Header: "Type", accessor: "eventType", style: { minWidth: 100 } },
  { Header: "Status", accessor: "status", style: { width: 140 } },
  {
    Header: "Probability",
    accessor: "riskScore",
    align: "right", // numeric values should be right-aligned
    Cell: ({ value }) => `${value}%`,
    aggregate: "average",
    Aggregated: ({ value }) => `Avg. ${value}%`,
  },
  {
    Header: "Event",
    id: "eventGroup",
    columns: [
      { Header: "Severity", accessor: "severity" },
      { Header: "Priority", accessor: "priority" },
    ],
  },
];

export default function Demo() {
  const [data] = useState(() => makeData(12));

  return (
    <Table<AssetEvent>
      data={data}
      columns={defaultColumns}
      initialState={{
        groupBy: ["status"],
        expanded: {
          "status:Closed": true,
          "status:Open": true,
        },
      }}
    />
  );
}

export function Table<T extends object>({
  data,
  columns,
  initialState,
}: {
  data: T[];
  columns: HvTableColumnConfig<T>[];
  initialState: Partial<HvTableState<T>>;
}) {
  const table = useHvTable<T>(
    { columns, data, initialState },
    useGroupBy,
    useHvHeaderGroups,
    useHvRowExpand,
  );

  const renderCellContent = (
    cell: HvCellInstance<T>,
    row: HvRowInstance<T>,
  ) => {
    if (cell.isGrouped) {
      // If it's a grouped cell, add an expander and row count
      return (
        <>
          {cell.render("Cell")} ({row.subRows.length})
        </>
      );
    }
    // If the cell is aggregated, use the Aggregated renderer
    if (cell.isAggregated) return cell.render("Aggregated");
    // For cells with repeated values, render null
    if (cell.isPlaceholder) return null;
    // return the default cell renderer otherwise
    return cell.render("Cell");
  };

  return (
    <HvTableSection>
      <HvTableContainer>
        <HvTable {...table.getTableProps()}>
          <HvTableHead>
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
            {table.rows.map((row: HvRowInstance<T>) => {
              table.prepareRow(row);
              const { key, ...rowProps } = row.getRowProps();
              const hasSubRows = row.subRows.length > 0;

              return (
                <HvTableRow
                  key={key}
                  style={{
                    backgroundColor:
                      theme.colors[hasSubRows ? "bgContainer" : "bgPage"],
                  }}
                  {...rowProps}
                >
                  {row.cells.map((cell) => (
                    <HvTableCell
                      {...cell.getCellProps()}
                      key={cell.getCellProps().key}
                    >
                      {renderCellContent(cell, row)}
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
}
