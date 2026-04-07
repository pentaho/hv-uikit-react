import { useRowState, type Hooks } from "react-table";

// #region ##### TYPES #####

export type UseRowStateProps = (<D extends object = Record<string, unknown>>(
  hooks: Hooks<D>,
) => void) & { pluginName: string };

// #endregion ##### TYPES #####

export const useHvRowState = useRowState.bind({});
(useHvRowState.pluginName as string) = "useHvRowState";
