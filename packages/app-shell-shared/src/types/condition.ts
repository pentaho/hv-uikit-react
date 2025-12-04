import { AsyncResult } from "@hitachivantara/app-shell-services";

export type UseConditionResult = AsyncResult<boolean, Error, "result">;

export type UseCondition = (
  config?: Record<string, unknown>,
) => UseConditionResult;
