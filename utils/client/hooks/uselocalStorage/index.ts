import { useEffect, useRef, useState } from "react";
import { isWindowNull } from "@/utils";
type useLocalStorageProps<T> = (
  key: string,
  initValue: T
) => [T, (str: T) => void];
export const useLocalStorage = <T>(
  key: string,
  initValue: T
): ReturnType<useLocalStorageProps<T>> => {
  const [stateValue, setState] = useState<T>(() => {
    if (isWindowNull()) return initValue;
    const value = window.localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : null;

    return parsed ?? initValue;
  });
  const stateRef = useRef(stateValue);
  const setValue = (str: T) => {
    if (
      isWindowNull() ||
      JSON.stringify(str) === JSON.stringify(stateRef.current)
    )
      return;
    try {
      window.localStorage.setItem(key, JSON.stringify(str));
      setState(str);
    } catch (e: unknown) {
      console.error((e as Error).message);
    }
  };

  useEffect(() => {
    if (isWindowNull()) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        const { newValue: value } = e;
        const newValue = value && JSON.parse(value);
        if (JSON.stringify(newValue) !== JSON.stringify(stateRef.current)) {
          setState(newValue);
        }
      } catch (e: unknown) {
        console.error((e as Error).message);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [key]);

  useEffect(() => {
    stateRef.current = stateValue;
  }, [stateValue]);
  return [stateValue, setValue] as const;
};
