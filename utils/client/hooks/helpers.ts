/**
 * A safe wrapper around `fetch` for use in React hooks and async operations.
 *
 * @async
 * @function fetcher
 * @param {string} url - The URL to request.
 * @param {AbortSignal} signal - The signal from an AbortController used to cancel the request when needed.
 * @param {boolean} flag - A contextual flag (e.g. `isActive` or `isMounted`) to determine if the result should still be handled.
 * @returns {Promise<any>} The parsed JSON response if the fetch completes and is not aborted or invalidated by the flag.
 *
 * @throws Will throw an error if the fetch fails, except in the case of an `AbortError`.
 *
 * @example
 * const controller = new AbortController();
 * const isMounted = true;
 *
 * useEffect(() => {
 *   fetcher("/api/user", controller.signal, isMounted)
 *     .then(data => {
 *       if (data) setUser(data);
 *     })
 *     .catch(console.error);
 *
 *   return () => {
 *     isMounted = false;
 *     controller.abort();
 *   };
 * }, []);
 *
 * @remarks
 * - Designed to help prevent race conditions in `useEffect`.
 * - You **must** pass `signal` and manage the `flag` (e.g., `isMounted`) externally for full protection.
 * - If `flag` is false or the fetch is aborted, the response is ignored safely.
 */
export async function fetcher<Body>(
  url: string,
  signal: AbortController["signal"],
  flag: boolean
): Promise<Body | null> {
  try {
    if (!flag) return null;
    const res = await fetch(url, { signal });
    if (!flag) return null;
    const data = await res.json();
    if (!flag) return null;
    return data;
  } catch (e: unknown) {
    if ((e as Error).name === "AbortError") {
      console.warn("Abort Error");
      return null;
    }
    return null;
  }
}
