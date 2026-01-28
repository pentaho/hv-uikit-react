import { useMemo, useState } from "react";
import {
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
  useHvTableSticky,
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
  const [data] = useState(makeData(64));

  const table = useHvTable<AssetEvent>(
    {
      columns,
      data,
      stickyHeader: true,
      initialState: { pageSize: 20 },
    },
    useHvTableSticky,
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

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
      <HvLoadingContainer hidden>
        <HvBulkActions
          {...table.getHvBulkActionsProps?.()}
          maxVisibleActions={1}
          onAction={() => {}}
          actions={[
            { id: "duplicate", label: "Duplicate", icon: <Duplicate /> },
            { id: "delete", label: "Delete", icon: <Delete /> },
            { id: "lock", label: "Lock", icon: <Lock /> },
            { id: "preview", label: "Preview", icon: <Preview /> },
          ]}
        />
        <HvTableContainer tabIndex={0} style={{ maxHeight: 400 }}>
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
