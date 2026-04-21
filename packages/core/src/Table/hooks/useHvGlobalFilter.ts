import { useGlobalFilter, type Hooks } from "react-table";

export type UseGlobalFilterProps = (<
  D extends object = Record<string, unknown>,
>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

export const useHvGlobalFilter: UseGlobalFilterProps = useGlobalFilter.bind({});
(useHvGlobalFilter.pluginName as string) = "useHvGlobalFilter";
