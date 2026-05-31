// Mirror of shopfood_V2 backend DTOs

export type Role = "USER" | "MANAGER" | "ADMIN";

export type Page<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type LoginRequest = { username: string; password: string };

export type LoginResponse = {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  image: string;
  token: string;
  refreshToken: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresInMs: number;
};

export type User = {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  image?: string;
  phone?: string;
  address?: string;
};

export type Category = {
  categoryId: number;
  categoryStatus: string;
  categoryImage?: string;
  description?: string;
};

export type ProductSize = {
  productSizeId: number;
  sizeName: string;
  price: number;
  discount: number;
  quantity: number;
};

export type ProductImage = { productImageId: number};

export type Product = {
  productId: number;
  productName: string;
  description?: string;
  categoryId: number;
  categoryStatus?: string;
  productImages: ProductImage[];
  productSizes: ProductSize[];
  averageRating?: number;
};

export type Banner = {
  bannerId: number;
  title: string;
  image: string;
  redirectUrl?: string;
};

export type CartDetail = {
  cartDetailId: number;
  productId: number;
  productName: string;
  image: string;
  sizeId: number;
  sizeName: string;
  price: number;
  discount: number;
  quantity: number;
  subTotal: number;
};

export type ShippingAddress = {
  shippingAddressId: number;
  receiverName: string;
  receiverPhone: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  default: boolean;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELED"
  | "RETURNED";

export type PaymentMethod = "COD" | "MOMO";

export type OrderDetail = {
  orderDetailId: number;
  productId: number;
  productName: string;
  image: string;
  sizeId: number;
  sizeName: string;
  price: number;
  discount: number;
  quantity: number;
};

export type Order = {
  orderId: number;
  userId: number;
  fullName: string;
  receiverName?: string;
  receiverPhone?: string;
  shippingAddress?: string;
  shippingFee: number;
  note?: string;
  originalAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  voucherCode?: string;
  createdAt: string;
  orderDetails: OrderDetail[];
};

export type CheckoutResponse = {
  orderId: number;
  paymentMethod: PaymentMethod;
  nextStep: string;
};

export type VoucherType = "PERCENT" | "AMOUNT";
export type VoucherTarget = "ALL" | "USER";
export type VoucherStatus = "ACTIVE" | "INACTIVE";

export type Voucher = {
  voucherId: number;
  code: string;
  description?: string;
  discountType: VoucherType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  usageLimitGlobal?: number;
  usageLimitPerUser?: number;
  usedCount: number;
  target: VoucherTarget;
  status: VoucherStatus;
  startDate: string;
  endDate: string;
};

export type Notification = {
  notificationId: number;
  title: string;
  description: string;
  redirectUrl?: string;
  notificationType: "ALL" | "USER";
  status: "READ" | "UNREAD";
  createdAt: string;
};

export type Review = {
  reviewId: number;
  productId: number;
  userId: number;
  userFullName: string;
  userImage?: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

export type Revenue = {
  originalRevenue: number;
  totalDiscount: number;
  netRevenue: number;
};

export type ApplyVoucherResult = {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
};

export type ApiErrorBody = {
  timestamp?: number;
  code?: number;
  path?: string;
  message?: string;
  errors?: Record<string, string>;
};
