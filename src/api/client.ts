import type { ApiError } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const TOKEN_KEY = "shop_access_token";
const REFRESH_KEY = "shop_refresh_token";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiClientError extends Error {
  status: number;
  details?: Record<string, string>;
  constructor(body: ApiError) {
    super(body.message || body.error || `HTTP ${body.status}`);
    this.status = body.status;
    this.details = body.details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  isFormData?: boolean;
};

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;
  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) {
        tokenStorage.clear();
        return null;
      }
      const data = await res.json();
      tokenStorage.set(data.accessToken, data.refreshToken);
      return data.accessToken as string;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, skipAuth = false, isFormData = false } = opts;

  const doFetch = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (token && !skipAuth) headers["Authorization"] = `Bearer ${token}`;
    return fetch(buildUrl(path, query), {
      method,
      headers,
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch(skipAuth ? null : tokenStorage.getAccess());

  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = isJson
      ? data
      : { status: res.status, error: res.statusText, message: String(data) };
    throw new ApiClientError(err);
  }
  return data as T;
}
