import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type { CartDetail } from "../types/backend";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart", "CartTotal"],
  endpoints: (b) => ({
    getCart: b.query<CartDetail[], void>({
      query: () => "/api/carts/items",
      providesTags: ["Cart"],
    }),
    getTotal: b.query<number, void>({
      query: () => "/api/carts/total",
      providesTags: ["CartTotal"],
    }),
    addToCart: b.mutation<
      void,
      { productId: number; productSizeId: number; quantity: number }
    >({
      query: (body) => ({ url: "/api/carts/add", method: "POST", body }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    incrementItem: b.mutation<void, { productId: number; productSizeId: number }>({
      query: ({ productId, productSizeId }) => ({
        url: `/api/carts/add/${productId}/${productSizeId}`,
        method: "POST",
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    decrementItem: b.mutation<void, { productId: number; productSizeId: number }>({
      query: ({ productId, productSizeId }) => ({
        url: `/api/carts/decrease/${productId}/${productSizeId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    removeItem: b.mutation<void, { productId: number; productSizeId: number }>({
      query: ({ productId, productSizeId }) => ({
        url: `/api/carts/remove/${productId}/${productSizeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart", "CartTotal"],
    }),
    clearCart: b.mutation<void, void>({
      query: () => ({ url: "/api/carts/clear", method: "DELETE" }),
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
