import { useCallback, useMemo } from "react";
import {
  actions,
  ensurePluginOrder,
  Hooks,
  IdType,
  makePropGetter,
  PropGetter,
  Row,
  useGetLatest,
  useMountedLayoutEffect,
} from "react-table";

import { HvCheckBox } from "../../CheckBox";
import { useLabels } from "../../hooks/useLabels";

// #region ##### TYPES #####

// getRowProps:
export interface UseHvRowSelectionTableRowProps {
  selected?: boolean;
}

// getRowProps:
export interface UseHvRowSelectionTableColumnProps {
  "aria-hidden"?: boolean;
}

export interface UseHvRowSelectionRowCheckboxProps {
  onChange?: (e: React.ChangeEvent, checked?: boolean) => void;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
}

export interface UseHvRowSelectionBulkCheckboxProps {
  onChange?: (e: React.ChangeEvent, checked?: boolean) => void;
  checked?: boolean;
  indeterminate?: boolean;
}

export type UseHvRowSelectionTableOptions = Partial<{
  autoResetSelectedRows: boolean;
  autoResetLockedSelectionRows: boolean;
  selectSubRows: boolean;
  manualRowSelectedKey: string;
  applyToggleAllRowsSelectedToPrefilteredRows: boolean;
}>;

export interface UseHvRowSelectionHooks<D extends object> {
  getToggleRowSelectedProps: Array<
    PropGetter<D, UseHvRowSelectionRowCheckboxProps>
  >;
  getToggleAllRowsSelectedProps: Array<
    PropGetter<D, UseHvRowSelectionBulkCheckboxProps>
  >;
  getToggleAllPageRowsSelectedProps: Array<
    PropGetter<D, UseHvRowSelectionBulkCheckboxProps>
  >;
}

export interface UseHvRowSelectionState<D extends object> {
  selectedRowIds: Record<IdType<D>, boolean>;
  lockedSelectionRowIds: Record<IdType<D>, boolean>;
}

export interface UseHvRowSelectionTableInstance<D extends object> {
  toggleRowSelected: (rowId: IdType<D>, set?: boolean) => void;
  toggleAllRowsSelected: (value?: boolean) => void;
  toggleAllPageRowsSelected: (value?: boolean) => void;
  getToggleAllRowsSelectedProps: (
    props?: Partial<UseHvRowSelectionBulkCheckboxProps>,
  ) => UseHvRowSelectionBulkCheckboxProps;
  getToggleAllPageRowsSelectedProps: (
    props?: Partial<UseHvRowSelectionBulkCheckboxProps>,
  ) => UseHvRowSelectionBulkCheckboxProps;

  isNoRowsSelected: boolean;
  isNoPageRowsSelected: boolean;
  isAllRowsSelected: boolean;
  isAllPageRowsSelected: boolean;
  isAllSelectableRowsSelected: boolean;
  isAllSelectablePageRowsSelected: boolean;
  isAllSelectableRowsUnselected: boolean;
  isAllSelectablePageRowsUnselected: boolean;

  selectedFlatRows: Array<Row<D>>;
}

export interface UseHvRowSelectionRowInstance {
  isSelected: boolean;
  isSomeSelected: boolean;
  isSelectionLocked: boolean;
  toggleRowLockedSelection: (set?: boolean) => void;
  toggleRowSelected: (set?: boolean) => void;
  getToggleRowSelectedProps: (
    props?: Partial<UseHvRowSelectionRowCheckboxProps>,
  ) => UseHvRowSelectionRowCheckboxProps;
}

