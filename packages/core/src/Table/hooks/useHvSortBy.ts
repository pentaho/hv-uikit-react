import { ensurePluginOrder, type Hooks } from "react-table";

// #region ##### TYPES #####

// getHeaderProps:
export interface UseHvSortByColumnProps {
  sortable?: boolean;
  sorted?: boolean;
  sortDirection?: "descending" | "ascending";
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}

// getCellProps:
export interface UseHvSortByTableCellProps {
  sorted?: boolean;
}

export type UseHvSortByProps = (<D extends object = Record<string, unknown>>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

// props target: <table><thead><tr><th>
const getHeaderPropsHook = (props: any, { instance, column }: any) => {
  const { isMultiSortEvent = (e: any) => e.shiftKey } = instance;

  const sortDirection = column.isSortedDesc ? "descending" : "ascending";

  const nextProps: UseHvSortByColumnProps = {
    sortable: column.canSort,
    sorted: column.isSorted,
    sortDirection: column.isSorted ? sortDirection : undefined,

    onClick: column.canSort
      ? (e) => {
          e.persist();
          column.toggleSortBy(
            undefined,
            !instance.disableMultiSort && isMultiSortEvent(e),
          );
        }
      : undefined,
  };

  return [props, nextProps];
};

// props target: <table><tbody><tr><td>
const getCellPropsHook = (props: any, { cell }: any) => {
  const nextProps: UseHvSortByTableCellProps = {
    sorted: cell.column.isSorted,
  };

  return [props, nextProps];
};

const useInstanceHook = (instance: any) => {
  ensurePluginOrder(instance.plugins, ["useSortBy"], "useHvSortBy");
};

export const useHvSortBy: UseHvSortByProps = (hooks) => {
  // props target: <table><thead><tr><th>
  hooks.getHeaderProps.push(getHeaderPropsHook);
  // props target: <table><tbody><tr><td>
  hooks.getCellProps.push(getCellPropsHook);

  hooks.useInstance.push(useInstanceHook);
};

useHvSortBy.pluginName = "useHvSortBy";
