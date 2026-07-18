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
import { useMemo } from "react";
import type {
  ActionType,
  Cell,
  ColumnInstance,
  ColumnInterface,
  Hooks,
  PluginHook,
  ReducerTableState,
  Renderer,
  Row,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableInstance,
  TableOptions,
  TableProps,
  TableRowProps,
  TableState,
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  UseTableHeaderGroupProps,
} from "react-table";
import {
  useExpanded,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";

import { DefaultCell } from "../renderers/DefaultCell";
import type { HvTableProps } from "../Table";
import type { HvTableCellProps } from "../TableCell";
import type { HvTableHeaderProps } from "../TableHeader";
import type { HvTableRowProps } from "../TableRow";
import type {
  UseHvBulkActionsHooks,
  UseHvBulkActionsTableInstanceProps,
  UseHvBulkActionsTableOptions,
} from "./useHvBulkActions";
import type {
  UseHvHeaderGroupsCellProps,
  UseHvHeaderGroupsColumnProps,
  UseHvHeaderGroupsInstance,
} from "./useHvHeaderGroups";
import type {
  UseHvPaginationHooks,
  UseHvPaginationTableInstance,
} from "./useHvPagination";
import type {
  UseHvResizeColumnProps,
  UseHvResizeTableCellProps,
} from "./useHvResizeColumns";
import type {
  UseHvRowExpandRowInstance,
  UseHvRowExpandTableOptions,
  UseHvRowExpandTableRowProps,
} from "./useHvRowExpand";
import type {
  UseHvRowSelectionHooks,
  UseHvRowSelectionRowInstance,
  UseHvRowSelectionState,
  UseHvRowSelectionTableInstance,
  UseHvRowSelectionTableOptions,
  UseHvRowSelectionTableRowProps,
} from "./useHvRowSelection";
import type {
  UseHvSortByColumnProps,
  UseHvSortByTableCellProps,
} from "./useHvSortBy";
import type {
  UseHvTableStickyCellProps,
  UseHvTableStickyColumnProps,
  UseHvTableStickyHooks,
  UseHvTableStickyTableInstance,
  UseHvTableStickyTableOptions,
  UseHvTableStickyTableProps,
} from "./useHvSticky";
import type {
  UseHvTableStylesColumnOptions,
  UseHvTableStylesTableCellProps,
  UseHvTableStylesTableOptions,
  UseHvTableStylesTableRowProps,
} from "./useHvTableStyles";
import { useHvTableStyles } from "./useHvTableStyles";

// #region ##### TYPES #####

type Accessor<D extends object> = (
  originalRow: D,
  index: number,
  sub: {
    subRows: D[];
    depth: number;
    data: D[];
  },
) => CellValue;

type ValueOf<T> = T[keyof T];
type StringKey<D> = Extract<keyof D, string>;
type IdType<D> = StringKey<D> | string;
type CellValue<V = any> = V;

type HvHeaderProps<D extends object = Record<string, unknown>> =
  HvTableInstance<D> & {
    column: HvColumnInstance<D>;
  };

interface HvMetaBase<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> {
  instance: HvTableInstance<D, H>;
  userProps: any;
}

export type HvMeta<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
  Extension = never,
  M = HvMetaBase<D, H>,
> = [Extension] extends [never] ? M : M & Extension;

export type HvPropGetter<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
  Props extends object = Record<string, unknown>,
  T extends object = never,
  P = Partial<Props>,
> = ((props: P, meta: HvMeta<D, H, T>) => P | P[]) | P | P[];

export type HvTableHeaderRenderer<D extends object = Record<string, unknown>> =
  Renderer<HvHeaderProps<D>>;

type HvFooterProps<D extends object = Record<string, unknown>> =
  HvTableInstance<D> & {
    column: HvColumnInstance<D>;
  };

interface HvHeaderGroup<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>
  extends HvColumnInstance<D, H>, Omit<UseTableHeaderGroupProps<D>, "headers"> {
  headers: Array<HvHeaderGroup<D, H>>;
}

type HvRowPropGetter<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvPropGetter<D, H, HvUseTableRowProps, { row: HvRowInstance<D, H> }>;

type HvTablePropGetter<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvPropGetter<D, H, HvUseTableProps>;

type HvCellPropGetter<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvPropGetter<D, H, HvUseTableCellProps, { cell: HvCellInstance<D, H> }>;

type HvHeaderPropGetter<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvPropGetter<D, H, HvUseTableHeaderProps, { column: HvHeaderGroup<D, H> }>;

type HvFooterPropGetter<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvPropGetter<D, H, HvUseTableFooterProps, { column: HvHeaderGroup<D, H> }>;

export interface HvCellProps<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
  V = any,
> extends HvTableInstance<D, H> {
  column: HvColumnInstance<D, H>;
  row: HvRowInstance<D, H>;
  cell: HvCellInstance<D, H, V>;
  value: CellValue<V>;
}

export type HvTableDefinitionConfig<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvTableOptions<D, H>;

interface HvColumnInterfaceBasedOnValue<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
  V = any,
> {
  Cell?: Renderer<HvCellProps<D, H, V>>;
}

interface HvColumnGroupInterface<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> {
  columns: Array<HvTableColumnConfig<D, H>>;
}

type HvColumnGroup<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvTableColumnOptions<D, H> &
  HvColumnGroupInterface<D, H> &
  (
    | { Header: H }
    | ({ id: IdType<D> } & {
        Header: H;
      })
  ) & { accessor?: Accessor<D> };

type HvColumnWithStrictAccessor<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvTableColumnOptions<D, H> &
  ValueOf<{
    [K in keyof D]: {
      accessor: K;
    } & HvColumnInterfaceBasedOnValue<D, H, D[K]>;
  }>;

type HvColumnWithLooseAccessor<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> = HvTableColumnOptions<D, H> &
  HvColumnInterfaceBasedOnValue<D, H> &
  (
    | { Header: H }
    | { id: IdType<D> }
    | { accessor: keyof D extends never ? IdType<D> : never }
  ) & {
    accessor?: keyof D extends never ? IdType<D> | Accessor<D> : Accessor<D>;
  };

export type HvTableColumnConfig<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
> =
  | HvColumnGroup<D, H>
  | HvColumnWithLooseAccessor<D, H>
  | HvColumnWithStrictAccessor<D, H>;

// #region HOOKS
export interface HvHooks<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>
  extends
    Omit<Hooks<D>, "useOptions">,
    Partial<UseExpandedHooks<D>>,
    Partial<UseGroupByHooks<D>>,
    Partial<UseSortByHooks<D>>,
    Partial<UseHvRowSelectionHooks<D>>,
    Partial<UseHvTableStickyHooks<D>>,
    Partial<UseHvPaginationHooks<D>>,
    Partial<UseHvBulkActionsHooks<D>> {
  useOptions: Array<
    (
      options: HvTableOptions<D, H>,
      args: HvTableOptions<D, H>,
    ) => HvTableOptions<D, H>
  >;
  stateReducers: Array<
    (
      newState: HvTableState<D>,
      action: ActionType,
      previousState?: HvTableState<D>,
      instance?: HvTableState<D>,
    ) => ReducerTableState<D> | undefined
  >;
  columns: Array<
    (
      columns: Array<HvTableColumnConfig<D, H>>,
      meta: HvMeta<D, H>,
    ) => Array<HvTableColumnConfig<D, H>>
  >;
  allColumns: Array<
    (
      allColumns: Array<HvColumnInstance<D, H>>,
      meta: HvMeta<D, H>,
    ) => Array<HvTableColumnConfig<D, H>>
  >;
  visibleColumns: Array<
    (
      allColumns: Array<HvColumnInstance<D, H>>,
      meta: HvMeta<D, H>,
    ) => Array<HvTableColumnConfig<D, H>>
  >;
  headerGroups: Array<
    (
      allColumns: Array<HvHeaderGroup<D, H>>,
      meta: HvMeta<D, H>,
    ) => Array<HvHeaderGroup<D, H>>
  >;
  useInstanceBeforeDimensions: Array<(instance: HvTableInstance<D, H>) => void>;
  useInstance: Array<(instance: HvTableInstance<D, H>) => void>;
  useControlledState: Array<
    (state: HvTableState<D>, meta: HvMeta<D, H>) => HvTableState<D>
  >;
  getTableProps: Array<HvTablePropGetter<D, H>>;
  getHeaderProps: Array<HvHeaderPropGetter<D>>;
  getFooterProps: Array<HvFooterPropGetter<D>>;
  getRowProps: Array<HvRowPropGetter<D>>;
  getCellProps: Array<HvCellPropGetter<D>>;
  useFinalInstance: Array<(instance: HvTableInstance<D, H>) => void>;
}
// #endregion

// #region STATE
export interface HvTableState<D extends object = Record<string, unknown>>
  extends
    TableState<D>,
    Partial<UseColumnOrderState<D>>,
    Partial<UseExpandedState<D>>,
    Partial<UseFiltersState<D>>,
    Partial<UseGlobalFiltersState<D>>,
    Partial<UseGroupByState<D>>,
    Partial<UsePaginationState<D>>,
    Partial<UseResizeColumnsState<D>>,
    Partial<UseSortByState<D>>,
    Partial<UseRowStateState<D>>,
    Partial<UseHvRowSelectionState<D>> {
  rowCount: number;
}
// #endregion

// #region OPTIONS
export interface HvTableOptions<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>
  extends
    Omit<
      TableOptions<D>,
      | "columns"
      | "data"
      | "defaultColumn"
      | "stateReducer"
      | "useControlledState"
      | "getRowId"
    >,
    Partial<UseExpandedOptions<D>>,
    Partial<UseFiltersOptions<D>>,
    Partial<UseGlobalFiltersOptions<D>>,
    Partial<UseGroupByOptions<D>>,
    Partial<UsePaginationOptions<D>>,
    Partial<UseResizeColumnsOptions<D>>,
    Partial<UseSortByOptions<D>>,
    Partial<UseRowStateOptions<D>>,
    Partial<UseHvTableStylesTableOptions>,
    Partial<UseHvRowSelectionTableOptions>,
    Partial<UseHvTableStickyTableOptions>,
    Partial<UseHvBulkActionsTableOptions>,
    Partial<UseHvRowExpandTableOptions> {
  columns?: Array<HvTableColumnConfig<D, H>>;
  data?: D[];
  initialState?: Partial<HvTableState<D>>;
  labels?: Record<string, string>;
  defaultColumn?: Partial<HvTableColumnConfig<D, H>>;
  stateReducer?: (
    newState: HvTableState<D>,
    action: ActionType,
    previousState: HvTableState<D>,
    instance?: HvTableInstance<D, H>,
  ) => HvTableState<D>;
  useControlledState?: (
    state: HvTableState<D>,
    meta: HvMeta<D, H>,
  ) => HvTableState<D>;
  getRowId?: (
    originalRow: D,
    relativeIndex: number,
    parent?: HvRowInstance<D, H>,
  ) => string;
}

export interface HvTableColumnOptions<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>
  extends
    Omit<ColumnInterface<D>, "Header" | "Footer">,
    Partial<UseFiltersColumnOptions<D>>,
    Partial<UseGroupByColumnOptions<D>>,
    Partial<UseResizeColumnsColumnOptions<D>>,
    Partial<UseSortByColumnOptions<D>>,
    Partial<UseGlobalFiltersColumnOptions<D>>,
    Partial<UseHvTableStylesColumnOptions> {
  Header?: H;
  Footer?: Renderer<HvFooterProps<D>>;
  originalId?: IdType<D>;
}
// #endregion

// #region INSTANCE
export interface HvTableInstance<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>
  extends
    Omit<
      TableInstance<D>,
      | "pageCount"
      | "data"
      | "columns"
      | "rows"
      | "allColumns"
      | "visibleColumns"
      | "headers"
      | "flatHeaders"
      | "rowsById"
      | "prepareRow"
      | "flatRows"
      | "headerGroups"
      | "footerGroups"
      | "defaultColumn"
      | "stateReducer"
      | "useControlledState"
      | "getRowId"
      | "getHooks"
      | "getTableProps"
    >,
    Omit<HvTableOptions<D, H>, "pageCount" | "columns">,
    Partial<UseColumnOrderInstanceProps<D>>,
    Partial<Omit<UseExpandedInstanceProps<D>, "rows">>,
    Partial<Omit<UseFiltersInstanceProps<D>, "rows" | "rowsById" | "flatRows">>,
    Partial<
      Omit<UseGlobalFiltersInstanceProps<D>, "rows" | "rowsById" | "flatRows">
    >,
    Partial<Omit<UseGroupByInstanceProps<D>, "rows" | "rowsById" | "flatRows">>,
    Partial<Omit<UsePaginationInstanceProps<D>, "page">>,
    Partial<Omit<UseSortByInstanceProps<D>, "rows">>,
    Partial<UseRowStateInstanceProps<D>>,
    Partial<Omit<UseHvRowSelectionTableInstance<D>, "selectedFlatRows">>,
    Partial<UseHvTableStickyTableInstance<D>>,
    Partial<UseHvHeaderGroupsInstance>,
    Partial<UseHvPaginationTableInstance<D>>,
    Partial<UseHvBulkActionsTableInstanceProps<D>> {
  initialState: Partial<HvTableState<D>>;
  state: HvTableState<D>;
  columns: Array<HvColumnInstance<D, H>>;
  allColumns: Array<HvColumnInstance<D, H>>;
  visibleColumns: Array<HvColumnInstance<D, H>>;
  headers: Array<HvColumnInstance<D, H>>;
  flatHeaders: Array<HvColumnInstance<D, H>>;
  rows: Array<HvRowInstance<D, H>>;
  page: Array<HvRowInstance<D, H>>;
  rowsById: Record<string, HvRowInstance<D, H>>;
  flatRows: Array<HvRowInstance<D, H>>;
  getHooks: () => HvHooks<D>;
  getTableProps: (propGetter?: HvTablePropGetter<D, H>) => HvUseTableProps;
  prepareRow: (row: HvRowInstance<D, H>) => void;
  selectedFlatRows: Array<HvRowInstance<D, H>>;
  initialRows: Array<HvRowInstance<D, H>>;
  initialRowsById: Record<string, HvRowInstance<D, H>>;
  labels: Record<string, string>;
  headerGroups: Array<HvHeaderGroup<D, H>>;
  footerGroups: Array<HvHeaderGroup<D, H>>;
}

export interface HvColumnInstance<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>
  extends
    Omit<
      ColumnInstance<D>,
      | "Cell"
      | "columns"
      | "parent"
      | "placeholderOf"
      | "id"
      | "Header"
      | "getHeaderProps"
      | "getFooterProps"
      | "Footer"
    >,
    HvTableColumnOptions<D, H>,
    Partial<UseFiltersColumnProps<D>>,
    Partial<UseGroupByColumnProps<D>>,
    Partial<UseResizeColumnsColumnProps<D>>,
    Partial<UseSortByColumnProps<D>> {
  Cell?: Renderer<HvCellProps<D, H>>;
  columns: Array<HvColumnInstance<D, H>>;
  parent: HvColumnInstance<D, H>;
  placeholderOf?: HvColumnInstance<D, H>;
  getHeaderProps: (
    propGetter?: HvHeaderPropGetter<D, H>,
  ) => HvUseTableHeaderProps;
  getFooterProps: (
    propGetter?: HvFooterPropGetter<D, H>,
  ) => HvUseTableFooterProps;
}

export interface HvRowInstance<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>
  extends
    Omit<Row<D>, "cells" | "allCells" | "subRows" | "getRowProps">,
    Partial<Omit<UseGroupByRowProps<D>, "subRows" | "values">>,
    Partial<UseRowStateRowProps<D>>,
    Partial<Omit<UseHvRowExpandRowInstance<D>, "subRows">>,
    Partial<UseHvRowSelectionRowInstance> {
  cells: Array<HvCellInstance<D, H>>;
  allCells: Array<HvCellInstance<D, H>>;
  getRowProps: (propGetter?: HvRowPropGetter<D, H>) => HvUseTableRowProps;
  index: number;
  original: D;
  id: string;
  subRows: Array<HvRowInstance<D, H>>;
}

export interface HvCellInstance<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
  V = any,
>
  extends
    Omit<Cell<D, V>, "column" | "row" | "getCellProps">,
    Partial<UseGroupByCellProps<D>> {
  column: HvColumnInstance<D, H>;
  row: HvRowInstance<D, H>;
  getCellProps: (propGetter?: HvCellPropGetter<D, H>) => HvUseTableCellProps;
}
// #endregion

// #region PROPS
export interface HvUseTableProps
  extends Omit<TableProps, "role">, UseHvTableStickyTableProps, HvTableProps {}

export interface HvUseTableHeaderProps
  extends
    Omit<TableHeaderProps, "role">,
    Omit<UseHvTableStylesTableCellProps, "classes">,
    UseHvTableStickyColumnProps,
    UseHvHeaderGroupsColumnProps,
    UseHvResizeColumnProps,
    Omit<UseHvSortByColumnProps, "sortDirection">,
    HvTableHeaderProps {}

export interface HvUseTableFooterProps
  extends TableFooterProps, UseHvTableStylesTableCellProps {}

export interface HvUseTableRowProps
  extends
    Omit<TableRowProps, "role">,
    UseHvTableStylesTableRowProps,
    UseHvRowSelectionTableRowProps,
    UseHvRowExpandTableRowProps,
    HvTableRowProps {}

export interface HvUseTableCellProps
  extends
    Omit<TableCellProps, "role">,
    Omit<UseHvTableStylesTableCellProps, "variant" | "classes">,
    UseHvTableStickyCellProps,
    UseHvHeaderGroupsCellProps,
    UseHvResizeTableCellProps,
    UseHvSortByTableCellProps,
    HvTableCellProps {}

// #endregion

export type UseHvTableProps = <
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  options: HvTableOptions<D, H>,
  ...plugins: Array<PluginHook<D>>
) => HvTableInstance<D, H>;

