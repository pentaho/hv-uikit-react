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
import { ensurePluginOrder, type Hooks } from "react-table";

// #region ##### TYPES #####

// getHeaderProps:
export interface UseHvResizeColumnProps {
  resizable?: boolean;
  resizing?: boolean;
  resizerProps?: React.HTMLAttributes<HTMLDivElement>;
}

// getCellProps:
export interface UseHvResizeTableCellProps {
  resizable?: boolean;
  resizing?: boolean;
}

export type UseHvResizeColumnsProps = (<
  D extends object = Record<string, unknown>,
>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

// props target: <table><thead><tr><th>
const getHeaderPropsHook = (props: any, { column }: any) => {
  const resizerProps: NonNullable<UseHvResizeColumnProps["resizerProps"]> =
    column.getResizerProps?.() || {};

  resizerProps.onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const nextProps = {
    resizable: column.canResize,
    resizing: column.isResizing,
    resizerProps,
  };

  return [props, nextProps];
};

// props target: <table><tbody><tr><td>
const getCellPropsHook = (props: any, { cell }: any) => {
  const nextProps: UseHvResizeTableCellProps = {
    resizable: cell.column.canResize,
    resizing: cell.column.isResizing,
  };

  return [props, nextProps];
};

const useInstanceHook = (instance: any) => {
  ensurePluginOrder(
    instance.plugins,
    ["useResizeColumns"],
    "useHvResizeColumns",
  );
};

export const useHvResizeColumns: UseHvResizeColumnsProps = (hooks) => {
  // props target: <table><thead><tr><th>
  hooks.getHeaderProps.push(getHeaderPropsHook);
  // props target: <table><tbody><tr><td>
  hooks.getCellProps.push(getCellPropsHook);

  hooks.useInstance.push(useInstanceHook);
};

useHvResizeColumns.pluginName = "useHvResizeColumns";
