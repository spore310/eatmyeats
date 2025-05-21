import { isWindowNull } from "@/utils";
export interface formatedResponse<T> {
  data: T;
  dateTime: number;
}

const checkLocal = (key: string): boolean => {
  if (isWindowNull()) return false;
  const data = window.localStorage.getItem(key);
  return !!(data && data.trim() !== "");
};

export const serialize = <T>(
  key: string,
  data: T
): formatedResponse<T> | null => {
  if (isWindowNull()) return null;
  try {
    const newData = formatData(data);
    window.localStorage.setItem(key, JSON.stringify(newData));
    return newData;
  } catch (e: unknown) {
    return null;
  }
};

export const deSerialize = <T>(
  key: string,
  revalidation: number = 500
): formatedResponse<T> | null => {
  if (isWindowNull()) return null;
  const data = window.localStorage.getItem(key);
  if (data && data.trim()) {
    const newData = JSON.parse(data);
    if (!checkRevalidation(newData, revalidation)) return null;
    return newData;
  }
  return null;
};

const formatData = <T>(data: T) => {
  const formatedData: formatedResponse<T> = {
    data,
    dateTime: Date.now(),
  };
  return formatedData;
};
/**
 *
 * @param obj The localStorage object saved in the key reference
 * @param revalidation The maximum time in ms allowed before invalidating cache
 * @returns a boolean on whether the cache is valid
 */
const checkRevalidation = <T>(
  obj: formatedResponse<T>,
  revalidation: number = 500
) => {
  const { dateTime } = obj;
  const timeElapsed = Date.now() - dateTime;
  return timeElapsed <= revalidation;
};
/**
 *
 * @param key The key to format
 * @returns A formated string to the effect of "Fetch-`key`"
 */
export const keyIdGenerator = (key: string): string => `Fetch-${key}`;
