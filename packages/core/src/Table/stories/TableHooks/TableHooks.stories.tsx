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

import { AlternativeLayout } from "./AlternativeLayout";
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
  render: () => <UseHvHooks />,
};

export const AlternativeLayoutStory: StoryObj = {
  render: () => <AlternativeLayout />,
};

export const ColumnResizeStory: StoryObj = {
  render: () => <ColumnResize />,
};

export const UseHvPaginationStory: StoryObj = {
  render: () => <UseHvPagination />,
};

export const UseHvSelectionStory: StoryObj = {
  render: () => <UseHvSelection />,
};

export const UseHvSelectionControlledStory: StoryObj = {
  render: () => <UseHvSelectionControlled />,
};

export const LockedSelectionStory: StoryObj = {
  render: () => <LockedSelection />,
};

export const UseHvFiltersStory: StoryObj = {
  render: () => <UseHvFilters />,
};

export const UseHvBulkActionsStory: StoryObj = {
  render: () => <UseHvBulkActions />,
};

export const UseHvSortByStory: StoryObj = {
  render: () => <UseHvSortBy />,
};

export const UseHvRowExpandStory: StoryObj = {
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
  // For a11y
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getAllByRole("button", { name: /collapse/i })[0];
    await userEvent.click(button);
    await expect(canvas.getByText("Event 2")).toBeInTheDocument();
  },
  render: () => <UseHvGroupBy />,
};

export const UseHvTableStickyStory: StoryObj = {
  render: () => <UseHvTableSticky />,
};

export const UseHvHeaderGroupsStory: StoryObj = {
  render: () => <UseHvHeaderGroups />,
};

export const UseHvRowStateStory: StoryObj = {
  render: () => <UseHvRowState />,
};

/** This was created to test grouped headers with sticky columns */
export const TestHeaders: StoryObj = {
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

    const { getTableProps, getTableBodyProps, prepareRow, headerGroups, rows } =
      useHvTable<Data>(
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
          <HvTable {...getTableProps()}>
            <HvTableHead>
              {headerGroups.map((headerGroup) => (
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
            <HvTableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
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
