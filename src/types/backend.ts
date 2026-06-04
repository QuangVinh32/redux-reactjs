// Mirror of shopfood_V2 backend DTOs (com.example.shopfood)
// All field names match the backend response exactly.

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

// ============ Auth ============
export type LoginRequest = { username: string; password: string };

// LoginDTO: userId, fullName, username, image, phone, address, email, role, userAgent, token, refreshToken
export type LoginResponse = {
  userId: number;
  fullName: string;
  username: string;
  image?: string;
  phone?: string;
  address?: string;
  email: string;
  role: Role;
  userAgent?: string;
  token: string;
  refreshToken: string;
};

// TokenPairDTO
export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresInMs: number;
};

// UserForAdmin DTO (used by /me, get-all, {id})
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

// ============ Category ============
// CategoryStatus enum: CAFFE, SODA, TEA
export type CategoryStatus = "CAFFE" | "SODA" | "TEA";

// CategoryDTO: only categoryId, categoryStatus, categoryImage (no description!)
// Note: in /get-all, categoryId comes as String (per controller code); in single GET, as Integer.
export type Category = {
  categoryId: number | string;
  categoryStatus: CategoryStatus | string;
  categoryImage?: string;
};

// ============ Product ============
// ProductSize entity (returned by /api/product_sizes/*)
export type ProductSize = {
  productSizeId: number;
  sizeName: string;
  price: number;
  discount: number;
  quantity: number;
};

// ProductSizeDTO nested inside ProductForUser.sizes (NO productSizeId!)
export type ProductSizeNested = {
  sizeName: string;
  price: number;
  discount: number;
  quantity: number;
};

// ProductForAdmin DTO — used by /get-all (list) and /admin/{id}
export type ProductSummary = {
  productId: number;
  productName: string;
  productImages: string[]; // backend returns array of URL strings
  categoryId: number;
  categoryStatus?: CategoryStatus | string;
  categoryImage?: string;
};

// ProductForUser DTO — used by /user/{id} (single product detail)
// NOTE: no productId — caller knows it from the URL
export type ProductDetail = {
  productName: string;
  description?: string;
  productImages: string[]; // URL strings
  sizes: ProductSizeNested[]; // no productSizeId here — call /product_sizes/product/{id} for that
  reviews: Review[];
  categoryId?: number;
  categoryImage?: string;
  categoryStatus?: CategoryStatus | string;
};

// ============ Banner ============
// BannerDTO: bannerId, bannerName, bannerImage, description (no title/redirectUrl)
export type Banner = {
  bannerId: number;
  bannerName?: string;
  bannerImage?: string;
  description?: string;
};

// ============ Cart ============
// /api/carts/items returns List<CartDetail> — full entity with nested Product + ProductSize
export type CartItem = {
  product: {
    productId: number;
    productName: string;
    description?: string;
    productImages?: { productImageId: number; productImageName?: string }[];
  };
  productSize: ProductSize; // has productSizeId
  quantity: number;
};

// ============ Shipping ============
// ShippingAddress entity — primary key is `id`, default flag is `isDefault`
export type ShippingAddress = {
  id: number;
  receiverName: string;
  receiverPhone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  province?: string;
  isDefault: boolean;
};

// ============ Order ============
// OrderStatus enum: PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELED (no DELIVERED, no RETURNED)
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELED";

export type PaymentMethod = "COD" | "MOMO";

// OrderDetailDTO: productName, productSizeId, sizeName, quantity, price (Double), discountApplied (Integer)
export type OrderDetail = {
  productName: string;
  productSizeId?: number;
  sizeName?: string;
  quantity: number;
  price: number;
  discountApplied?: number;
};

// OrderGetDTO — used by /me (list), /admin/orders (list)
// OrderDTO — used by /{id} (single) and updateOrder, with only orderId/totalAmount/status/createdAt/fullName/orderDetails
// FE unifies both — fields beyond the intersection are optional.
export type Order = {
  orderId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  fullName?: string;
  // present only on OrderGetDTO (/me, /admin/orders):
  originalAmount?: number;
  discountAmount?: number;
  phone?: string;
  address?: string;
  // not in any DTO yet — may appear if backend later exposes paymentMethod field from Order entity
  paymentMethod?: PaymentMethod;
  orderDetails: OrderDetail[];
};

export type CheckoutResponse = {
  orderId: number;
  paymentMethod: PaymentMethod;
  nextStep: string;
};

// ============ Voucher ============
// DiscountType enum: FIXED, PERCENT
export type DiscountType = "FIXED" | "PERCENT";

// VoucherTarget enum: ALL, USER, NEW_USER, VIP
export type VoucherTarget = "ALL" | "USER" | "NEW_USER" | "VIP";

// VoucherStatus enum: DRAFT, ACTIVE, EXPIRED, DISABLED
export type VoucherStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "DISABLED";

// VoucherScope enum: ORDER (default)
export type VoucherScope = "ORDER" | "SHIPPING";

// Voucher entity (returned directly by VoucherController, not wrapped in DTO)
export type Voucher = {
  voucherId: number;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  scope?: VoucherScope;
  target: VoucherTarget;
  usageLimitGlobal?: number;
  usageLimitPerUser?: number;
  usedCount: number;
  status: VoucherStatus;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
};

// ============ Notification ============
// NotificationType enum: ALL, PRIVATE, PUBLIC
export type NotificationType = "ALL" | "PRIVATE" | "PUBLIC";
export type NotificationStatusValue = "READ" | "UNREAD";

// NotificationDTO: notificationId, title, description, type (String!), status (String), redirectUrl, createdAt
export type Notification = {
  notificationId: number;
  title: string;
  description: string;
  type: NotificationType; // ← BE uses `type`, NOT `notificationType`
  status: NotificationStatusValue;
  redirectUrl?: string;
  createdAt: string;
};

// NotificationRequest (for admin POST) uses `notificationType`
export type NotificationRequestBody = {
  notificationType: NotificationType;
  title: string;
  description: string;
  redirectUrl?: string;
  userId?: number;
};

// ============ Review ============
// UserDTO embedded inside ReviewDTO
export type ReviewUser = {
  fullName: string;
  image?: string;
};

// ReviewDTO: rating, reviewText, createdAt, userDTO
export type Review = {
  rating: number;
  reviewText: string;
  createdAt: string;
  userDTO?: ReviewUser;
};

// ============ Misc ============
export type Revenue = {
  originalRevenue: number;
  totalDiscount: number;
  netRevenue: number;
};

// VoucherApplyResult DTO
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
