import type { DeepPartial } from "../types/generic";

const isObject = (val: any): val is object =>
  val && typeof val === "object" && !Array.isArray(val);

function merge<T>(target: T, source?: DeepPartial<T>) {
  Object.keys(source || {}).forEach((keyProp) => {
    const key = keyProp as keyof typeof source;
    if (isObject(target[key]) && isObject(source?.[key])) {
      merge(target[key], source?.[key]);
    } else {
      (target as any)[key] = source?.[key];
    }
  });
}

/** Merges recursively all keys of source into target returning the resulting object. */
export function deepMerge<T>(target: T, source?: DeepPartial<T>): T {
  const result = structuredClone(target);
  merge(result, source);
  return result;
}
