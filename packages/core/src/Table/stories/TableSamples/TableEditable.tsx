import { FormEvent, Fragment, useCallback, useMemo, useState } from "react";
import { css, keyframes } from "@emotion/css";
import {
  HvButton,
  HvCellProps,
  HvInput,
  HvLabel,
  HvLoadingContainer,
  HvOption,
  HvOverflowTooltip,
  HvPagination,
  HvRowInstance,
  HvSelect,
  HvSnackbarProvider,
  HvSwitch,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvTableState,
  HvTypography,
  snackbarContentClasses,
  theme,
  useHvPagination,
  useHvRowExpand,
  useHvRowState,
  useHvSnackbar,
  useHvTable,
} from "@hitachivantara/uikit-react-core";
import { Add, Delete, Edit } from "@hitachivantara/uikit-react-icons";

import { AssetEvent, useServerData } from "../serverUtils";

const slide = keyframes({
  "0%": { maxHeight: 0 },
  "100%": { maxHeight: 300 },
});

const classes = {
  sectionContent: css({
    position: "relative",
    overflow: "hidden",
  }),
  snackbar: css({
    "&&": {
      position: "absolute",
      width: "100%",
      maxWidth: "100%",
      top: 0,
      "& > div": {
        width: "100%",
        "& .SnackbarItem-message": {
          width: "100%",
          padding: 0,
          "& .SnackbarContent-root": {
            width: "100%",
            [`& .${snackbarContentClasses.root}`]: {
              width: "100%",
              borderRadius: 0,
            },
          },
        },
      },
    },
  }),
  snackbarActions: css({
    display: "flex",
    gap: theme.space.sm,
  }),
  tableRowEditable: css({
    backgroundColor: theme.colors.bgHover,
  }),
  tableCellEditable: css({
    padding: 0,
    border: "none",
    "td&": {
      height: "auto",
    },
  }),
  tableCellContent: css({
    display: "flex",
    alignItems: "center",
    gap: theme.space.sm,
    height: "48px",
    padding: `calc(${theme.space.xs} - 2px) 0 calc(${
      theme.space.xs
    } - 3px) ${theme.spacing(4)}`,
    borderBottom: `1px solid ${theme.colors.border}`,
  }),
  editableActions: css({
    display: "flex",
    justifyContent: "flex-end",
    borderBottom: `1px solid ${theme.colors.border}`,
  }),
  editableTableBorder: css({
    borderBottom: `1px solid ${theme.colors.border}`,
  }),
  slide: css({
    overflow: "hidden",
    animation: `${slide} 1.5s ease-in-out`,
  }),
  inputRoot: css({
    width: "100%",
    maxWidth: "160px",
  }),
  tableRoot: css({ tableLayout: "fixed" }),
  selectBackground: css({ backgroundColor: theme.colors.bgContainer }),
  switchContainer: css({ display: "flex", alignItems: "center" }),
  switchRightLabel: css({ marginLeft: 10 }),
};

const EmptyRow = () => (
  <HvTableRow>
    <HvTableCell colSpan={100} />
  </HvTableRow>
);

interface Data {
  [key: string]: string | number | boolean | null;
  id: string;
}

interface TableProps<T extends Data> {
  addRow?: boolean;
  data?: T[];
  onUpdate?: (tableParams: HvTableState<T>) => void;
  loading?: boolean;
  pageCount: number;
  columns: HvTableColumnConfig<T>[];
  totalRecords?: number;
  onRowRestore?: (id: string) => Promise<void>;
  onRowDelete?: (id: string) => Promise<void>;
  onRowAdd?: (row: Partial<T>) => Promise<void>;
  onRowUpdate?: (row: T) => Promise<void>;
  onExitAddRow?: () => void;
}

