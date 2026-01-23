import { useMemo } from "react";
import { StoryObj } from "@storybook/react-vite";
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

export default {
  title: "Visualizations/Table/Table Hooks",
};

export const UseHvHooksStory: StoryObj = {
  name: "useHvTable",
  render: () => <UseHvHooks />,
};

export const ColumnResizeStory: StoryObj = {
  name: "useHvResizeColumns",
  render: () => <ColumnResize />,
};

export const UseHvPaginationStory: StoryObj = {
  name: "useHvPagination",
  render: () => <UseHvPagination />,
};

export const UseHvSelectionStory: StoryObj = {
  name: "useHvRowSelection",
  render: () => <UseHvSelection />,
};

export const UseHvSelectionControlledStory: StoryObj = {
  name: "useHvRowSelection controlled",
  render: () => <UseHvSelectionControlled />,
};

export const LockedSelectionStory: StoryObj = {
  name: "useHvRowSelection locked",
  render: () => <LockedSelection />,
};

export const UseHvFiltersStory: StoryObj = {
  name: "useHvFilters",
  render: () => <UseHvFilters />,
};

export const UseHvBulkActionsStory: StoryObj = {
  name: "useHvBulkActions",
  render: () => <UseHvBulkActions />,
};

export const UseHvSortByStory: StoryObj = {
  name: "useHvSortBy",
  render: () => <UseHvSortBy />,
};

export const UseHvRowExpandStory: StoryObj = {
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
};

export const UseHvGroupByStory: StoryObj = {
  name: "useHvRowExpand grouped",
  // For a11y
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getAllByRole("button", { name: /collapse/i })[0];
    await userEvent.click(button);
    await expect(canvas.getByText("Event 2")).toBeInTheDocument();
  },
  render: () => <UseHvGroupBy />,
};

export const UseHvTableStickyStory: StoryObj = {
  name: "useHvTableSticky",
  render: () => <UseHvTableSticky />,
};

export const UseHvHeaderGroupsStory: StoryObj = {
  name: "useHvHeaderGroups",
  render: () => <UseHvHeaderGroups />,
};

export const UseHvRowStateStory: StoryObj = {
  name: "useHvRowState",
  render: () => <UseHvRowState />,
};

/** This was created to test grouped headers with sticky columns */
export const TestStickyHeaders: StoryObj = {
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
};
