import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  useHvRowSelection,
  useHvTable,
} from "@hitachivantara/uikit-react-core";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

const columns = getColumns();
const data = makeData(6).map((d, i) => ({ ...d, selected: i < 3 }));

export const UseHvSelectionControlled = () => {
  const table = useHvTable<AssetEvent>(
    { columns, data, manualRowSelectedKey: "selected" },
    useHvRowSelection,
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
              <HvTableRow
                key={key}
                onChange={() => {
                  row.toggleRowSelected?.(!row.isSelected);
                }}
                {...rowProps}
              >
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
