import type { CartItem } from "../types/backend";

export const formatVND = (n: number | undefined | null) => {
  if (n == null) return "0₫";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
};

export const formatDate = (iso: string | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const priceAfterDiscount = (price: number, discount: number) =>
  Math.round((price * (100 - discount)) / 100);

// Backend serves image files under /files/image/{fileName}. URLs that come back
// already-prefixed (ProductForUser, CategoryDTO) are passed through; bare file
// names (from raw entity fields like productImageName) are prefixed.
export const fileUrl = (img: string | undefined | null) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  if (img.startsWith("/")) return `${base}${img}`;
  return `${base}/files/image/${img}`;
};

// ===== CartItem accessors (backend returns nested entity shape) =====
export const cartItemProductId = (it: CartItem) => it.product.productId;
export const cartItemSizeId = (it: CartItem) => it.productSize.productSizeId;
export const cartItemSizeName = (it: CartItem) => it.productSize.sizeName;
export const cartItemProductName = (it: CartItem) => it.product.productName;
export const cartItemUnitPrice = (it: CartItem) =>
  priceAfterDiscount(it.productSize.price, it.productSize.discount ?? 0);
export const cartItemImageUrl = (it: CartItem) => {
  const raw = it.product.productImages?.[0]?.productImageName;
  return raw ? fileUrl(raw) : "";
};
