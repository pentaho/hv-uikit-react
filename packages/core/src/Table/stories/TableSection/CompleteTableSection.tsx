import { useMemo, useState } from "react";
import {
  HvActionGeneric,
  HvBulkActions,
  HvButton,
  HvLoadingContainer,
  HvPagination,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvTypography,
  useHvBulkActions,
  useHvPagination,
  useHvRowSelection,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import {
  Delete,
  Duplicate,
  Lock,
  Preview,
} from "@hitachivantara/uikit-react-icons";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

const EmptyRow = () => (
  <HvTableRow>
    <HvTableCell colSpan={100} />
  </HvTableRow>
);

export const CompleteTableSection = () => {
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

  const renderTableRow = (i: number) => {
    const row = table.page[i];

    if (!row) return <EmptyRow key={i} />;

    table.prepareRow(row);

    return (
      <HvTableRow {...row.getRowProps()}>
        {row.cells.map((cell) => (
          <HvTableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
            {cell.render("Cell")}
          </HvTableCell>
        ))}
      </HvTableRow>
    );
  };

  return (
    <HvTableSection
      raisedHeader
      expandable
      title={<HvTypography variant="title3">Complete table</HvTypography>}
      actions={<HvButton>Save</HvButton>}
    >
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
      <HvLoadingContainer hidden>
        <HvTableContainer tabIndex={0}>
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
              {[...Array(table.state.pageSize ?? 0).keys()].map(renderTableRow)}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
        {table.page?.length > 0 && (
          <HvPagination
            {...table.getHvPaginationProps?.()}
            labels={{ pageSizeEntryName: `of ${data.length}` }}
          />
        )}
      </HvLoadingContainer>
    </HvTableSection>
  );
};
