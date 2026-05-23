import { useEffect, useState, useCallback, useRef } from "react";
import { ApiClientError } from "../api/client";

export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
};

/**
 * useApi — chạy 1 async function, expose data/loading/error + reload().
 * Dùng cho display-only data (categories, products list, etc.)
 */
export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fnRef.current();
      setData(res);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload: run };
}
