import type { PaymentMethod } from "../types/backend";

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  COD: "Tiền mặt khi nhận",
  MOMO: "Ví Momo",
};

export const paymentMethodShortLabel: Record<PaymentMethod, string> = {
  COD: "COD",
  MOMO: "Momo",
};

export const paymentMethodIcon: Record<PaymentMethod, string> = {
  COD: "💵",
  MOMO: "📱",
};

export const paymentMethodColor: Record<PaymentMethod, string> = {
  COD: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MOMO: "bg-pink-50 text-pink-700 border-pink-200",
};
