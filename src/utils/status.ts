import type { OrderStatus } from "../types/backend";

export const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn tất",
  CANCELED: "Đã hủy",
  RETURNED: "Đã trả hàng",
};

export const orderStatusColor: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPING: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELED: "bg-rose-100 text-rose-700 border-rose-200",
  RETURNED: "bg-gray-100 text-gray-700 border-gray-200",
};

export const nextAdminStatuses: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELED"],
  CONFIRMED: ["SHIPPING", "CANCELED"],
  SHIPPING: ["DELIVERED", "RETURNED"],
  DELIVERED: ["COMPLETED", "RETURNED"],
  COMPLETED: [],
  CANCELED: [],
  RETURNED: [],
};
