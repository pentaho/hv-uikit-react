import { useEffect, useMemo } from "react";

interface HookWithParams<
  THook extends (...args: any[]) => TResult,
  TResult = ReturnType<THook>,
> {
  hook: THook;
  params?: Parameters<THook>;
}

interface DynamicHooksEvaluatorProps<
  THook extends (...args: any[]) => TResult,
  TResult,
> {
  hooks: HookWithParams<THook, TResult>[];
  onEvaluate: (results: TResult[]) => void;
}

const DynamicHooksEvaluatorInner = <
  THook extends (...args: any[]) => TResult,
  TResult,
>({
  hooks,
  onEvaluate,
}: DynamicHooksEvaluatorProps<THook, TResult>) => {
  const results: TResult[] = [];

  for (const { hook, params = [] as any } of hooks) {
    const result = hook(...params);
    results.push(result);
  }

  // useEffect is necessary to defer onEvaluate (which typically calls setState)
  // until after render completes, preventing "setState during render" warnings.
  // Empty deps [] is intentional - we only call onEvaluate once per mount.
  // The component remounts when hooks change (via key prop in parent).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onEvaluate(results), []);

  return null;
};

export const DynamicHooksEvaluator = <
  THook extends (...args: any[]) => TResult,
  TResult = ReturnType<THook>,
>({
  hooks,
  onEvaluate,
}: DynamicHooksEvaluatorProps<THook, TResult>) => {
  const componentKey = useMemo(() => {
    const hookIdentifiers = hooks
      .map((h) => `${h.hook.name}-${h.params?.length ?? 0}`)
      .join("|");
    return `hooks-${hookIdentifiers}`;
  }, [hooks]);

  return (
    <DynamicHooksEvaluatorInner
      key={componentKey}
      hooks={hooks}
      onEvaluate={onEvaluate}
    />
  );
};