export type UseRowSelectionProps = (<
  D extends object = Record<string, unknown>,
>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

// Actions
actions.resetSelectedRows = "resetSelectedRows";
actions.toggleAllRowsSelected = "toggleAllRowsSelected";
actions.toggleRowSelected = "toggleRowSelected";
actions.toggleAllPageRowsSelected = "toggleAllPageRowsSelected";

actions.resetLockedSelectionRows = "resetLockedSelectionRows";
actions.toggleRowLockedSelection = "toggleRowLockedSelection";

const DEFAULT_LABELS = {
  selectRowCheckBoxAriaLabel: "Select this row",
};

const hideHeaderVariants = ["checkbox", "actions"];

const CellWithCheckBox = ({ row, labels: labelsProp }: any) => {
  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  const { onChange, checked, disabled, indeterminate } =
    row.getToggleRowSelectedProps();

  return (
    <HvCheckBox
      onChange={onChange}
      checked={checked}
      disabled={disabled}
      indeterminate={indeterminate}
      aria-label={labels.selectRowCheckBoxAriaLabel}
    />
  );
};

const visibleColumnsHook = (columns: any) => {
  const selectionColumn = {
    id: "_hv_selection",
    variant: "checkbox",

    width: 32,

    // this will only work when using useHvTableSticky
    // but ensures it stays left of any sticky column
    sticky: "left",

    disableGlobalFilter: true,
    Cell: CellWithCheckBox,
  };

  return [selectionColumn, ...columns];
};

const getHeaderPropsHook = (props: any, { column }: any) => {
  const nextProps: UseHvRowSelectionTableColumnProps = {};

  if (hideHeaderVariants.includes(column.variant)) {
    nextProps["aria-hidden"] = true;
  }
  return [props, nextProps];
};

const getRowPropsHook = (props: any, { row }: any) => {
  const nextProps: UseHvRowSelectionTableRowProps = {
    selected: row.isSelected,
  };

  return [props, nextProps];
};

const defaultGetToggleRowSelectedProps = (props: any, meta: any) => {
  const { instance, row } = meta;
  const { manualRowSelectedKey = "isSelected" } = instance;
  let checked = false;

  if (row.original?.[manualRowSelectedKey]) {
    checked = true;
  } else {
    checked = row.isSelected;
  }

  return [
    props,
    {
      onChange: (e: any, check: any) => {
        row.toggleRowSelected(check ?? e?.target?.checked);
      },
      disabled: row.isSelectionLocked,
      checked,
      indeterminate: row.isSomeSelected,
    },
  ];
};

const defaultGetToggleAllRowsSelectedProps = (
  props: any,
  { instance }: any,
) => [
  props,
  {
    onChange: (e: any) => {
      instance.toggleAllRowsSelected(e.target.checked);
    },
    checked: instance.isAllRowsSelected,
    indeterminate: Boolean(
      !instance.isAllRowsSelected &&
        Object.keys(instance.state.selectedRowIds).length,
    ),
  },
];

const defaultGetToggleAllPageRowsSelectedProps = (
  props: any,
  { instance }: any,
) => [
  props,
  {
    onChange(e: any) {
      instance.toggleAllPageRowsSelected(e.target.checked);
    },
    checked: instance.isAllPageRowsSelected,
    indeterminate: Boolean(
      !instance.isAllPageRowsSelected &&
        instance.page.some(({ id }: any) => instance.state.selectedRowIds[id]),
    ),
  },
];

function reducer(state: any, action: any, previousState: any, instance: any) {
  if (action.type === actions.init) {
    return {
      selectedRowIds: {},
      lockedSelectionRowIds: {},
      ...state,
    };
  }

  if (action.type === actions.resetSelectedRows) {
    return {
      ...state,
      selectedRowIds: instance.initialState.selectedRowIds || {},
    };
  }

  if (action.type === actions.toggleAllRowsSelected) {
    const { value: setSelected } = action;
    const {
      isAllRowsSelected,
      rowsById,
      initialRowsById,
      nonGroupedRowsById = rowsById,
      applyToggleAllRowsSelectedToPrefilteredRows,
    } = instance;

    const rowsToSelect = applyToggleAllRowsSelectedToPrefilteredRows
      ? initialRowsById
      : nonGroupedRowsById;

    const selectAll = setSelected ?? !isAllRowsSelected;

    // Only remove/add the rows that are visible on the screen
    //  Leave all the other rows that are selected alone.
    const selectedRowIds = { ...state.selectedRowIds };

    if (selectAll) {
      Object.keys(rowsToSelect).forEach((rowId) => {
        const isSelectionLocked = state.lockedSelectionRowIds[rowId];
        if (!isSelectionLocked) {
          selectedRowIds[rowId] = true;
        }
      });
    } else {
      Object.keys(rowsToSelect).forEach((rowId) => {
        const isSelectionLocked = state.lockedSelectionRowIds[rowId];
        if (!isSelectionLocked) {
          delete selectedRowIds[rowId];
        }
      });
    }

    return {
      ...state,
      selectedRowIds,
    };
  }

  if (action.type === actions.toggleRowSelected) {
    const { id, value: setSelected } = action;
    const isSelectionLocked = state.lockedSelectionRowIds[id];
    if (isSelectionLocked) {
      return state;
    }

    const { rowsById, selectSubRows = true, getSubRows } = instance;
    const isSelected = state.selectedRowIds[id];
    const shouldExist = setSelected ?? !isSelected;

    if (isSelected === shouldExist) {
      return state;
    }

    const newSelectedRowIds = { ...state.selectedRowIds };

    const handleRowById = (rowId: any) => {
      const row = rowsById[rowId];

      if (!row.isGrouped) {
        if (shouldExist) {
          newSelectedRowIds[rowId] = true;
        } else {
          delete newSelectedRowIds[rowId];
        }
      }

      if (selectSubRows && getSubRows(row)) {
        getSubRows(row).forEach((subrow: any) => {
          handleRowById(subrow.id);
        });
      }
    };

    handleRowById(id);

    return {
      ...state,
      selectedRowIds: newSelectedRowIds,
    };
  }

  if (action.type === actions.toggleAllPageRowsSelected) {
    const { value: setSelected } = action;
    const {
      page,
      rowsById,
      selectSubRows = true,
      isAllPageRowsSelected,
      getSubRows,
    } = instance;

    const selectAll = setSelected ?? !isAllPageRowsSelected;
    const newSelectedRowIds = { ...state.selectedRowIds };

    const handleRowById = (rowId: any) => {
      const row = rowsById[rowId];
      const isSelectionLocked = state.lockedSelectionRowIds[rowId];

      if (!isSelectionLocked && !row.isGrouped) {
        if (selectAll) {
          newSelectedRowIds[rowId] = true;
        } else {
          delete newSelectedRowIds[rowId];
        }
      }

      if (selectSubRows && getSubRows(row)) {
        getSubRows(row).forEach((subrow: any) => {
          handleRowById(subrow.id);
        });
      }
    };

    page.forEach((row: any) => handleRowById(row.id));

    return {
      ...state,
      selectedRowIds: newSelectedRowIds,
    };
  }

  if (action.type === actions.resetLockedSelectionRows) {
    return {
      ...state,
      lockedSelectionRowIds: instance.initialState.lockedSelectionRowIds || {},
    };
  }

  if (action.type === actions.toggleRowLockedSelection) {
    const { id, value: setLockedSelection } = action;
    const { rowsById, selectSubRows = true, getSubRows } = instance;
    const isLockedSelection = state.lockedSelectionRowIds[id];
    const shouldExist = setLockedSelection ?? !isLockedSelection;

    if (isLockedSelection === shouldExist) {
      return state;
    }

    const newLockedSelectionRowIds = { ...state.lockedSelectionRowIds };

    const handleRowById = (rowId: any) => {
      const row = rowsById[rowId];

      if (!row.isGrouped) {
        if (shouldExist) {
          newLockedSelectionRowIds[rowId] = true;
        } else {
          delete newLockedSelectionRowIds[rowId];
        }
      }

      if (selectSubRows && getSubRows(row)) {
        getSubRows(row).forEach((subrow: any) => {
          handleRowById(subrow.id);
        });
      }
    };

    handleRowById(id);

    return {
      ...state,
      lockedSelectionRowIds: newLockedSelectionRowIds,
    };
  }

  return state;
}

function getRowIsSelected(row: any, selectedRowIds: any, getSubRows: any) {
  if (selectedRowIds[row.id]) {
    return true;
  }

  const subRows = getSubRows(row);

  if (subRows?.length) {
    let allChildrenSelected = true;
    let someSelected = false;

    subRows.forEach((subRow: any) => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return;
      }

      if (getRowIsSelected(subRow, selectedRowIds, getSubRows)) {
        someSelected = true;
      } else {
        allChildrenSelected = false;
      }
    });

    if (allChildrenSelected) {
      return true;
    }

    if (someSelected) {
      return null;
    }
  }

  return false;
}

