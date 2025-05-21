import { isWindowNull } from "@/utils";

export function setSessionStorage<T extends Record<string, any> = {}>(
  key: string,
  data: T
): void {
  if (isWindowNull()) return;
  const storage = window.sessionStorage;
  const token = JSON.stringify(data);
  storage.setItem(key, token);
}
