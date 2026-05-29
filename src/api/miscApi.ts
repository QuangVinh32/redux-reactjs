import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  Notification,
  Product,
  ShippingAddress,
  User,
  Voucher,
} from "../types/backend";

export const miscApi = createApi({
  reducerPath: "miscApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ShippingAddress", "Voucher", "Notification", "Favourite", "User"],
  endpoints: (b) => ({
    // ===== Shipping =====
    listAddresses: b.query<ShippingAddress[], void>({
      query: () => "/api/shipping-addresses",
      providesTags: ["ShippingAddress"],
    }),
    createAddress: b.mutation<ShippingAddress, Omit<ShippingAddress, "shippingAddressId">>({
      query: (body) => ({ url: "/api/shipping-addresses", method: "POST", body }),
      invalidatesTags: ["ShippingAddress"],
    }),
    updateAddress: b.mutation<
      ShippingAddress,
      { id: number; body: Omit<ShippingAddress, "shippingAddressId"> }
    >({
      query: ({ id, body }) => ({
        url: `/api/shipping-addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    deleteAddress: b.mutation<void, number>({
      query: (id) => ({ url: `/api/shipping-addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["ShippingAddress"],
    }),

    // ===== Voucher =====
    listMyVouchers: b.query<Voucher[], void>({
      query: () => "/api/v1/vouchers/user",
      providesTags: [{ type: "Voucher", id: "USER_LIST" }],
    }),
    getVoucherByCode: b.query<Voucher, string>({
      query: (code) => `/api/v1/vouchers/${encodeURIComponent(code)}`,
    }),
    listVouchersAdmin: b.query<Voucher[], void>({
      query: () => "/api/v1/vouchers/admin",
      providesTags: [{ type: "Voucher", id: "ADMIN_LIST" }],
    }),
    createVoucher: b.mutation<Voucher, Partial<Voucher>>({
      query: (body) => ({ url: "/api/v1/vouchers", method: "POST", body }),
      invalidatesTags: [{ type: "Voucher", id: "ADMIN_LIST" }],
    }),
    updateVoucher: b.mutation<Voucher, { id: number; body: Partial<Voucher> }>({
      query: ({ id, body }) => ({
        url: `/api/v1/vouchers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Voucher", id: "ADMIN_LIST" }],
    }),
    deleteVoucher: b.mutation<void, number>({
      query: (id) => ({ url: `/api/v1/vouchers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Voucher", id: "ADMIN_LIST" }],
    }),

    // ===== Notification =====
    myNotifications: b.query<Notification[], void>({
      query: () => "/api/notifications",
      providesTags: ["Notification"],
    }),
    markRead: b.mutation<void, number>({
      query: (id) => ({ url: `/api/notifications/${id}/read`, method: "PUT" }),
      invalidatesTags: ["Notification"],
    }),
    markAllRead: b.mutation<void, void>({
      query: () => ({ url: "/api/notifications/read-all", method: "PUT" }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: b.mutation<void, number>({
      query: (id) => ({ url: `/api/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notification"],
    }),
    adminListNotifications: b.query<Notification[], void>({
      query: () => "/api/notifications/admin",
      providesTags: ["Notification"],
    }),
    createMassNotification: b.mutation<
      Notification,
      { title: string; description: string; redirectUrl?: string; notificationType: "ALL" | "USER" }
    >({
      query: (body) => ({ url: "/api/notifications", method: "POST", body }),
      invalidatesTags: ["Notification"],
    }),

    // ===== Favourite =====
    listFavourites: b.query<Product[], void>({
      query: () => "/api/favourites",
      providesTags: ["Favourite"],
    }),
    toggleFavourite: b.mutation<boolean, number>({
      query: (productId) => ({
        url: `/api/favourites/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Favourite"],
    }),
    checkFavourite: b.query<boolean, number>({
      query: (productId) => `/api/favourites/${productId}/check`,
      providesTags: (_r, _e, id) => [{ type: "Favourite", id }],
    }),

    // ===== User (admin) =====
    listUsers: b.query<User[], void>({
      query: () => "/api/v1/users/get-all",
      providesTags: ["User"],
    }),
    getUser: b.query<User, number>({
      query: (id) => `/api/v1/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),
    createUser: b.mutation<User, FormData>({
      query: (body) => ({ url: "/api/v1/users/create", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    deleteUser: b.mutation<void, number>({
      query: (id) => ({ url: `/api/v1/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),

    // ===== Payment =====
    createMomoPayment: b.mutation<{ payUrl: string }, number>({
      query: (orderId) => ({
        url: "/api/payments/momo/create",
        method: "POST",
        params: { orderId },
      }),
    }),
  }),
});

export const {
  useListAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useListMyVouchersQuery,
  useGetVoucherByCodeQuery,
  useLazyGetVoucherByCodeQuery,
  useListVouchersAdminQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  useMyNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
  useAdminListNotificationsQuery,
  useCreateMassNotificationMutation,
  useListFavouritesQuery,
  useToggleFavouriteMutation,
  useCheckFavouriteQuery,
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useCreateMomoPaymentMutation,
} = miscApi;
