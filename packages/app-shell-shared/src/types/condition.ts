import { IAsyncResult } from "@hitachivantara/app-shell-services";

export type UseConditionResult = IAsyncResult<boolean, Error, "result">;

export type UseCondition = (
  config?: Record<string, unknown>,
) => UseConditionResult;
