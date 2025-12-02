import { createElement, useCallback, useEffect, useRef } from "react";

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

// Generate a unique key for internal tracking
const generateKey = (): string => {
  return `hooks-${Date.now()}-${Math.round(1000 * Math.random())}`;
};

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
  const skipRenderRef = useRef(false);
  const keyRef = useRef(generateKey());
  const hooksRef = useRef(hooks);

  if (hooksRef.current !== hooks) {
    skipRenderRef.current = false;
    hooksRef.current = hooks;
  }

  if (skipRenderRef.current) {
    skipRenderRef.current = false;
  } else {
    keyRef.current = generateKey();
  }

  const onEvaluateWrapper = useCallback(
    (results: TResult[]) => {
      skipRenderRef.current = true;
      onEvaluate(results);
    },
    [onEvaluate],
  );

  return createElement(DynamicHooksEvaluatorInner<THook, TResult>, {
    key: keyRef.current,
    hooks,
    onEvaluate: onEvaluateWrapper,
  });
};
