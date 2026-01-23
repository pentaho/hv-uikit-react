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
  useHvSortBy,
  useHvTable,
} from "@hitachivantara/uikit-react-core";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

const makeSortType =
  (items: string[]): HvTableColumnConfig<AssetEvent>["sortType"] =>
  (rowA, rowB, columnId) => {
    const a = items.indexOf(rowA.values[columnId]?.toLowerCase());
    const b = items.indexOf(rowB.values[columnId]?.toLowerCase());

    return a - b;
  };

export const UseHvSortBy = () => {
  const columns = useMemo(() => {
    const cols = getColumns();
    cols[2].disableSortBy = true;
    cols[5].sortType = makeSortType(["minor", "average", "major", "critical"]);
    cols[6].sortType = makeSortType(["low", "medium", "high"]);
    return cols;
  }, []);

  const data = useMemo(() => makeData(5), []);

  const table = useHvTable<AssetEvent>(
    {
      columns,
      data,
      initialState: { sortBy: [{ id: "severity", desc: true }] },
    },
    useHvSortBy,
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
