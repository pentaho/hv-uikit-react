import { useEffect, useId, useMemo, useState } from "react";
import { css } from "@emotion/css";
import {
  HvBulkActions,
  HvControls,
  HvLeftControl,
  HvPagination,
  HvRightControl,
  theme,
  useHvBulkActions,
  useHvData,
  useHvGlobalFilter,
  useHvPagination,
  useHvRowSelection,
  useHvSortBy,
  type HvActionsGenericProps,
  type HvLeftControlProps,
} from "@hitachivantara/uikit-react-core";

import { CardView } from "./CardView";
import {
  actions,
  getColumns,
  rightControlValues,
  usePaginationData,
  views,
  type AssetInventoryEntry,
  type PaginationDataProps,
} from "./data";
import { ListView } from "./ListView";

const classes = {
  root: css({
    display: "grid",
    gap: theme.space.sm,
  }),
};

const PAGE_OPTIONS = [6, 12, 18];

const AssetInventory = () => {
  const [currentView, setCurrentView] = useState("card");
  const [params, setParams] = useState<PaginationDataProps>({
    limit: PAGE_OPTIONS[0],
    skip: 0,
  });

  const cardViewId = useId();
  const listViewId = useId();

  const {
    data: { pages, data },
    loading,
    deleteEntries,
  } = usePaginationData(params);

  const columns = useMemo(() => getColumns(loading), [loading]);

  const instance = useHvData<AssetInventoryEntry, string>(
    {
      data,
      columns,
      manualPagination: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: true,
      pageCount: pages,
      initialState: { pageSize: PAGE_OPTIONS[0] },
    },
    useHvGlobalFilter,
    useHvSortBy,
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  useEffect(() => {
    const { pageSize = PAGE_OPTIONS[0], pageIndex = 0 } = instance.state;

    setParams((prev) => ({
      ...prev,
      ...(instance.state.sortBy &&
        instance.state.sortBy.length > 0 && {
          order: instance.state.sortBy?.[0].desc ? "desc" : "asc",
          sort: instance.state.sortBy?.[0].id,
        }),
      limit: pageSize,
      skip: pageSize * pageIndex,
    }));
  }, [instance.state]);

  const bulkActionProps = instance.getHvBulkActionsProps?.();

  const handleSearch: HvLeftControlProps["onSearch"] = (e, value) => {
    instance.gotoPage?.(0);
    setParams((prev) => ({
      ...prev,
      skip: 0,
      search: value,
    }));
  };

  const handleAction: HvActionsGenericProps["onAction"] = async (
    event,
    action,
  ) => {
    if (action.id === "put" || action.id === "add") {
      alert(
        `Callback for action ${
          action.label
        } on items ${instance.selectedFlatRows
          .map((r) => r.original.id)
          .join(", ")}`,
      );
    } else if (action.id === "delete") {
      const ids = instance.selectedFlatRows.map((r) => r.original.id || "");

      await deleteEntries(ids);

      if (
        ids.length === data.length &&
        instance.state.pageIndex === pages - 1
      ) {
        // Go back
        instance.gotoPage?.((instance.state.pageIndex as number) - 1);
        setParams((prev) => ({
          ...prev,
          skip: prev.skip - prev.limit,
        }));
      }
    }
  };

  return (
    <div className={classes.root}>
      <HvControls
        views={views}
        callbacks={instance}
        defaultView="card"
        onViewChange={(evt, id) => setCurrentView(id)}
      >
        <HvLeftControl
          placeholder="Search"
          onSearch={handleSearch}
          searchProps={{
            inputProps: {
              "aria-label": "Search",
              "aria-controls": `${cardViewId} ${listViewId}`,
            },
          }}
        />
        <HvRightControl
          values={rightControlValues}
          sortProps={{
            "aria-label": "Sort by",
            "aria-controls": `${cardViewId} ${listViewId}`,
          }}
        />
      </HvControls>

      <HvBulkActions
        {...bulkActionProps}
        numTotal={data.length}
        numSelected={instance.selectedFlatRows.length}
        maxVisibleActions={2}
        onSelectAll={() => bulkActionProps?.onSelectAll()}
        onSelectAllPages={() => bulkActionProps?.onSelectAllPages()}
        actions={actions}
        onAction={handleAction}
        checkboxProps={{
          "aria-controls": `${cardViewId} ${listViewId}`,
        }}
      />

      {currentView === "card" && (
        <CardView id={cardViewId} instance={instance} loading={loading} />
      )}

      {currentView === "list" && (
        <ListView id={listViewId} instance={instance} columns={columns} />
      )}

      {instance.page?.length ? (
        <HvPagination
          {...instance.getHvPaginationProps?.()}
          pageSizeOptions={PAGE_OPTIONS}
          labels={{
            pageSizeEntryName: currentView === "card" ? "cards" : "rows",
          }}
        />
      ) : undefined}
    </div>
  );
};

export { AssetInventory as Component };

export default AssetInventory;
