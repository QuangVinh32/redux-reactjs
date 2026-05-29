import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "./mutex";
import { tokenStorage } from "./tokenStorage";
import { logout, setTokens } from "../redux/slices/authSlice";
import type { RootState } from "../redux/Store";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const refreshMutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken ?? tokenStorage.getAccess();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await refreshMutex.wait();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const release = await refreshMutex.acquire();
    try {
      const refresh = tokenStorage.getRefresh();
      if (!refresh) {
        api.dispatch(logout());
        return result;
      }
      const refreshResult = await rawBaseQuery(
        {
          url: "/api/auth/refresh",
          method: "POST",
          body: { refreshToken: refresh },
        },
        api,
        extraOptions
      );
      const data = refreshResult.data as
        | { accessToken: string; refreshToken: string; expiresInMs: number }
        | undefined;
      if (data?.accessToken) {
        tokenStorage.set(data.accessToken, data.refreshToken);
        api.dispatch(
          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        tokenStorage.clear();
        api.dispatch(logout());
      }
    } finally {
      release();
    }
  }
  return result;
};