export type { PluginHook as HvTablePluginHook };

// #endregion ##### TYPES #####

const toTitleCase = (str: string) => {
  return str
    .replace(/([^A-Z])([A-Z])/g, "$1 $2") // split cameCase
    .replace(/[_-]+/g, " ") // split snake_case and lisp-case
    .toLowerCase()
    .replace(/(^\w|\b\w)/g, (m) => m.toUpperCase()) // title case words
    .replace(/\s+/g, " ") // collapse repeated whitespace
    .trim(); // remove leading/trailing whitespace
};

function useDefaultData<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(data?: HvTableOptions<D, H>["data"]) {
  return useMemo(() => {
    return data || [];
  }, [data]);
}

function useDefaultColumns<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  data: NonNullable<HvTableOptions<D, H>["data"]>,
  columns?: HvTableOptions<D, H>["columns"],
) {
  return useMemo(() => {
    if (columns != null) {
      return columns;
    }

    const uniqueKeys = Object.keys(Object.assign({}, ...data));

    return uniqueKeys
      .filter((key) => !["subRows", "subComponent"].includes(key))
      .map((key) => ({
        accessor: key,
        Header: toTitleCase(key),
      }));
  }, [columns, data]);
}

function ensureCorePluginInstallation<
  D extends object = Record<string, unknown>,
