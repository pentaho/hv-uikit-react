import {
  ensurePluginOrder,
  makePropGetter,
  useGetLatest,
  type Hooks,
  type PropGetter,
  type TableCommonProps,
} from "react-table";

// #region ##### TYPES #####

export interface HvTablePaginationProps extends TableCommonProps {
  canPrevious: boolean;
  canNext: boolean;
  pages: number;
  page: number;
  pageSize: number;
  onPageChange?: (updater: ((pageIndex: number) => number) | number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  labels?: Record<string, string>;
}

export type HvPaginationPropGetter<D extends object> = PropGetter<
  D,
  HvTablePaginationProps
>;

export interface UseHvPaginationHooks<D extends object> {
  getHvPaginationProps: Array<HvPaginationPropGetter<D>>;
}

export interface UseHvPaginationTableInstance<D extends object> {
  getHvPaginationProps: (
    propGetter?: HvPaginationPropGetter<D>,
  ) => HvTablePaginationProps;
}

export type UsePaginationProps = (<D extends object = Record<string, unknown>>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

const useInstanceHook = (instance: any) => {
  ensurePluginOrder(
    instance.plugins,
    [
      "usePagination",
      "useHvGlobalFilter",
      "useHvFilters",
      "useGroupBy",
      "useHvSortBy",
      "useHvRowExpand",
    ],
    "useHvPagination",
  );

  const getInstance = useGetLatest(instance);
  const getHvPaginationProps = makePropGetter(
    instance.getHooks().getHvPaginationProps,
    {
      instance: getInstance(),
    },
  );

  Object.assign(instance, {
    getHvPaginationProps,
  });
};

const defaultGetHvPaginationProps = (props: any, { instance }: any) => {
  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    setPageSize,
    state: { pageSize, pageIndex },
    labels,
  } = instance;

  const nextProps: HvTablePaginationProps = {
    canPrevious: canPreviousPage,
    canNext: canNextPage,
    pages: pageOptions.length,
    page: pageIndex,
    pageSize,
    onPageChange: gotoPage,
    onPageSizeChange: setPageSize,
    labels,
  };

  return [props, nextProps];
};

export const useHvPagination: UsePaginationProps = (hooks) => {
  hooks.getHvPaginationProps = [defaultGetHvPaginationProps];

  hooks.useInstance.push(useInstanceHook);
};

useHvPagination.pluginName = "useHvPagination";
