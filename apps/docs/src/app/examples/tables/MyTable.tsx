import { useImperativeHandle } from "react";
import {
  HvBulkActions,
  HvEmptyState,
  HvPagination,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  useHvBulkActions,
  useHvFilters,
  useHvGlobalFilter,
  useHvPagination,
  useHvRowSelection,
  useHvSortBy,
  useHvTable,
  useHvTableSticky,
  type HvActionGeneric,
  type HvBulkActionsProps,
  type HvTableColumnConfig,
  type HvTableInstance,
  type HvTableOptions,
  type HvTableSectionProps,
  type HvTableState,
} from "@hitachivantara/uikit-react-core";
import { Ban } from "@hitachivantara/uikit-react-icons";

export interface TableProps<T extends object> extends HvTableSectionProps {
  columns: HvTableColumnConfig<T>[];
  data: T[] | undefined;
  /** access to the internal table instance */
  tableRef?: React.Ref<HvTableInstance<T> | null>;
  initialState?: Partial<HvTableState<T>>;
  hidePagination?: boolean;
  bulkActions?: HvBulkActionsProps["actions"];
  onBulkAction?: (
    event: React.SyntheticEvent,
    action: HvActionGeneric,
    selectedRows: HvTableInstance<T>["selectedFlatRows"],
  ) => void;
  options?: HvTableOptions<T>;
}

/**
 * A generic client-side table that includes most table features not tied to custom UI rendering.
 * Includes sticky headers, row selection & sorting, bulk actions, pagination, and filtering.
 */
export const MyTable = <T extends object>(props: TableProps<T>) => {
  const {
    columns,
    data,
    tableRef,
    hidePagination,
    bulkActions,
    onBulkAction,
    options,
    ...others
  } = props;

  const table = useHvTable<T>(
    {
      columns,
      data,
      stickyHeader: true,
      ...options,
    },
    useHvTableSticky,
    useHvSortBy,
    useHvFilters,
    useHvGlobalFilter,
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  useImperativeHandle(tableRef, () => table, [table]);

  const renderTableRow = (i: number) => {
    const row = table.page[i];

    if (!row) {
      // render up to 16 <EmptyRow> when there are multiple pages
      const showEmptyRow = table.pageCount && table.pageCount > 1 && i < 16;
      return showEmptyRow ? (
        <HvTableRow key={`empty-${i}`}>
          <HvTableCell colSpan={100} />
        </HvTableRow>
      ) : null;
    }

    table.prepareRow(row);

    return (
      <HvTableRow {...row.getRowProps()} key={row.getRowProps().key}>
        {row.cells.map((cell) => (
          <HvTableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
            {cell.render("Cell")}
          </HvTableCell>
        ))}
      </HvTableRow>
    );
  };

  return (
    <HvTableSection {...others}>
      {table.page.length > 0 && bulkActions && (
        <HvBulkActions
          actions={bulkActions}
          maxVisibleActions={1}
          onAction={(evt, action) => {
            onBulkAction?.(evt, action, table.selectedFlatRows);
          }}
          {...table.getHvBulkActionsProps?.()}
        />
      )}
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
            {table.page.length > 0 ? (
              [...Array(table.state.pageSize).keys()].map(renderTableRow)
            ) : (
              <HvTableRow>
                <HvTableCell colSpan={100} style={{ height: 96 }}>
                  <HvEmptyState message="No data to display" icon={<Ban />} />
                </HvTableCell>
              </HvTableRow>
            )}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
      {!hidePagination && table.page.length > 0 && (
        <HvPagination {...table.getHvPaginationProps?.()} />
      )}
    </HvTableSection>
  );
};
