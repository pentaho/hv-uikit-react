import { useMemo, useState } from "react";
import {
  HvActionGeneric,
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
  useHvBulkActions,
  useHvPagination,
  useHvRowSelection,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import {
  Ban,
  Delete,
  Duplicate,
  Lock,
  Preview,
} from "@hitachivantara/uikit-react-icons";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

export const UseHvBulkActions = () => {
  const columns = useMemo(() => getColumns(), []);
  const [data, setData] = useState(makeData(64));

  const table = useHvTable<AssetEvent>(
    { columns, data },
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  const handleAction = (evt: React.SyntheticEvent, action: HvActionGeneric) => {
    const selected = table.selectedFlatRows.map((el) => el.original);

    switch (action.id) {
      case "duplicate": {
        const newEls = selected.map((el) => ({
          ...el,
          id: `${el.id}-copy`,
          name: `${el.name}-copy`,
        }));
        setData([...data, ...newEls]);
        break;
      }
      case "delete": {
        const selectedIds = selected.map((el) => el.id);
        table.toggleAllRowsSelected?.(false);
        setData(data.filter((el) => !selectedIds.includes(el.id)));
        break;
      }
      case "lock":
      case "preview":
      default:
        break;
    }
  };

  return (
    <>
      <HvBulkActions
        {...table.getHvBulkActionsProps?.()}
        maxVisibleActions={1}
        onAction={handleAction}
        actions={[
          { id: "duplicate", label: "Duplicate", icon: <Duplicate /> },
          { id: "delete", label: "Delete", icon: <Delete /> },
          { id: "lock", label: "Lock", icon: <Lock /> },
          { id: "preview", label: "Preview", icon: <Preview /> },
        ]}
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
            {table.page?.length > 0 ? (
              table.page.map((row) => {
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
              })
            ) : (
              <EmptyStateRow />
            )}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
      {table.page?.length > 0 && (
        <HvPagination {...table.getHvPaginationProps?.()} />
      )}
    </>
  );
};

function EmptyStateRow() {
  return (
    <HvTableRow>
      <HvTableCell colSpan={100} style={{ height: 96 }}>
        <HvEmptyState message="No data to display." icon={<Ban />} />
      </HvTableCell>
    </HvTableRow>
  );
}
