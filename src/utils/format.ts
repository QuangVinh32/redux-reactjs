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

export const fileUrl = (img: string | undefined) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  if (img.startsWith("/")) return `${base}${img}`;
  return `${base}/files/image/${img}`;
};