const EditableCell = ({
  value,
  row,
  column,
}:
  | HvCellProps<AssetEvent, string>
  | {
      value?: undefined;
      row?: undefined;
      column: HvTableColumnConfig<AssetEvent, string>;
    }) => {
  const formId = row ? `edit-row-${row.original.id}` : "add-row";

  const accessor = String(!row ? column.accessor : "");

  if (row?.state?.isEditing || (!row && column.accessor)) {
    switch (column.id || accessor) {
      case "status":
        return (
          <div className={classes.switchContainer}>
            <HvLabel id="switch-label" label="Closed" htmlFor="switch-input" />
            <HvSwitch
              id="switch-input"
              aria-labelledby="switch-label"
              inputProps={{
                form: formId,
              }}
              name={row ? String(column.id) : accessor}
              defaultChecked={value === "Open"}
              onChange={() => {
                if (row?.state?.isEditing && !row?.state?.isDirty) {
                  row.setState?.((state: object) => ({
                    ...state,
                    isDirty: true,
                  }));
                }
              }}
            />
            <HvLabel
              id="switch-label"
              label="Open"
              htmlFor="switch-input"
              className={classes.switchRightLabel}
            />
          </div>
        );
      case "severity":
        return (
          <div>
            <HvSelect
              name={row ? String(column.id) : accessor}
              className={classes.inputRoot}
              classes={{
                select: classes.selectBackground,
                panel: classes.selectBackground,
              }}
              inputProps={{ form: formId }}
              enablePortal
              placeholder="Select Severity"
              defaultValue={value}
              onChange={() => {
                if (row?.state?.isEditing && !row?.state?.isDirty) {
                  row.setState?.((state: object) => ({
                    ...state,
                    isDirty: true,
                  }));
                }
              }}
            >
              {["Critical", "Major", "Average", "Minor"].map((option) => (
                <HvOption value={option} label={option} key={option}>
                  {option}
                </HvOption>
              ))}
            </HvSelect>
          </div>
        );
      case "priority":
        return (
          <div>
            <HvSelect
              name={row ? String(column.id) : accessor}
              className={classes.inputRoot}
              classes={{
                select: classes.selectBackground,
                panel: classes.selectBackground,
              }}
              inputProps={{ form: formId }}
              enablePortal
              placeholder="Select Priority"
              defaultValue={value}
              onChange={() => {
                if (row?.state?.isEditing && !row?.state?.isDirty) {
                  row.setState?.((state: object) => ({
                    ...state,
                    isDirty: true,
                  }));
                }
              }}
            >
              {["High", "Medium", "Low"].map((option) => (
                <HvOption value={option} label={option} key={option}>
                  {option}
                </HvOption>
              ))}
            </HvSelect>
          </div>
        );
      default:
        return (
          <div>
            <HvInput
              inputProps={{
                form: formId,
              }}
              className={classes.inputRoot}
              name={row ? String(column.id) : accessor}
              defaultValue={value}
              onChange={() => {
                if (row?.state?.isEditing && !row?.state?.isDirty) {
                  row.setState?.((state: object) => ({
                    ...state,
                    isDirty: true,
                  }));
                }
              }}
              placeholder={String(column.Header)}
            />
          </div>
        );
    }
  }
  return value || "-";
};

