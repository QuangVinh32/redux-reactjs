import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type { CartItem } from "../types/backend";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart", "CartTotal"],
  endpoints: (b) => ({
    getCart: b.query<CartItem[], void>({
      query: () => "/api/carts/items",
      providesTags: ["Cart"],
    }),
    getTotal: b.query<number, void>({
      query: () => "/api/carts/total",
      providesTags: ["CartTotal"],
    }),
    addToCart: b.mutation<
      string,
      { productId: number; productSizeId: number; quantity: number }
    >({
      query: (body) => ({
        url: "/api/carts/add",
        method: "POST",
        body,
        responseHandler: (r) => r.text(),
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    incrementItem: b.mutation<string, { productId: number; productSizeId: number }>({
      query: ({ productId, productSizeId }) => ({
        url: `/api/carts/add/${productId}/${productSizeId}`,
        method: "POST",
        responseHandler: (r) => r.text(),
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    decrementItem: b.mutation<string, { productId: number; productSizeId: number }>({
      query: ({ productId, productSizeId }) => ({
        url: `/api/carts/decrease/${productId}/${productSizeId}`,
        method: "PUT",
        responseHandler: (r) => r.text(),
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    removeItem: b.mutation<string, { productId: number; productSizeId: number }>({
      query: ({ productId, productSizeId }) => ({
        url: `/api/carts/remove/${productId}/${productSizeId}`,
        method: "DELETE",
        responseHandler: (r) => r.text(),
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    clearCart: b.mutation<string, void>({
      query: () => ({
        url: "/api/carts/clear",
        method: "DELETE",
        responseHandler: (r) => r.text(),
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useGetTotalQuery,
  useAddToCartMutation,
  useIncrementItemMutation,
  useDecrementItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApi;
