import { useEffect, useState } from "react";
import { fetcher } from "../helpers";
import { setSessionStorage as setSession } from "./helpers";

export const useUser = (username: string) => {
  const storageKey: string = `useUser-${username}`;
  const [user, setUser] = useState<UserType | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  /**This handles event changes in all tabs except the tab that triggered the change in session storage.
   * This updates the local cookies
   */
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === storageKey && e.storageArea === sessionStorage) {
      const newUser = (e.newValue && JSON.parse(e.newValue)) ?? null;
      setUser(newUser);
    }
  };
  const handleSameTabSessionChange = () => {
    const tokenUser = window.sessionStorage.getItem(storageKey);
    const newUser = tokenUser !== null ? JSON.parse(tokenUser) : null;
    setUser(newUser);
  };
  const setSessionStorage = (data: UserType) => {
    setSession<UserType>(storageKey, data);
    window.dispatchEvent(new Event("user-session-storage"));
  };
  useEffect(() => {
    let flag = true;
    const { signal, abort } = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      const res = await fetcher<GETUserAPIResponseBody>(
        `/api/user?username=${username}`,
        signal,
        flag
      );
      if (res === null) return;
      /**Intergrate timeStamp DO IT  */
      const { user: User, message, timeStamp } = res;
      setUser(User);
      if (User) {
        setSessionStorage(User);
      }
      setError(message !== "Sucess" ? message : null);
      setLoading(false);
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-session-storage", handleSameTabSessionChange);
    fetchData();
    return () => {
      abort();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "user-session-storage",
        handleSameTabSessionChange
      );
    };
  }, [username]);
  return { user, loading, error, setUser: setSessionStorage };
};