const Table = <T extends Data>({
  addRow,
  data,
  loading,
  pageCount,
  columns: columnsProp,
  totalRecords,
  onUpdate,
  onRowRestore,
  onRowDelete,
  onRowAdd,
  onRowUpdate,
  onExitAddRow,
}: TableProps<T>) => {
  const { enqueueSnackbar, closeSnackbar } = useHvSnackbar();

  const [newRowDirty, setNewRowDirty] = useState<boolean>(false);

  const handleUndoDelete = useCallback(
    async (row: HvRowInstance<T>) => {
      try {
        await onRowRestore?.(row.original.id);
      } catch {
        enqueueSnackbar("Could not undo delete", {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, onRowRestore],
  );

  const handleDelete = useCallback(
    async (row: HvRowInstance<T>) => {
      try {
        await onRowDelete?.(row.original.id);
        enqueueSnackbar("Row deleted successfully", {
          variant: "success",
          snackbarContentProps: {
            action: (
              <div className={classes.snackbarActions}>
                <HvButton
                  variant="secondaryGhost"
                  onClick={() => {
                    handleUndoDelete(row);
                    closeSnackbar();
                  }}
                >
                  Undo
                </HvButton>
                <HvButton
                  variant="secondaryGhost"
                  onClick={() => closeSnackbar()}
                >
                  Close
                </HvButton>
              </div>
            ),
          },
        });
      } catch {
        enqueueSnackbar("Could not delete row.", {
          variant: "error",
        });
      }
    },
    [closeSnackbar, enqueueSnackbar, handleUndoDelete, onRowDelete],
  );

  const handleRequestDelete = useCallback(
    (row: HvRowInstance<T>) =>
      enqueueSnackbar("Are you sure you want to delete this row?", {
        variant: "warning",
        snackbarContentProps: {
          action: (
            <div className={classes.snackbarActions}>
              <HvButton
                variant="secondaryGhost"
                onClick={() => handleDelete(row)}
              >
                Delete
              </HvButton>
              <HvButton
                variant="secondaryGhost"
                onClick={() => closeSnackbar()}
              >
                Close
              </HvButton>
            </div>
          ),
        },
      }),
    [closeSnackbar, enqueueSnackbar, handleDelete],
  );

  const columns = useMemo<HvTableColumnConfig<T>[]>(
    () => [
      ...columnsProp,
      {
        id: "view",
        variant: "actions",
        style: { width: "70px", maxWidth: "unset" },
        Cell: ({ row }: { row: HvRowInstance<T> }) => (
          <Fragment key={`${row.id}-view`}>
            {!row.state?.isEditing && (
              <HvButton
                variant="secondaryGhost"
                aria-label="View row"
                onClick={() => {
                  alert(JSON.stringify(row.values, null, 2));
                }}
              >
                View
              </HvButton>
            )}
          </Fragment>
        ),
      },
      {
        id: "edit",
        variant: "actions",
        Cell: ({ row, setRowState }: HvCellProps<T>) => {
          return (
            <Fragment key={`${row.id}-edit`}>
              {!row.state?.isEditing && (
                <HvButton
                  icon
                  aria-label="Edit row"
                  onClick={(e) => {
                    setRowState?.(
                      [row.id],
                      (state: { isEditing: boolean }) => ({
                        ...state,
                        isEditing: !state.isEditing,
                      }),
                    );
                    row.getToggleRowExpandedProps?.().onClick?.(e);
                  }}
                >
                  <Edit />
                </HvButton>
              )}
            </Fragment>
          );
        },
      },
      {
        id: "delete",
        variant: "actions",
        Cell: ({ row }: HvCellProps<T>) => (
          <HvButton
            icon
            aria-label="Delete row"
            onClick={() => handleRequestDelete(row)}
          >
            <Delete />
          </HvButton>
        ),
      },
    ],
    [columnsProp, handleRequestDelete],
  );

  const table = useHvTable<T>(
    {
      data,
      columns,
      manualPagination: true,
      disableCreateExpandButton: true,
      pageCount,
      stateReducer: (newState, action) => {
        switch (action.type) {
          // Triggers a data fetch
          case "init":
          case "gotoPage":
          case "setPageSize":
            onUpdate?.(newState);
            break;
          default:
            break;
        }
        return newState;
      },
    },
    useHvRowExpand,
    useHvPagination,
    useHvRowState,
  );

  const handleCancelAddRow = () => {
    if (!newRowDirty) {
      onExitAddRow?.();
      return;
    }
    enqueueSnackbar("Are you sure you want to discard the changes?", {
      variant: "warning",
      snackbarContentProps: {
        action: (
          <div className={classes.snackbarActions}>
            <HvButton
              variant="secondaryGhost"
              onClick={() => {
                onExitAddRow?.();
                setNewRowDirty(false);
                closeSnackbar();
              }}
            >
              Discard
            </HvButton>
            <HvButton variant="secondaryGhost" onClick={() => closeSnackbar()}>
              Close
            </HvButton>
          </div>
        ),
      },
    });
  };

  const handleAddRow: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const asset = Object.fromEntries(formData.entries());
      const assetFormatted = {
        ...asset,
        status: asset.status === "on" ? "Open" : "Closed",
      };
      await onRowAdd?.(assetFormatted as unknown as Partial<T>);
      enqueueSnackbar("New row added successfully.", {
        variant: "success",
        snackbarContentProps: {
          action: (
            <HvButton variant="secondaryGhost" onClick={() => closeSnackbar()}>
              Close
            </HvButton>
          ),
        },
      });
    } catch {
      enqueueSnackbar("Could not add row.", {
        variant: "error",
      });
    } finally {
      onExitAddRow?.();
      setNewRowDirty(false);
    }
  };

  const handleCancelEditRow = (row: HvRowInstance<T>) => {
    if (!row.state?.isDirty) {
      row.setState?.((state: object) => ({
        ...state,
        isEditing: false,
      }));
      row.toggleRowExpanded?.();
      return;
    }

    enqueueSnackbar("Are you sure you want to discard the changes?", {
      variant: "warning",
      snackbarContentProps: {
        action: (
          <div className={classes.snackbarActions}>
            <HvButton
              variant="secondaryGhost"
              onClick={() => {
                row.setState?.((state: object) => ({
                  ...state,
                  isEditing: false,
                }));
                closeSnackbar();
                row?.toggleRowExpanded?.();
              }}
            >
              Discard
            </HvButton>
            <HvButton variant="secondaryGhost" onClick={() => closeSnackbar()}>
              Close
            </HvButton>
          </div>
        ),
      },
    });
  };

  const handleEditRow = async (
    event: FormEvent<HTMLFormElement>,
    row: HvRowInstance<T>,
  ) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const asset = Object.fromEntries(formData.entries());
      const assetFormatted = {
        ...asset,
        status: asset.status === "on" ? "Open" : "Closed",
      };
      await onRowUpdate?.({
        id: row.original.id,
        ...assetFormatted,
      } as unknown as T);
      enqueueSnackbar("Row updated successfully.", {
        variant: "success",
        snackbarContentProps: {
          action: (
            <HvButton variant="secondaryGhost" onClick={() => closeSnackbar()}>
              Close
            </HvButton>
          ),
        },
      });
    } catch {
      enqueueSnackbar("Could not update row.", {
        variant: "error",
      });
    } finally {
      row.setState?.((state: object) => ({
        ...state,
        isEditing: false,
        isDirty: false,
      }));
    }
  };

  const renderEditableRow = (row: HvRowInstance<T>) => {
    const formId = `edit-row-${row.original.id}`;

    return (
      <Fragment key={formId}>
        <HvTableRow
          className={classes.tableRowEditable}
          {...row?.getRowProps()}
        >
          {row.cells.map((cell) => (
            <HvTableCell
              {...cell.getCellProps()}
              key={cell.getCellProps().key}
              style={{ borderBottom: `1px solid ${theme.colors.border}` }}
            >
              {cell.render("Cell")}
            </HvTableCell>
          ))}
        </HvTableRow>
        <HvTableRow
          className={classes.tableRowEditable}
          style={{ display: row?.isExpanded ? "table-row" : "none" }}
        >
          <HvTableCell
            colSpan={columns.length}
            className={classes.tableCellEditable}
          >
            <div>
              <div className={classes.editableActions}>
                <form
                  id={formId}
                  onSubmit={(event) => handleEditRow(event, row)}
                >
                  <HvButton variant="primaryGhost" type="submit">
                    Save
                  </HvButton>
                </form>
                <HvButton
                  variant="secondaryGhost"
                  onClick={() => {
                    handleCancelEditRow(row);
                  }}
                >
                  Cancel
                </HvButton>
              </div>
            </div>
          </HvTableCell>
        </HvTableRow>
      </Fragment>
    );
  };

  const renderAddRow = () => {
    const cols = columns.filter((col) => col.variant !== "actions");
    const formId = "add-row";

    return (
      <Fragment key="add_row">
        <HvTableRow className={classes.tableRowEditable}>
          {cols.map((col, idx) => {
            const last = cols.length - 1 === idx;

            return (
              <HvTableCell
                className={classes.tableCellEditable}
                key={`editable_row_cell-${col.accessor as string}`}
                colSpan={last ? 4 : 1}
              >
                <div className={classes.slide}>
                  <div
                    className={classes.tableCellContent}
                    style={{ justifyContent: "space-between" }}
                  >
                    {EditableCell({
                      column: col as HvTableColumnConfig<AssetEvent, string>,
                    })}
                    {last && (
                      <HvButton
                        icon
                        aria-label="Delete"
                        variant="secondaryGhost"
                        onClick={handleCancelAddRow}
                      >
                        <Delete />
                      </HvButton>
                    )}
                  </div>
                </div>
              </HvTableCell>
            );
          })}
        </HvTableRow>
        <HvTableRow className={classes.tableRowEditable}>
          <HvTableCell
            colSpan={columns.length}
            className={classes.tableCellEditable}
          >
            <div className={classes.slide}>
              <div className={classes.editableActions}>
                <form id={formId} onSubmit={handleAddRow}>
                  <HvButton variant="primaryGhost" type="submit">
                    Save
                  </HvButton>
                </form>
                <HvButton variant="secondaryGhost" onClick={handleCancelAddRow}>
                  Cancel
                </HvButton>
              </div>
            </div>
          </HvTableCell>
        </HvTableRow>
      </Fragment>
    );
  };

  const renderTableRow = (i: number) => {
    const row = table.page[i];

    if (!row) return <EmptyRow key={i} />;

    table.prepareRow(row);

    return row.state?.isEditing ? (
      renderEditableRow(row)
    ) : (
      <HvTableRow {...row.getRowProps()}>
        {row.cells.map((cell) => (
          <HvTableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
            <HvOverflowTooltip data={cell.render("Cell")} />
          </HvTableCell>
        ))}
      </HvTableRow>
    );
  };

  return (
    <>
      <HvLoadingContainer hidden={!loading} label="Loading">
        <HvTableContainer>
          <HvTable {...table.getTableProps()} className={classes.tableRoot}>
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
                      aria-hidden={col.variant === "actions" ? true : undefined}
                    >
                      {col.render("Header")}
                    </HvTableHeader>
                  ))}
                </HvTableRow>
              ))}
            </HvTableHead>
            <HvTableBody {...table.getTableBodyProps()}>
              {addRow && renderAddRow()}
              {data?.length === 0 ? (
                <EmptyRow />
              ) : (
                [...Array(table.state.pageSize ?? 0).keys()].map(renderTableRow)
              )}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
      </HvLoadingContainer>
      {table.page.length > 0 && (
        <HvPagination
          {...table.getHvPaginationProps?.()}
          labels={{ pageSizeEntryName: `of ${totalRecords}` }}
        />
      )}
    </>
  );
};

