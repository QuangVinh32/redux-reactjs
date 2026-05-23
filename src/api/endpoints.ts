import { api } from "./client";
import type {
  AuthResponse, ApiUser, ApiCategory, ApiProduct, PageResponse,
  ApiCart, ApiOrder, ApiTransaction, ApiPaymentMethod, ApiSettings,
  ApiAffiliateStats, ApiNotification,
} from "./types";

// ===== AUTH =====
export const authApi = {
  login: (usernameOrEmail: string, password: string) =>
    api<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: { usernameOrEmail, password },
      skipAuth: true,
    }),

  register: (req: {
    username: string;
    email: string;
    phone: string;
    password: string;
    refCode?: string;
  }) =>
    api<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: req,
      skipAuth: true,
    }),

  logout: () => api<void>("/api/v1/auth/logout", { method: "POST" }),
};

// ===== USER =====
export const userApi = {
  me: () => api<ApiUser>("/api/v1/me"),
  wallet: () => api<{ balance: number; discountPercent: number }>("/api/v1/me/wallet"),
  updateProfile: (req: { fullName?: string; email?: string; phone?: string }) =>
    api<ApiUser>("/api/v1/me/profile", { method: "PUT", body: req }),
  setAvatar: (avatarUrl: string) =>
    api<ApiUser>("/api/v1/me/avatar", { method: "PUT", body: { avatarUrl } }),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api<{ url: string }>("/api/v1/me/avatar/upload", {
      method: "POST",
      body: fd,
      isFormData: true,
    });
  },
  changePassword: (currentPassword: string, newPassword: string) =>
    api<void>("/api/v1/me/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
    }),
};

// ===== SETTINGS =====
export const settingsApi = {
  get: () => api<ApiSettings>("/api/v1/me/settings"),
  update: (patch: Partial<ApiSettings>) =>
    api<ApiSettings>("/api/v1/me/settings", { method: "PUT", body: patch }),
  reset: () => api<ApiSettings>("/api/v1/me/settings/reset", { method: "POST" }),
};

// ===== CATALOG =====
export const catalogApi = {
  categories: () => api<ApiCategory[]>("/api/v1/categories", { skipAuth: true }),
  products: (params: { categoryId?: number; q?: string; page?: number; size?: number; sort?: string } = {}) =>
    api<PageResponse<ApiProduct>>("/api/v1/products", { query: params, skipAuth: true }),
  featured: () => api<ApiProduct[]>("/api/v1/products/featured", { skipAuth: true }),
  latest: () => api<ApiProduct[]>("/api/v1/products/latest", { skipAuth: true }),
  detail: (slug: string) =>
    api<ApiProduct>(`/api/v1/products/${encodeURIComponent(slug)}`, { skipAuth: true }),
};

// ===== CART =====
export const cartApi = {
  view: () => api<ApiCart>("/api/v1/cart"),
  add: (productId: number, quantity = 1) =>
    api<ApiCart>("/api/v1/cart/items", { method: "POST", body: { productId, quantity } }),
  remove: (itemId: number) =>
    api<ApiCart>(`/api/v1/cart/items/${itemId}`, { method: "DELETE" }),
  clear: () => api<void>("/api/v1/cart", { method: "DELETE" }),
};

// ===== ORDERS =====
export const orderApi = {
  checkout: (req: {
    items: { productId: number; quantity: number }[];
    couponCode?: string;
    note?: string;
  }) => api<ApiOrder>("/api/v1/orders", { method: "POST", body: req }),
  myOrders: (params: { page?: number; size?: number } = {}) =>
    api<PageResponse<ApiOrder>>("/api/v1/me/orders", { query: params }),
  stats: () =>
    api<Record<string, number>>("/api/v1/me/orders/stats"),
  detail: (id: number) => api<ApiOrder>(`/api/v1/orders/${id}`),
};

// ===== WALLET =====
export const walletApi = {
  paymentMethods: () => api<ApiPaymentMethod[]>("/api/v1/payment-methods", { skipAuth: true }),
  recharge: (methodCode: string, amount: number) =>
    api<ApiTransaction>("/api/v1/wallet/recharges", { method: "POST", body: { methodCode, amount } }),
  transactions: (params: { page?: number; size?: number } = {}) =>
    api<PageResponse<ApiTransaction>>("/api/v1/me/transactions", { query: params }),
};

// ===== AFFILIATE =====
export const affiliateApi = {
  stats: () => api<ApiAffiliateStats>("/api/v1/me/affiliate/stats"),
};

// ===== COUPON =====
export const couponApi = {
  validate: (code: string, subtotal?: number) =>
    api<{ code: string; type: string; value: number; description: string; discount: number }>(
      "/api/v1/coupons/validate",
      { query: { code, subtotal } }
    ),
};

// ===== NOTIFICATIONS =====
export const notificationApi = {
  list: (params: { page?: number; size?: number } = {}) =>
    api<PageResponse<ApiNotification>>("/api/v1/me/notifications", { query: params }),
  unread: () => api<{ unread: number }>("/api/v1/me/notifications/unread-count"),
  markRead: (id: number) =>
    api<ApiNotification>(`/api/v1/me/notifications/${id}/read`, { method: "POST" }),
  markAllRead: () => api<{ updated: number }>("/api/v1/me/notifications/read-all", { method: "POST" }),
};
