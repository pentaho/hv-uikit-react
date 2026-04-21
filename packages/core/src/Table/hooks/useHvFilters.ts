import { useFilters, type Hooks } from "react-table";

export type UseFiltersProps = (<D extends object = Record<string, unknown>>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

export const useHvFilters: UseFiltersProps = useFilters.bind({});
(useHvFilters.pluginName as string) = "useHvFilters";