>(
  plugins: PluginHook<D>[],
  hvPluginName: string,
  corePluginToInstall: PluginHook<D>,
) {
  const indexOfCorePlugin = plugins.findIndex(
    (plugin) => plugin.pluginName === corePluginToInstall.pluginName,
  );
  const indexOfHvPlugin = plugins.findIndex(
    (plugin) => plugin.pluginName === hvPluginName,
  );

  if (
    indexOfHvPlugin !== -1 &&
    (indexOfCorePlugin === -1 || indexOfCorePlugin > indexOfHvPlugin)
  ) {
    if (indexOfCorePlugin > -1) {
      plugins.splice(indexOfCorePlugin, 1);
    }

    plugins.splice(indexOfHvPlugin, 0, corePluginToInstall);
  }
}

function useInstanceHook<D extends object = Record<string, unknown>>(
  instance: TableInstance<D>,
) {
  const { rowsById } = instance;

  Object.assign(instance, {
    initialRowsById: rowsById,
  });
}

function useHvTableSetup<D extends object = Record<string, unknown>>(
  hooks: Hooks<D>,
) {
  hooks.useInstance.push(useInstanceHook);
}
useHvTableSetup.pluginName = "useHvTableSetup";

export function useHvTable<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  options: HvTableOptions<D, H>,
  ...plugins: PluginHook<D>[]
): HvTableInstance<D, H> {
  const { data: dataProp, columns: columnsProp, ...others } = options;

  const data = useDefaultData<D, H>(dataProp);
  const columns = useDefaultColumns<D, H>(data, columnsProp);

  ensureCorePluginInstallation<D>(plugins, "useHvPagination", usePagination);
  ensureCorePluginInstallation<D>(plugins, "useHvRowExpand", useExpanded);
  ensureCorePluginInstallation<D>(plugins, "useHvSortBy", useSortBy);
  ensureCorePluginInstallation<D>(
    plugins,
    "useHvResizeColumns",
    useResizeColumns,
  );

  const indexOfHvTableStylesPlugin = plugins.findIndex(
    (plugin) => plugin.pluginName === "useHvTableStyles",
  );
  if (indexOfHvTableStylesPlugin === -1) {
    plugins.push(useHvTableStyles);
  }

  // Main hook call
  return useTable<D>(
    {
      data,
      columns,
      defaultColumn: { Cell: DefaultCell },
      ...others,
    } as any,
    useHvTableSetup,
    ...plugins,
  ) as any;
}