function useInstance(instance: any) {
  const {
    data,
    rows,
    getHooks,
    plugins,
    rowsById,
    initialRowsById,
    nonGroupedRowsById = rowsById,
    autoResetSelectedRows = true,
    autoResetLockedSelectionRows = true,
    state: { selectedRowIds, lockedSelectionRowIds },
    selectSubRows = true,
    dispatch,
    page,
    getSubRows,
    applyToggleAllRowsSelectedToPrefilteredRows,
  } = instance;

  ensurePluginOrder(
    plugins,
    ["useFilters", "useGroupBy", "useSortBy", "useExpanded", "usePagination"],
    "useHvRowSelection",
  );

  const rowsToSelect = applyToggleAllRowsSelectedToPrefilteredRows
    ? initialRowsById
    : nonGroupedRowsById;

  const selectedFlatRows = useMemo(() => {
    const selectedRows: any[] = [];

    rows.forEach((row: any) => {
      const isSelected = selectSubRows
        ? getRowIsSelected(row, selectedRowIds, getSubRows)
        : !!selectedRowIds[row.id];
      row.isSelected = !!isSelected;
      row.isSomeSelected = isSelected === null;

      if (isSelected) {
        selectedRows.push(row);
      }
    });

    return selectedRows;
  }, [rows, selectSubRows, selectedRowIds, getSubRows]);

  const existsLockedRows = !!Object.keys(lockedSelectionRowIds).length;

  const isNoRowsSelected = !(
    Object.keys(rowsToSelect).length && selectedFlatRows.length
  );

  let isNoPageRowsSelected;
  let isAllRowsSelected;
  let isAllPageRowsSelected;

  let isAllSelectableRowsUnselected;
  let isAllSelectablePageRowsUnselected;
  let isAllSelectableRowsSelected;
  let isAllSelectablePageRowsSelected;

  if (isNoRowsSelected) {
    isAllRowsSelected = false;
    isAllPageRowsSelected = false;

    isAllSelectableRowsSelected =
      existsLockedRows &&
      !Object.keys(rowsToSelect).some((id) => !lockedSelectionRowIds[id]);
    isAllSelectablePageRowsSelected = isAllSelectableRowsSelected;

    isAllSelectableRowsUnselected = isAllSelectableRowsSelected;
    isAllSelectablePageRowsUnselected = isAllSelectableRowsSelected;

    isNoPageRowsSelected = true;
  } else {
    isAllRowsSelected = !Object.keys(rowsToSelect).some(
      (id) => !selectedRowIds[id],
    );

    if (isAllRowsSelected) {
      isAllSelectableRowsSelected = true;
      isAllSelectablePageRowsSelected = true;

      isAllSelectableRowsUnselected =
        existsLockedRows &&
        Object.keys(rowsToSelect).filter((id) => !lockedSelectionRowIds[id])
          .length === 0;
      isAllSelectablePageRowsUnselected = isAllSelectableRowsUnselected;

      isNoPageRowsSelected = false;
      isAllPageRowsSelected = true;
    } else {
      isAllSelectableRowsSelected =
        existsLockedRows &&
        !Object.keys(rowsToSelect)
          .filter((id) => !lockedSelectionRowIds[id])
          .some((id) => !selectedRowIds[id]);

      isAllSelectableRowsUnselected =
        !existsLockedRows ||
        !Object.keys(rowsToSelect)
          .filter((id) => !lockedSelectionRowIds[id])
          .some((id) => selectedRowIds[id]);

      isAllPageRowsSelected = !(
        page?.length && page.some(({ id }: any) => !selectedRowIds[id])
      );

      if (isAllPageRowsSelected) {
        isAllSelectablePageRowsSelected = true;

        isAllSelectablePageRowsUnselected =
          existsLockedRows &&
          page &&
          page.length &&
          page.filter(({ id }: any) => !lockedSelectionRowIds[id]).length === 0;

        isNoPageRowsSelected = false;
      } else {
        isAllSelectablePageRowsSelected =
          existsLockedRows &&
          !(
            page?.length &&
            page
              .filter(({ id }: any) => !lockedSelectionRowIds[id])
              .some(({ id }: any) => !selectedRowIds[id])
          );

        isAllSelectablePageRowsUnselected =
          !existsLockedRows ||
          !(
            page?.length &&
            page
              .filter(({ id }: any) => !lockedSelectionRowIds[id])
              .some(({ id }: any) => selectedRowIds[id])
          );

        isNoPageRowsSelected = !(
          page?.length && page.some(({ id }: any) => selectedRowIds[id])
        );
      }
    }
  }

  const getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows);

  const getAutoResetLockedSelectionRows = useGetLatest(
    autoResetLockedSelectionRows,
  );

  useMountedLayoutEffect(() => {
    if (getAutoResetSelectedRows()) {
      dispatch({ type: actions.resetSelectedRows });
    }
    if (getAutoResetLockedSelectionRows()) {
      dispatch({ type: actions.resetLockedSelectionRows });
    }
  }, [dispatch, data]);

  const toggleAllRowsSelected = useCallback(
    (value: any) => dispatch({ type: actions.toggleAllRowsSelected, value }),
    [dispatch],
  );

  const toggleAllPageRowsSelected = useCallback(
    (value: any) =>
      dispatch({ type: actions.toggleAllPageRowsSelected, value }),
    [dispatch],
  );

  const toggleRowSelected = useCallback(
    (id: any, value: any) =>
      dispatch({ type: actions.toggleRowSelected, id, value }),
    [dispatch],
  );

  const getInstance = useGetLatest(instance);

  const getToggleAllRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllRowsSelectedProps,
    {
      instance: getInstance(),
    },
  );

  const getToggleAllPageRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllPageRowsSelectedProps,
    { instance: getInstance() },
  );

  const toggleRowLockedSelection = useCallback(
    (id: any, value: any) =>
      dispatch({ type: actions.toggleRowLockedSelection, id, value }),
    [dispatch],
  );

  Object.assign(instance, {
    selectedFlatRows,
    isNoRowsSelected,
    isNoPageRowsSelected,
    isAllRowsSelected,
    isAllPageRowsSelected,
    isAllSelectableRowsSelected,
    isAllSelectablePageRowsSelected,
    isAllSelectableRowsUnselected,
    isAllSelectablePageRowsUnselected,
    toggleRowSelected,
    toggleAllRowsSelected,
    getToggleAllRowsSelectedProps,
    getToggleAllPageRowsSelectedProps,
    toggleAllPageRowsSelected,
    toggleRowLockedSelection,
  });
}

