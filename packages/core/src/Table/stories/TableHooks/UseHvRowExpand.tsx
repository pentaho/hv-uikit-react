import { Fragment, useMemo } from "react";
import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  theme,
  useHvRowExpand,
  useHvTable,
} from "@hitachivantara/uikit-react-core";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

export const UseHvRowExpand = () => {
  const columns = useMemo(() => getColumns(), []);
  const data = useMemo(() => makeData(6), []);
  const i18n = useMemo(
    () => ({
      expandRowButtonAriaLabel: "Click to expand this row",
      collapseRowButtonAriaLabel: "Click to collapse this row",
    }),
    [],
  );

  const table = useHvTable<AssetEvent>(
    { columns, data, labels: i18n },
    useHvRowExpand,
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
              <Fragment key={key}>
                <HvTableRow {...rowProps}>
                  {row.cells.map((cell) => (
                    <HvTableCell
                      {...cell.getCellProps()}
                      key={cell.getCellProps().key}
                    >
                      {cell.render("Cell")}
                    </HvTableCell>
                  ))}
                </HvTableRow>
                {row.isExpanded && (
                  <HvTableRow style={{ backgroundColor: theme.colors.bgPage }}>
                    <HvTableCell
                      style={{ textAlign: "center", height: 100 }}
                      colSpan={100}
                    >
                      {`Expanded content for: ${row.values.name}`}
                    </HvTableCell>
                  </HvTableRow>
                )}
              </Fragment>
            );
          })}
        </HvTableBody>
      </HvTable>
    </HvTableContainer>
  );
};
