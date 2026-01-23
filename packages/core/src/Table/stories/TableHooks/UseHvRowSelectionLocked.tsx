import { useMemo } from "react";
import {
  HvBulkActions,
  HvPagination,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvToggleButton,
  useHvBulkActions,
  useHvPagination,
  useHvRowSelection,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import { Lock, Unlock } from "@hitachivantara/uikit-react-icons";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

export const LockedSelection = () => {
  const data = useMemo(() => makeData(64), []);

  const columns: HvTableColumnConfig<AssetEvent>[] = useMemo(
    () => [
      ...getColumns(),
      {
        id: "actions",
        variant: "actions",
        Cell: ({ row }) => (
          <HvToggleButton
            aria-label="Lock"
            notSelectedIcon={<Unlock />}
            selectedIcon={<Lock />}
            selected={row.isSelectionLocked}
            onClick={() => row.toggleRowLockedSelection?.()}
          />
        ),
      },
    ],
    [],
  );

  const table = useHvTable<AssetEvent>(
    {
      columns,
      data,
      additivePageBulkSelection: false,
      subtractivePageBulkDeselection: false,
      initialState: {
        selectedRowIds: { 5: true, 7: true },
        lockedSelectionRowIds: { 2: true, 6: true },
      },
    },
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  return (
    <HvTableSection>
      <HvBulkActions
        {...table.getHvBulkActionsProps?.()}
        numTotal={table.rows.length}
        numSelected={table.selectedFlatRows.length}
        showSelectAllPages
      />
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
            {table.page.map((row) => {
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
      {table.page?.length > 0 && (
        <HvPagination {...table.getHvPaginationProps?.()} />
      )}
    </HvTableSection>
  );
};
