import { useMemo } from "react";
import { expect } from "storybook/test";
import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  useHvHeaderGroups,
  useHvTable,
  useHvTableSticky,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../../../.storybook/preview";
import { ColumnResize } from "./ColumnResize";
import { UseHvBulkActions } from "./UseHvBulkActions";
import { UseHvFilters } from "./UseHvFilters";
import { UseHvGroupBy } from "./UseHvGroupBy";
import { UseHvHeaderGroups } from "./UseHvHeaderGroups";
import { UseHvHooks } from "./UseHvHooks";
import { UseHvPagination } from "./UseHvPagination";
import { UseHvRowExpand } from "./UseHvRowExpand";
import { UseHvSelection } from "./UseHvRowSelection";
import { UseHvSelectionControlled } from "./UseHvRowSelectionControlled";
import { LockedSelection } from "./UseHvRowSelectionLocked";
import { UseHvRowState } from "./UseHvRowState";
import { UseHvSortBy } from "./UseHvSortBy";
import { UseHvTableSticky } from "./UseHvTableSticky";

const meta = preview.meta({
  title: "Visualizations/Table/Table Hooks",
});

export const UseHvHooksStory = meta.story({
  name: "useHvTable",
  render: () => <UseHvHooks />,
});

export const ColumnResizeStory = meta.story({
  name: "useHvResizeColumns",
  render: () => <ColumnResize />,
});

export const UseHvPaginationStory = meta.story({
  name: "useHvPagination",
  render: () => <UseHvPagination />,
});

export const UseHvSelectionStory = meta.story({
  name: "useHvRowSelection",
  render: () => <UseHvSelection />,
});

export const UseHvSelectionControlledStory = meta.story({
  name: "useHvRowSelection controlled",
  render: () => <UseHvSelectionControlled />,
});

export const LockedSelectionStory = meta.story({
  name: "useHvRowSelection locked",
  render: () => <LockedSelection />,
});

export const UseHvFiltersStory = meta.story({
  name: "useHvFilters",
  render: () => <UseHvFilters />,
});

export const UseHvBulkActionsStory = meta.story({
  name: "useHvBulkActions",
  render: () => <UseHvBulkActions />,
});

export const UseHvSortByStory = meta.story({
  name: "useHvSortBy",
  render: () => <UseHvSortBy />,
});

export const UseHvRowExpandStory = meta.story({
  name: "useHvRowExpand",
  // For a11y
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getAllByRole("button", { name: /expand/i })[0];
    await userEvent.click(button);
    await expect(
      canvas.getByText("Expanded content for: Event 1"),
    ).toBeInTheDocument();
  },
  render: () => <UseHvRowExpand />,
});

export const UseHvGroupByStory = meta.story({
  name: "useHvRowExpand grouped",
  // For a11y
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getAllByRole("button", { name: /collapse/i })[0];
    await userEvent.click(button);
    await expect(canvas.getByText("Event 2")).toBeInTheDocument();
  },
  render: () => <UseHvGroupBy />,
});

export const UseHvTableStickyStory = meta.story({
  name: "useHvTableSticky",
  render: () => <UseHvTableSticky />,
});

export const UseHvHeaderGroupsStory = meta.story({
  name: "useHvHeaderGroups",
  render: () => <UseHvHeaderGroups />,
});

export const UseHvRowStateStory = meta.story({
  name: "useHvRowState",
  render: () => <UseHvRowState />,
});

/** This was created to test grouped headers with sticky columns */
export const TestStickyHeaders = meta.story({
  render: () => {
    const data = useMemo(
      () => [
        { name: "Paul", email: "a@a.com", v1: "123", v2: "123", test: "123" },
        { name: "Chris", email: "a@a.com", v1: "123", v2: "123", test: "123" },
        { name: "Marta", email: "a@a.com", v1: "123", v2: "123", test: "123" },
        { name: "Sarah", email: "a@a.com", v1: "123", v2: "123", test: "123" },
      ],
      [],
    );

    type Data = (typeof data)[number];

    const columns = useMemo<HvTableColumnConfig<Data>[]>(
      () => [
        { accessor: "name", Header: "Name", sticky: "left" },
        { accessor: "email", Header: "Email", sticky: "left" },
        {
          Header: "Group",
          columns: [
            { accessor: "v1", Header: "Var 1" },
            { accessor: "v2", Header: "Var 2" },
          ],
        },
        { accessor: "test", Header: "Test", sticky: "right" },
      ],
      [],
    );

    const table = useHvTable<Data>(
      {
        columns,
        data,
      },
      useHvHeaderGroups,
      useHvTableSticky,
    );

    return (
      <HvTableSection>
        <HvTableContainer tabIndex={0}>
          <HvTable {...table.getTableProps()}>
            <HvTableHead>
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
      </HvTableSection>
    );
  },
});
