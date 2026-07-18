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
import { useGlobalFilter, type Hooks } from "react-table";

export type UseGlobalFilterProps = (<
  D extends object = Record<string, unknown>,
>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

export const useHvGlobalFilter: UseGlobalFilterProps = useGlobalFilter.bind({});
(useHvGlobalFilter.pluginName as string) = "useHvGlobalFilter";
