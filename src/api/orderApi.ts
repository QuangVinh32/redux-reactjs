import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  ApplyVoucherResult,
  CheckoutResponse,
  Order,
  OrderStatus,
  Page,
  PaymentMethod,
  Revenue,
} from "../types/backend";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Order", "Revenue"],
  endpoints: (b) => ({
    checkout: b.mutation<
      CheckoutResponse,
      {
        shippingAddressId: number;
        voucherCode?: string;
        note?: string;
        paymentMethod?: PaymentMethod;
      }
    >({
      query: (p) => ({
        url: "/api/v1/orders/checkout",
        method: "POST",
        params: {
          shippingAddressId: p.shippingAddressId,
          voucherCode: p.voucherCode || undefined,
          note: p.note || undefined,
          paymentMethod: p.paymentMethod ?? "COD",
        },
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    applyVoucher: b.mutation<ApplyVoucherResult, { orderId: number; code: string }>(
      {
        query: ({ orderId, code }) => ({
          url: `/api/v1/orders/${orderId}/apply-voucher`,
          method: "POST",
          params: { code },
        }),
        invalidatesTags: (_r, _e, a) => [{ type: "Order", id: a.orderId }],
      }
    ),
    getOrder: b.query<Order, number>({
      query: (id) => `/api/v1/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
    myOrders: b.query<
      Page<Order>,
      { page?: number; size?: number; idDesc?: boolean }
    >({
      query: (p = {}) => ({
        url: "/api/v1/orders/me",
        params: {
          page: p.page ?? 0,
          size: p.size ?? 10,
          idDesc: p.idDesc ?? true,
        },
      }),
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    // backend PUT /{orderId} takes `UpdateOrder { status }` as JSON body
    updateStatus: b.mutation<Order, { orderId: number; status: OrderStatus }>({
      query: ({ orderId, status }) => ({
        url: `/api/v1/orders/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_r, _e, a) => [
        { type: "Order", id: a.orderId },
        { type: "Order", id: "LIST" },
        "Revenue",
      ],
    }),
    deleteOrder: b.mutation<void, number>({
      query: (id) => ({ url: `/api/v1/orders/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    adminOrders: b.query<
      Page<Order>,
      { page?: number; size?: number; search?: string; userId?: number; status?: OrderStatus }
    >({
      query: (p = {}) => ({
        url: "/api/v1/orders/admin/orders",
        params: {
          page: p.page ?? 0,
          size: p.size ?? 20,
          search: p.search,
          userId: p.userId,
          status: p.status,
        },
      }),
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    revenue: b.query<Revenue, void>({
      query: () => "/api/v1/orders/admin/revenue",
      providesTags: ["Revenue"],
    }),
  }),
});

export const {
  useCheckoutMutation,
  useApplyVoucherMutation,
  useGetOrderQuery,
  useMyOrdersQuery,
  useUpdateStatusMutation,
  useDeleteOrderMutation,
  useAdminOrdersQuery,
  useRevenueQuery,
} = orderApi;
