import { useMemo, useState } from "react";
import {
  HvActionsGeneric,
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

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

const EmptyRow = () => (
  <HvTableRow>
    <HvTableCell colSpan={100} />
  </HvTableRow>
);

export const PropsTableSection = () => {
  const columns = useMemo(() => getColumns(), []);
  const [data] = useState(makeData(4));

  const table = useHvTable<AssetEvent>(
    { columns, data, initialState: { pageSize: 3 } },
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  const actions = useMemo(
    () => (
      <HvActionsGeneric
        actions={[
          { id: "action1", label: "Action 1" },
          {
            id: "action2",
            label: "Action 2",
          },
          {
            id: "action3",
            label: "Action 3",
          },
        ]}
        onAction={(event, action) => {
          console.log(action.label);
        }}
        maxVisibleActions={1}
      />
    ),
    [],
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
      title={<HvTypography variant="title3">Sample Table</HvTypography>}
      actions={actions}
      expandable
      defaultExpanded
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
            {[...Array(table.state.pageSize ?? 0).keys()].map(renderTableRow)}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
    </HvTableSection>
  );
};
