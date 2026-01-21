export type PropertyWithName<K extends string, T> = Record<K, T>;

export type ErrorBase = NonNullable<unknown>;

export type AsyncBaseResult<
  TData,
  TError extends ErrorBase = Error,
  TDataProp extends string = "data",
  TDataPending extends TData | undefined = undefined,
> = {
  isPending: boolean;
  error: TError | null;
} & PropertyWithName<TDataProp, TData | TDataPending | undefined>;

export type AsyncResult<
  TData,
  TError extends ErrorBase = Error,
  TDataProp extends string = "data",
  TDataPending extends TData | undefined = undefined,
> =
  | AsyncPendingResult<TData, TError, TDataProp, TDataPending>
  | AsyncErrorResult<TData, TError, TDataProp, TDataPending>
  | AsyncSuccessResult<TData, TError, TDataProp, TDataPending>;

export type AsyncPendingResult<
  TData,
  TError extends ErrorBase = Error,
  TDataProp extends string = "data",
  TDataPending extends TData | undefined = undefined,
> = AsyncBaseResult<TData, TError, TDataProp> & {
  isPending: true;
  error: null;
} & PropertyWithName<TDataProp, TDataPending>;

export type AsyncErrorResult<
  TData,
  TError extends ErrorBase = Error,
  TDataProp extends string = "data",
  TDataPending extends TData | undefined = undefined,
> = AsyncBaseResult<TData, TError, TDataProp, TDataPending> & {
  isPending: false;
  error: TError;
} & PropertyWithName<TDataProp, undefined>;

export type AsyncSuccessResult<
  TData,
  TError extends ErrorBase = Error,
  TDataProp extends string = "data",
  TDataPending extends TData | undefined = undefined,
> = AsyncBaseResult<TData, TError, TDataProp, TDataPending> & {
  isPending: false;
  error: null;
} & PropertyWithName<TDataProp, TData>;
