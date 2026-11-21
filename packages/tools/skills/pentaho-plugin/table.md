# A table people act on

The pattern for a list page: actions on one row in a menu, and when people act on several rows at once, rows selected
with checkboxes and actions on the selection; pages at the bottom, an empty state, and the secondary columns hidden on
narrow screens. Adapt the columns and the actions; drop the selection and bulk actions when nothing applies to several
rows.

```tsx
import { useMemo } from "react";
import { Users } from "@phosphor-icons/react";
import {
  HvBulkActions,
  HvDropDownMenu,
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
  useHvPagination,
  useHvRowSelection,
  useHvSortBy,
  useHvTable,
  type HvActionGeneric,
  type HvTableColumnConfig,
} from "@pentaho/uikit-react-core";

interface User {
  id: string;
  name: string;
  email: string;
}

const bulkActions: HvActionGeneric[] = [{ id: "disable", label: "Disable" }];
const rowActions = [
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

export function UsersTable({
  data,
  onRowAction,
  onConfirmDisable,
}: {
  data: User[];
  onRowAction: (action: string, user: User) => void;
  /** Opens the confirmation (below); disabling runs from its button. */
  onConfirmDisable: (users: User[]) => void;
}) {
  const columns = useMemo<HvTableColumnConfig<User>[]>(
    () => [
      { Header: "Name", accessor: "name" },
      // a secondary column: hidden below md, so the page holds up at 390 wide
      {
        Header: "Email",
        accessor: "email",
        className: "hidden md:table-cell",
      },
      {
        id: "actions",
        Header: "Actions",
        Cell: ({ row }: { row: { original: User } }) => (
          <HvDropDownMenu
            dataList={rowActions}
            keepOpened={false}
            labels={{ dropdownMenu: `Actions for ${row.original.name}` }}
            onClick={(_, item) => onRowAction(String(item.id), row.original)}
          />
        ),
      },
    ],
    [onRowAction],
  );

  const table = useHvTable<User>(
    { columns, data, getRowId: (row) => row.id },
    useHvSortBy,
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  return (
    <HvTableSection>
      <HvBulkActions
        {...table.getHvBulkActionsProps?.()}
        checkboxProps={{ "aria-label": "Select all" }}
        actions={bulkActions}
        maxVisibleActions={1}
        onAction={() =>
          onConfirmDisable(table.selectedFlatRows.map((row) => row.original))
        }
      />
      <HvTableContainer>
        <HvTable {...table.getTableProps()} aria-label="Users">
          <HvTableHead {...table.getTableHeadProps?.()}>
            {table.headerGroups.map((group) => (
              <HvTableRow
                {...group.getHeaderGroupProps()}
                key={group.getHeaderGroupProps().key}
              >
                {group.headers.map((col) => (
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
            {table.page.length === 0 ? (
              <HvTableRow>
                <HvTableCell colSpan={100}>
                  <HvEmptyState
                    title="No users yet"
                    message="Users appear here once they're added."
                    icon={<Users />}
                  />
                </HvTableCell>
              </HvTableRow>
            ) : (
              table.page.map((row) => {
                table.prepareRow(row);
                return (
                  <HvTableRow
                    {...row.getRowProps()}
                    key={row.getRowProps().key}
                  >
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
            )}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
      {table.page.length > 0 && (
        <HvPagination {...table.getHvPaginationProps?.()} />
      )}
    </HvTableSection>
  );
}
```

- The hooks add the selection column, the bulk-actions wiring and the paging: spread each `get…Props()` on its part,
  don't rebuild them. `table.selectedFlatRows` is the selection; `table.toggleAllRowsSelected(false)` clears it.
- Before an action on the selection runs, confirm it in an `HvDialog` that names every row it acts on, in a scrolling
  list (`actions/confirm-actions-on-several-items`); after it, say per row how it went (in its row, a failure with its
  reason) and give the counts in one snackbar:

  ```tsx
  <HvDialog open={confirming} onClose={() => setConfirming(false)}>
    <HvDialogTitle>{`Disable ${users.length} users?`}</HvDialogTitle>
    <HvDialogContent>
      <ul className="max-h-60 overflow-y-auto">
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </HvDialogContent>
    <HvDialogActions>
      <HvButton variant="secondaryGhost" onClick={() => setConfirming(false)}>
        Cancel
      </HvButton>
      <HvButton
        variant="primary"
        onClick={disable}
      >{`Disable ${users.length} users`}</HvButton>
    </HvDialogActions>
  </HvDialog>
  ```

- Status cells in words (`HvTag` with a status `color`); a kind of thing (a role, a type) is a neutral or categorical
  tag (`components/status`).
- At 390 wide, keep the columns people identify a row by (its name, status and actions) and hide the rest
  (`hidden md:table-cell`).
