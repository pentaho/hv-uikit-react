import { useState } from "react";

export function useLocalStorageState<T>(
  key: string | undefined,
  defaultValue: T,
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    const storedValue = key && localStorage.getItem(key);
    return (storedValue && safeParse(storedValue)) ?? defaultValue;
  });

  const setLocalStorageState = (value: T) => {
    setState(value);
    safeWrite(key, value);
  };

  return [state, setLocalStorageState];
}

function safeParse(value: any) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

function safeWrite(key: string | undefined, value: any) {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}