const getEditableColumns = (): HvTableColumnConfig<AssetEvent>[] => [
  { Header: "Title", accessor: "name", style: { width: "100%" } },
  { Header: "Status", accessor: "status", style: { width: "100%" } },
  { Header: "Severity", accessor: "severity", style: { width: "100%" } },
  { Header: "Priority", accessor: "priority", style: { width: "100%" } },
];

export const TableEditable = () => {
  const { data, loading, fetchData, pageCount, mutateData, totalRecords } =
    useServerData();

  const [add, setAdd] = useState(false);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);

  const columns: HvTableColumnConfig<AssetEvent>[] = useMemo(
    () =>
      getEditableColumns().map((col) => ({
        ...col,
        Cell: EditableCell as any,
      })),
    [],
  );

  return (
    <HvSnackbarProvider
      container={contentRef ?? undefined}
      maxSnack={1}
      anchorOrigin={{
        horizontal: "center",
        vertical: "top",
      }}
      notistackClassesOverride={{
        containerRoot: classes.snackbar,
      }}
    >
      <HvTableSection
        classes={{ content: classes.sectionContent }}
        title={<HvTypography variant="title4">Event Registry</HvTypography>}
        actions={
          <HvButton
            startIcon={<Add />}
            variant="primaryGhost"
            onClick={() => setAdd(true)}
          >
            Add Row
          </HvButton>
        }
        contentRef={setContentRef}
      >
        <Table<AssetEvent>
          addRow={add}
          data={data}
          pageCount={pageCount}
          loading={loading}
          columns={columns}
          totalRecords={totalRecords}
          onUpdate={({ pageIndex, pageSize, sortBy }) => {
            fetchData({ pageIndex, pageSize, sortBy });
          }}
          onRowRestore={async (id) => {
            await mutateData("restore", [id]);
          }}
          onRowDelete={async (id) => {
            await mutateData("remove", [id]);
          }}
          onRowAdd={async (row) => {
            await mutateData("add", [
              { ...row, id: Date.now().toString() } as AssetEvent,
            ]);
          }}
          onRowUpdate={async (row) => {
            await mutateData("update", row);
          }}
          onExitAddRow={() => setAdd(false)}
        />
      </HvTableSection>
    </HvSnackbarProvider>
  );
};
