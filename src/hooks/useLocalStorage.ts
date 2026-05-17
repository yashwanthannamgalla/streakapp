"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { STORAGE_EVENT } from "@/lib/storage";

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue;
  }

  const item = window.localStorage.getItem(key);

  if (!item) {
    return initialValue;
  }

  try {
    return JSON.parse(item) as T;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((current: T) => T)) => void, boolean] {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === "undefined") {
      return () => undefined;
    }

    window.addEventListener("storage", onStoreChange);
    window.addEventListener(STORAGE_EVENT, onStoreChange);

    return () => {
      window.removeEventListener("storage", onStoreChange);
      window.removeEventListener(STORAGE_EVENT, onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(key);
  }, [key]);

  const rawValue = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const value = useMemo(() => {
    if (!rawValue) {
      return initialValue;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return initialValue;
    }
  }, [initialValue, rawValue]);

  const setStoredValue = useCallback(
    (nextValue: T | ((current: T) => T)) => {
      if (typeof window === "undefined") {
        return;
      }

      const current = readValue(key, initialValue);
      const resolved =
        typeof nextValue === "function"
          ? (nextValue as (current: T) => T)(current)
          : nextValue;

      window.localStorage.setItem(key, JSON.stringify(resolved));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
    [initialValue, key],
  );

  return [value, setStoredValue, true];
}
