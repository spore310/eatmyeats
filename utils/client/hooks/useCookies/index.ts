import { useCallback, useEffect, useMemo, useState } from "react";
import Cookies, {
  CookieChangeOptions,
  CookieSetOptions,
} from "universal-cookie";
import debounce from "lodash-es/debounce";
import isEqual from "lodash-es/isEqual";
import { useLocalStorage } from "../uselocalStorage";
import { isWindowNull } from "@/utils";
import { isCookieValid } from "./helpers";
interface CookieType<T> {
  name: string;
  options?: CookieSetOptions;
  value: T | string;
}
export const useCookie = <T extends string | Record<string, any> = string>(
  name: string,
  options: CookieSetOptions = {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 604800, //7 days
  },
  securityOptions: {
    encrypt?: (cookie: T) => string | Promise<string>;
    decrypt?: (cookie: string) => T | Promise<T>;
  } = {}
) => {
  const { encrypt, decrypt } = securityOptions;
  const localFlagName: string = `cookie-${name}`;
  const cookies: Cookies = useMemo(() => new Cookies(), [name]);
  const [cookie, setCookie] = useState<CookieType<T> | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [_, setLocalFlag] = useLocalStorage<number>(localFlagName, Date.now());
  const getEncrypt = useCallback(
    async (cookie: T) => {
      if (typeof encrypt !== "function") return cookie;
      const encodedCookie = await encrypt?.(cookie);
      if (typeof encodedCookie === "string" && encodedCookie.trim() !== "")
        return encodedCookie;
      console.warn(
        "[warning][useCookie]: cookie was not encrypted in the proper format, switching to default fallback"
      );
      return cookie;
    },
    [securityOptions?.encrypt]
  );
  const getDecrypt = useCallback(
    async (cookieString: string) => {
      if (typeof decrypt !== "function") return cookieString;
      try {
        const decodedCookie = await decrypt?.(cookieString);
        return decodedCookie;
      } catch {
        console.warn(
          "[warning][useCookie]: cookie was not decrypted correctly. Please check your decrypt logic."
        );
        return cookieString;
      }
    },
    [securityOptions?.decrypt]
  );

  const updateCookieValue = useMemo(() => {
    return debounce(
      async (value: T, updateOptions?: CookieSetOptions | null) => {
        if (isWindowNull()) return;
        setLoading(true);
        const encodedCookie = await getEncrypt(value);
        cookies.set(name, encodedCookie, updateOptions || options);
        setLoading(false);
        setLocalFlag(Date.now());
      },
      500
    );
  }, [setLocalFlag, name, getEncrypt, options]);

  const removeCookie = useMemo(() => {
    return debounce(() => {
      if (isWindowNull()) return;
      setLoading(true);
      cookies.remove(name); // Directly remove the cookie
      setCookie(null); // Clear state
      setLoading(false);
      setLocalFlag(Date.now());
    });
  }, [name, setLocalFlag]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const cookieValue = cookies.get(name);
      if (!isCookieValid(cookieValue)) {
        setLoading(false);
        return;
      }
      const decodedCookie = await getDecrypt(cookieValue);
      setCookie({
        name,
        value: decodedCookie,
        options,
      });
      setLoading(false);
    })();
  }, [name]);
  useEffect(() => {
    const handleStorageFlag = async (e: StorageEvent) => {
      if (e.key === localFlagName) {
        setLoading(true);
        const newCookie = cookies.get(name);
        if (!isCookieValid(newCookie)) {
          setCookie(null);
          return;
        }
        const decodedCookie = await getDecrypt(newCookie);
        setCookie({
          name,
          value: decodedCookie,
          options,
        });
        setLoading(false);
      }
    };
    const onChange = async ({
      name: changedName,
      value,
      options: newOptions,
    }: CookieChangeOptions) => {
      if (changedName !== name) return;
      if (!isCookieValid(value)) return;
      setLoading(true);
      const decodedCookie = await getDecrypt(value);
      setCookie((prev) => {
        if (!prev || !isEqual(prev.value, decodedCookie)) {
          return {
            name: changedName,
            value: decodedCookie,
            options: { ...options, ...newOptions },
          };
        }
        return prev;
      });
      setLoading(false);
    };
    (async () => {
      window.addEventListener("storage", handleStorageFlag);
      cookies.addChangeListener(onChange);
    })();
    return () => {
      window.removeEventListener("storage", handleStorageFlag);
      cookies.removeChangeListener(onChange);
      updateCookieValue.cancel?.();
      removeCookie.cancel?.();
    };
  }, [name]);
  return { cookie, updateCookieValue, removeCookie, isLoading } as const;
};
