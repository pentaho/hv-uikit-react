/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useEffect, useId, useMemo, useState } from "react";
import { css } from "@emotion/css";
import {
  HvBulkActions,
  HvButton,
  HvControls,
  HvGlobalActions,
  HvGrid,
  HvLeftControl,
  HvLoadingContainer,
  HvPagination,
  HvRightControl,
  theme,
  useHvBulkActions,
  useHvData,
  useHvFilters,
  useHvGlobalFilter,
  useHvPagination,
  useHvRowSelection,
  useHvSortBy,
  type HvActionsGenericProps,
  type HvGridProps,
  type HvLeftControlProps,
} from "@hitachivantara/uikit-react-core";

import {
  actions,
  getColumns,
  usePaginationData,
  useSummaryData,
  type ListViewEntry,
  type PaginationDataProps,
} from "./data";
import { Kpi } from "./Kpi";
import { Table } from "./Table";

const classes = {
  paddingTop: css({
    paddingTop: theme.space.md,
  }),
  marginTop: css({
    marginTop: theme.space.md,
  }),
};

const INIT_PAGE_SIZE = 5;

const ListView = () => {
  const breakpoints: HvGridProps = { xl: 3, lg: 3, md: 3, sm: 6, xs: 12 };
  const listId = useId();

  const [kpiSelection, setKpiSelection] = useState<number | undefined>();

  const [params, setParams] = useState<PaginationDataProps>({
    limit: INIT_PAGE_SIZE,
    skip: 0,
  });

  const {
    data: { pages, data },
    loading,
  } = usePaginationData(params);

  const { data: indicatorData, isLoading: indicatorLoading } = useSummaryData();

  const columns = useMemo(() => getColumns(), []);

  const instance = useHvData<ListViewEntry, string>(
    {
      data,
      columns,
      manualPagination: true,
      autoResetPage: false,
      manualFilters: true,
      autoResetFilters: true,
      pageCount: pages,
      initialState: { pageSize: INIT_PAGE_SIZE },
    },
    useHvGlobalFilter,
    useHvFilters,
    useHvSortBy,
    useHvPagination,
    useHvRowSelection,
    useHvBulkActions,
  );

  useEffect(() => {
    const { pageSize = INIT_PAGE_SIZE, pageIndex = 0 } = instance.state;

    setParams((prev) => ({
      ...prev,
      limit: pageSize,
      skip: pageSize * pageIndex,
    }));
  }, [instance.state]);

  useEffect(() => {
    instance.gotoPage?.(0);
    setParams((prev) => ({
      ...prev,
      skip: 0,
      filter:
        instance.state.filters && instance.state.filters?.length > 0
          ? instance.state.filters[0]
          : undefined,
    }));
  }, [instance, instance.state.filters]);

  const bulkActionProps = instance.getHvBulkActionsProps?.();

  const handleAction: HvActionsGenericProps["onAction"] = (event, action) => {
    if (action.id === "refresh") {
      instance.gotoPage?.(0);
      setKpiSelection(undefined);
      setParams((prev) => ({
        ...prev,
        skip: 0,
        filter: undefined,
      }));
    }
  };

  const handleSearch: HvLeftControlProps["onSearch"] = (e, value) => {
    instance.gotoPage?.(0);
    setParams((prev) => ({
      ...prev,
      skip: 0,
      search: value,
    }));
  };

  return (
    <>
      <HvGlobalActions title="Requests" backButton={false}>
        <HvButton variant="primary">Request Server</HvButton>
      </HvGlobalActions>

      <HvGrid container className={classes.paddingTop}>
        <HvGrid item {...breakpoints}>
          <Kpi
            title="Success Requests"
            color="positive"
            status={0}
            instance={instance}
            kpiSelection={kpiSelection}
            setKpiSelection={setKpiSelection}
            loading={indicatorLoading}
            count={indicatorData?.success.count}
            variation={indicatorData?.success.variation}
            trendData={indicatorData?.success.data}
          />
        </HvGrid>
        <HvGrid item {...breakpoints}>
          <Kpi
            title="Error Requests"
            color="negative"
            status={1}
            instance={instance}
            kpiSelection={kpiSelection}
            setKpiSelection={setKpiSelection}
            loading={indicatorLoading}
            count={indicatorData?.error.count}
            variation={indicatorData?.error.variation}
            trendData={indicatorData?.error.data}
          />
        </HvGrid>
        <HvGrid item {...breakpoints}>
          <Kpi
            title="Open Requests"
            color="warning"
            status={2}
            instance={instance}
            kpiSelection={kpiSelection}
            setKpiSelection={setKpiSelection}
            loading={indicatorLoading}
            count={indicatorData?.open.count}
            variation={indicatorData?.open.variation}
            trendData={indicatorData?.open.data}
          />
        </HvGrid>
        <HvGrid item {...breakpoints}>
          <Kpi
            title="Unassigned Requests"
            color="info"
            status={3}
            instance={instance}
            kpiSelection={kpiSelection}
            setKpiSelection={setKpiSelection}
            loading={indicatorLoading}
            count={indicatorData?.unassign.count}
            variation={indicatorData?.unassign.variation}
            trendData={indicatorData?.unassign.data}
          />
        </HvGrid>
      </HvGrid>

      <HvControls
        className={classes.paddingTop}
        defaultView="card"
        callbacks={instance}
      >
        <HvLeftControl
          placeholder="Search"
          onSearch={handleSearch}
          searchProps={{
            inputProps: {
              "aria-label": "Search",
              "aria-controls": listId,
            },
          }}
        />
        <HvRightControl hideSortBy />
      </HvControls>

      <HvBulkActions
        className={classes.marginTop}
        {...bulkActionProps}
        numTotal={data.length}
        numSelected={instance.selectedFlatRows.length}
        maxVisibleActions={2}
        onSelectAll={() => bulkActionProps?.onSelectAll()}
        onSelectAllPages={() => bulkActionProps?.onSelectAllPages()}
        actions={actions}
        actionsDisabled={false}
        onAction={handleAction}
        checkboxProps={{
          "aria-controls": listId,
        }}
      />

      <HvLoadingContainer hidden={!loading}>
        <div className={classes.marginTop}>
          <Table instance={instance} id={listId} />
          {instance.page?.length > 1 && (
            <HvPagination {...instance.getHvPaginationProps?.()} />
          )}
        </div>
      </HvLoadingContainer>
    </>
  );
};

export { ListView as Component };

export default ListView;
