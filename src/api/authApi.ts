import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type { LoginRequest, LoginResponse, TokenPair, User } from "../types/backend";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me"],
  endpoints: (b) => ({
    login: b.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/api/login", method: "POST", body }),
    }),
    register: b.mutation<string, FormData>({
      query: (body) => ({
        url: "/api/register",
        method: "POST",
        body,
        responseHandler: (r) => r.text(),
      }),
    }),
    refresh: b.mutation<TokenPair, { refreshToken: string }>({
      query: (body) => ({ url: "/api/auth/refresh", method: "POST", body }),
    }),
    logout: b.mutation<string, { refreshToken: string }>({
      query: (body) => ({
        url: "/api/auth/logout",
        method: "POST",
        body,
        responseHandler: (r) => r.text(),
      }),
    }),
    verifyEmail: b.mutation<string, { token: string }>({
      query: ({ token }) => ({
        url: `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        method: "GET",
        responseHandler: (r) => r.text(),
      }),
    }),
    forgotPassword: b.mutation<string, { email: string }>({
      query: ({ email }) => ({
        url: `/api/auth/forgot-password?email=${encodeURIComponent(email)}`,
        method: "POST",
        responseHandler: (r) => r.text(),
      }),
    }),
    resetPassword: b.mutation<string, { token: string; newPassword: string }>({
      query: ({ token, newPassword }) => ({
        url: `/api/auth/reset-password?token=${encodeURIComponent(
          token
        )}&newPassword=${encodeURIComponent(newPassword)}`,
        method: "POST",
        responseHandler: (r) => r.text(),
      }),
    }),
    me: b.query<User, void>({
      query: () => "/api/v1/users/me",
      providesTags: ["Me"],
    }),
    changePassword: b.mutation<
      string,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/api/v1/users/me/change-password",
        method: "POST",
        body,
        responseHandler: (r) => r.text(),
      }),
    }),
    updateProfile: b.mutation<
      User,
      { userId: number; body: Partial<User> }
    >({
      query: ({ userId, body }) => ({
        url: `/api/v1/users/edit/${userId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useMeQuery,
  useLazyMeQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;
