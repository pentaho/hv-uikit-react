import { useCallback } from "react";
import {
  ensurePluginOrder,
  Hooks,
  makePropGetter,
  PropGetter,
  TableCommonProps,
  useGetLatest,
} from "react-table";

// #region ##### TYPES #####

export interface HvTableBulkActionsProps extends TableCommonProps {
  numTotal: number;
  numSelected: number;
  showSelectAllPages: boolean;
  onSelectAll: () => void;
  onSelectAllPages: () => void;
  labels?: Record<string, string>;
}

export type HvBulkActionsPropGetter<D extends object> = PropGetter<
  D,
  HvTableBulkActionsProps
>;

export interface UseHvBulkActionsHooks<D extends object> {
  getHvBulkActionsProps: Array<HvBulkActionsPropGetter<D>>;
}

export type UseHvBulkActionsTableOptions = {
  /** Controls whether the "Select all" should _select_ or _unselect_ the rows, in a partial selection state. */
  additivePageBulkSelection?: boolean;
  /** Controls whether _only the current page_ or _all pages_ should be unselected */
  subtractivePageBulkDeselection?: boolean;
  showSelectAllPages?: boolean;
};

export interface UseHvBulkActionsTableInstanceProps<D extends object> {
  getHvBulkActionsProps: (
    propGetter?: HvBulkActionsPropGetter<D>,
  ) => HvTableBulkActionsProps;
  invertedToggleAllRowsSelected: () => void;
}

export type UseBulkActionsProps = (<D extends object = Record<string, unknown>>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

const useInstanceHook = (instance: any) => {
  const { plugins, page, toggleAllPageRowsSelected, toggleAllRowsSelected } =
    instance;

  ensurePluginOrder(plugins, ["useHvRowSelection"], "useHvBulkActions");

  const getInstance = useGetLatest(instance);

  const getHvBulkActionsProps = makePropGetter(
    instance.getHooks().getHvBulkActionsProps,
    {
      instance: getInstance(),
    },
  );

  const isPaginated = !!page;

  const invertedToggleAllRowsSelected = useCallback(() => {
    if (!isPaginated) return toggleAllRowsSelected();

    const {
      additivePageBulkSelection,
      subtractivePageBulkDeselection,
      isNoRowsSelected,
      isNoPageRowsSelected,
      isAllSelectablePageRowsSelected,
      isAllSelectablePageRowsUnselected,
    } = getInstance();

    if (additivePageBulkSelection && subtractivePageBulkDeselection) {
      return toggleAllPageRowsSelected(!isAllSelectablePageRowsSelected);
    }

    if (additivePageBulkSelection && !subtractivePageBulkDeselection) {
      if (!isAllSelectablePageRowsSelected) {
        return toggleAllPageRowsSelected(true);
      }

      return toggleAllRowsSelected(false);
    }

    if (!additivePageBulkSelection && !subtractivePageBulkDeselection) {
      if (isNoRowsSelected) {
        return toggleAllPageRowsSelected(true);
      }

      return toggleAllRowsSelected(false);
    }

    if (!additivePageBulkSelection && subtractivePageBulkDeselection) {
      if (isNoRowsSelected) {
        return toggleAllPageRowsSelected(true);
      }
      if (!isAllSelectablePageRowsUnselected) {
        return toggleAllPageRowsSelected(false);
      }
      if (!isNoPageRowsSelected) {
        return toggleAllPageRowsSelected(false);
      }

      return toggleAllRowsSelected(false);
    }

    return toggleAllPageRowsSelected();
  }, [
    getInstance,
    isPaginated,
    toggleAllPageRowsSelected,
    toggleAllRowsSelected,
  ]);

  Object.assign(instance, {
    getHvBulkActionsProps,
    invertedToggleAllRowsSelected,
    additivePageBulkSelection: !!instance.additivePageBulkSelection,
    subtractivePageBulkDeselection: !!instance.subtractivePageBulkDeselection,
  });
};

const defaultGetHvBulkActionsProps = (props: any, { instance }: any) => {
  const {
    rows,
    initialRows,
    selectedFlatRows,
    state: { selectedRowIds = {} } = {},
    page,
    toggleAllRowsSelected,
    invertedToggleAllRowsSelected,
    showSelectAllPages = true,
    applyToggleAllRowsSelectedToPrefilteredRows,
  } = instance;

  const isPaginated = !!page;

  const nextProps: HvTableBulkActionsProps = {
    numTotal: applyToggleAllRowsSelectedToPrefilteredRows
      ? initialRows.length
      : rows.length,
    numSelected: applyToggleAllRowsSelectedToPrefilteredRows
      ? Object.keys(selectedRowIds).length
      : selectedFlatRows.length,
    showSelectAllPages: showSelectAllPages && isPaginated,
    onSelectAll: invertedToggleAllRowsSelected,
    onSelectAllPages: toggleAllRowsSelected,
  };

  return [props, nextProps];
};

export const useHvBulkActions: UseBulkActionsProps = (hooks) => {
  hooks.getHvBulkActionsProps = [defaultGetHvBulkActionsProps];

  hooks.useInstance.push(useInstanceHook);
};

useHvBulkActions.pluginName = "useHvBulkActions";
