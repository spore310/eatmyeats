import { useEffect, useMemo, useState } from "react";
import { deSerialize, keyIdGenerator, serialize } from "./helpers";

interface useFetchOptions {
  cache?: boolean;
  revalidation?: number;
  signal?: AbortController["signal"];
}
interface useFetchResponse<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
}
export const useFetch = <T>(
  propKey: string,
  apiUrl: string,
  options?: useFetchOptions
): useFetchResponse<T> => {
  const { cache = false, revalidation = 0, signal } = options || {};
  const key = useMemo(() => keyIdGenerator(propKey), [propKey]);
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const abort = new AbortController();
    const currentSignal = signal ?? abort.signal;
    const fetchData = async () => {
      setLoading(true);
      if (cache) {
        const cacheData = deSerialize<T>(key, revalidation);
        if (cacheData) {
          setLoading(false);
          setData(cacheData.data);
          return;
        }
      }
      try {
        const response = await fetch(apiUrl, { signal: currentSignal });
        if (response.ok) {
          setError(undefined);
          const data = await response.json();
          if (cache) {
            serialize<T>(key, data);
          }
          setLoading(false);
          setData(data);
        }
      } catch (e: unknown) {
        setLoading(false);
        if ((e as Error).name !== "AbortError") {
          setError(new Error("Faild to fetch Data"));
        }
      }
    };
    fetchData();

    return () => {
      abort.abort();
    };
  }, [key, apiUrl, options?.cache, options?.signal, options?.revalidation]);
  return { data, loading, error } as const;
};