function prepareRow(row: any, { instance }: any) {
  row.toggleRowSelected = (set: any) => instance.toggleRowSelected(row.id, set);
  row.getToggleRowSelectedProps = makePropGetter(
    instance.getHooks().getToggleRowSelectedProps,
    {
      instance,
      row,
    },
  );

  row.toggleRowLockedSelection = (set: any) =>
    instance.toggleRowLockedSelection(row.id, set);
  row.isSelectionLocked =
    instance.state?.lockedSelectionRowIds?.[row.id] || false;
}

export const useHvRowSelection: UseRowSelectionProps = (hooks) => {
  hooks.visibleColumns.push(visibleColumnsHook);

  hooks.getRowProps.push(getRowPropsHook);

  // props target: <table><thead><tr><th>
  hooks.getHeaderProps.push(getHeaderPropsHook);

  hooks.getToggleRowSelectedProps = [defaultGetToggleRowSelectedProps];
  hooks.getToggleAllRowsSelectedProps = [defaultGetToggleAllRowsSelectedProps];
  hooks.getToggleAllPageRowsSelectedProps = [
    defaultGetToggleAllPageRowsSelectedProps,
  ];

  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
  hooks.prepareRow.push(prepareRow);
};

useHvRowSelection.pluginName = "useHvRowSelection";
