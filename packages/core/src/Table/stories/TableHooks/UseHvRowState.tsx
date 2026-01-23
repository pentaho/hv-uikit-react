import { useMemo } from "react";
import {
  HvCellProps,
  HvIconButton,
  HvInput,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  useHvRowState,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import { Close, Edit } from "@hitachivantara/uikit-react-icons";

import { AssetEvent, makeData } from "../storiesUtils";

const EditableCell = ({ value, row }: HvCellProps<AssetEvent>) =>
  row.state?.isEditing ? <HvInput value={value} /> : value;

const getRowStateColumns = (): HvTableColumnConfig<AssetEvent>[] => [
  {
    Header: "Title",
    accessor: "name",
    style: { minWidth: 140, maxWidth: 140 },
    Cell: EditableCell,
  },
  {
    Header: "Time",
    accessor: "createdDate",
    style: { minWidth: 100 },
  },
  {
    Header: "Event Type",
    accessor: "eventType",
    style: { minWidth: 140, maxWidth: 140 },
    Cell: EditableCell,
  },
  {
    Header: "Status",
    accessor: "status",
    style: { minWidth: 100 },
  },
  { Header: "Severity", accessor: "severity" },
  { Header: "Priority", accessor: "priority" },
  {
    id: "edit",
    variant: "actions",
    Cell: ({ row, setRowState }) => (
      <HvIconButton
        title={row.state?.isEditing ? "Close" : "Edit"}
        variant="secondaryGhost"
        onClick={() => {
          setRowState?.([row.id], (state: { isEditing: boolean }) => ({
            ...state,
            isEditing: !state.isEditing,
          }));
        }}
      >
        {row.state?.isEditing ? <Close /> : <Edit />}
      </HvIconButton>
    ),
  },
];

export const UseHvRowState = () => {
  const columns = useMemo(() => getRowStateColumns(), []);
  const data = useMemo(() => makeData(6), []);

  const table = useHvTable<AssetEvent>({ columns, data }, useHvRowState);

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
                  aria-hidden={col.variant === "actions" ? true : undefined}
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
