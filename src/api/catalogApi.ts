import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  Banner,
  Category,
  Page,
  ProductDetail,
  ProductSize,
  ProductSummary,
  Review,
} from "../types/backend";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Category", "Banner", "ProductSize", "Review"],
  endpoints: (b) => ({
    // products
    listProducts: b.query<
      Page<ProductSummary>,
      { page?: number; size?: number; sort?: string; categoryId?: number; q?: string }
    >({
      query: (p = {}) => ({
        url: "/api/products/get-all",
        params: {
          page: p.page ?? 0,
          size: p.size ?? 12,
          sort: p.sort ?? "productId",
          categoryId: p.categoryId,
          q: p.q,
        },
      }),
      providesTags: (res) =>
        res
          ? [
              ...res.content.map((x) => ({ type: "Product" as const, id: x.productId })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    getProductUser: b.query<ProductDetail, number>({
      query: (id) => `/api/products/user/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),
    getProductAdmin: b.query<ProductSummary, number>({
      query: (id) => `/api/products/admin/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),
    createProduct: b.mutation<ProductSummary, FormData>({
      query: (body) => ({ url: "/api/products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: b.mutation<ProductSummary, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/api/products/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, a) => [
        { type: "Product", id: a.id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: b.mutation<void, number>({
      query: (id) => ({ url: `/api/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // product sizes (separate endpoint that DOES include productSizeId)
    getSizesByProduct: b.query<ProductSize[], number>({
      query: (productId) => `/api/product_sizes/product/${productId}`,
      providesTags: (_r, _e, productId) => [{ type: "ProductSize", id: productId }],
    }),
    bulkUpsertSizes: b.mutation<
      void,
      { productId: number; sizes: Partial<ProductSize>[] }
    >({
      query: ({ productId, sizes }) => ({
        url: `/api/product_sizes/bulk/${productId}`,
        method: "POST",
        body: sizes,
      }),
      invalidatesTags: (_r, _e, a) => [
        { type: "ProductSize", id: a.productId },
        { type: "Product", id: a.productId },
      ],
    }),

    // categories
    listCategories: b.query<Page<Category>, { page?: number; size?: number }>({
      query: (p = {}) => ({
        url: "/api/categories/get-all",
        params: { page: p.page ?? 0, size: p.size ?? 100 },
      }),
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    createCategory: b.mutation<Category, FormData>({
      query: (body) => ({ url: "/api/categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: b.mutation<Category, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/api/categories/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    deleteCategory: b.mutation<void, number>({
      query: (id) => ({ url: `/api/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // banners
    listBanners: b.query<Page<Banner>, { page?: number; size?: number }>({
      query: (p = {}) => ({
        url: "/api/banners",
        params: { page: p.page ?? 0, size: p.size ?? 10 },
      }),
      providesTags: [{ type: "Banner", id: "LIST" }],
    }),
    createBanner: b.mutation<Banner, FormData>({
      query: (body) => ({ url: "/api/banners", method: "POST", body }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
    updateBanner: b.mutation<Banner, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/api/banners/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
    deleteBanner: b.mutation<void, number>({
      query: (id) => ({ url: `/api/banners/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),

    // reviews — /api/reviews returns ALL reviews; filter client-side by product
    listAllReviews: b.query<Review[], void>({
      query: () => `/api/reviews`,
      providesTags: [{ type: "Review", id: "LIST" }],
    }),
    createReview: b.mutation<
      string,
      { productId: number; rating: number; reviewText: string }
    >({
      query: (body) => ({
        url: "/api/reviews",
        method: "POST",
        body,
        responseHandler: (r) => r.text(),
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
    deleteReview: b.mutation<void, number>({
      query: (id) => ({ url: `/api/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  }),
});

export const {
  useListProductsQuery,
  useGetProductUserQuery,
  useGetProductAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSizesByProductQuery,
  useBulkUpsertSizesMutation,
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useListAllReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = catalogApi;
