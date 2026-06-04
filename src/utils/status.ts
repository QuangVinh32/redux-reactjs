import type { OrderStatus } from "../types/backend";

export const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELED: "Đã hủy",
};

export const orderStatusColor: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPING: "bg-indigo-100 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELED: "bg-rose-100 text-rose-700 border-rose-200",
};

// Admin state-machine transitions (matches backend OrderService logic)
export const nextAdminStatuses: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELED"],
  CONFIRMED: ["SHIPPING", "CANCELED"],
  SHIPPING: ["COMPLETED", "CANCELED"],
  COMPLETED: [],
  CANCELED: [],
};
