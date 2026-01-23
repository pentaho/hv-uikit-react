import { useMemo } from "react";
import {
  HvEmptyState,
  HvPagination,
  HvSearchInput,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  useHvFilters,
  useHvGlobalFilter,
  useHvPagination,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import { Ban } from "@hitachivantara/uikit-react-icons";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

const NoDataRow = ({
  message,
  height = 96,
}: {
  message: React.ReactNode;
  height?: number;
}) => (
  <HvTableRow>
    <HvTableCell colSpan={100} style={{ height }}>
      <HvEmptyState message={message} icon={<Ban />} />
    </HvTableCell>
  </HvTableRow>
);

const EmptyRow = () => (
  <HvTableRow>
    <HvTableCell colSpan={100} />
  </HvTableRow>
);

export const UseHvFilters = () => {
  const columns = useMemo(() => getColumns(), []);
  const data = useMemo(() => makeData(32), []);

  const table = useHvTable<AssetEvent>(
    { columns, data },
    useHvFilters,
    useHvGlobalFilter,
    useHvPagination,
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
      actions={
        <>
          <HvSearchInput
            placeholder="Search any column"
            onChange={(evt, val) => table.setGlobalFilter?.(val)}
          />
          <HvSearchInput
            placeholder="Search by severity"
            onChange={(evt, val) => table.setFilter?.("severity", val)}
          />
        </>
      }
    >
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
            {table.page.length > 0 ? (
              [...Array(table.state.pageSize ?? 0).keys()].map(renderTableRow)
            ) : (
              <NoDataRow message="No data" />
            )}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
      {table.page?.length > 0 && (
        <HvPagination {...table.getHvPaginationProps?.()} />
      )}
    </HvTableSection>
  );
};
