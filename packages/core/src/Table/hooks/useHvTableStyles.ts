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
import type { Hooks } from "react-table";
import { clsx } from "clsx";

// #region ##### TYPES #####

export type UseHvTableStylesTableOptions = {
  style?: React.CSSProperties;
  className?: string;
  classes?: Record<string, string>;
  component?: any;
};

// column definition:
export interface UseHvTableStylesColumnOptions {
  variant?: "checkbox" | "expand" | "actions" | "default" | "none";
  align?: "center" | "inherit" | "justify" | "left" | "right";

  style?: React.CSSProperties;
  className?: string;
  classes?: Record<string, string>;

  headerStyle?: React.CSSProperties;
  headerClassName?: string;
  headerClasses?: Record<string, string>;

  cellStyle?: React.CSSProperties;
  cellClassName?: string;
  cellClasses?: Record<string, string>;
}

// PROPS:
export interface UseHvTableStylesTableRowProps {
  hover?: boolean;
}

export interface UseHvTableStylesTableCellProps {
  style?: React.CSSProperties;
  className?: string;
  classes?: Record<string, string>;
  variant?: "checkbox" | "expand" | "actions" | "default" | "none";
  align?: "center" | "inherit" | "justify" | "left" | "right";
}

export type UseTableStylesProps = (<D extends object = Record<string, unknown>>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

// props target: <table>
const getTablePropsHook = (props: any, { instance }: any) => {
  const nextProps: UseHvTableStylesTableOptions = {
    component: instance.tableComponent,
  };

  if (instance.style != null) {
    nextProps.style = instance.style;
  }

  if (instance.className != null) {
    nextProps.className = instance.className;
  }

  if (instance.classes != null) {
    nextProps.classes = instance.classes;
  }

  return [props, nextProps];
};

// props target: <table><thead><tr><th>
const getHeaderFooterPropsHook = (props: any, { column }: any) => {
  const nextProps: UseHvTableStylesColumnOptions = {
    variant: column.variant,
    align: column.align,
  };

  if (column.style != null || column.headerStyle != null) {
    nextProps.style = {
      ...props.style,
      ...column.style,
      ...column.headerStyle,
    };
  }

  if (column.className != null || column.headerClassName != null) {
    nextProps.className = clsx(
      props.className,
      column.className,
      column.headerClassName,
    );
  }

  if (column.classes != null || column.headerClasses) {
    nextProps.classes = {
      ...props.classes,
      ...column.classes,
      ...column.headerClasses,
    };
  }

  return [props, nextProps];
};

// props target: <table><tbody><tr>
const getRowPropsHook = (props: any) => {
  const nextProps: UseHvTableStylesTableRowProps = {
    hover: true,
  };

  return [props, nextProps];
};

// props target: <table><tbody><tr><td>
const getCellPropsHook = (props: any, { cell }: any) => {
  const nextProps: UseHvTableStylesTableCellProps = {
    variant: cell.column.variant,
    align: cell.column.align,
  };

  if (cell.column.style != null || cell.column.cellStyle != null) {
    nextProps.style = {
      ...props.style,
      ...cell.column.style,
      ...cell.column.cellStyle,
    };
  }

  if (cell.column.className != null || cell.column.cellClassName != null) {
    nextProps.className = clsx(
      props.className,
      cell.column.className,
      cell.column.cellClassName,
    );
  }

  if (cell.column.classes != null || cell.column.cellClasses) {
    nextProps.classes = {
      ...props.classes,
      ...cell.column.classes,
      ...cell.column.cellClasses,
    };
  }

  return [props, nextProps];
};

export const useHvTableStyles: UseTableStylesProps = (hooks) => {
  // props target: <table>
  hooks.getTableProps.push(getTablePropsHook);
  // props target: <table><thead><tr><th>
  hooks.getHeaderProps.push(getHeaderFooterPropsHook);
  // props target: <table><tfoot><tr><td>
  hooks.getFooterProps.push(getHeaderFooterPropsHook);
  // props target: <table><tbody><tr>
  hooks.getRowProps.push(getRowPropsHook);
  // props target: <table><tbody><tr><td>
  hooks.getCellProps.push(getCellPropsHook);
};

useHvTableStyles.pluginName = "useHvTableStyles";
