// Types match backend DTOs (com.shopbm.Model.DTO + Request)

export type ApiUser = {
  id: number;
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  avatarUrl?: string;
  balance: number;
  discountPercent: number;
  role: "USER" | "STAFF" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFY";
  refCode?: string;
  createdAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    role: string;
    balance: number;
    discountPercent: number;
    refCode?: string;
  };
};

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  productCount: number;
};

export type ApiProduct = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  stock: number;
  badge?: "HOT" | "NEW" | "SALE";
  imageUrl?: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ApiCartItem = {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type ApiCart = {
  id: number;
  items: ApiCartItem[];
  subtotal: number;
  totalQuantity: number;
};

export type ApiOrderItem = {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  deliveredContent?: string;
};

export type ApiOrder = {
  id: number;
  orderCode: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  status: string;
  paymentMethod?: string;
  couponCode?: string;
  note?: string;
  createdAt: string;
  completedAt?: string;
  items: ApiOrderItem[];
};

export type ApiTransaction = {
  id: number;
  type: string;
  method?: string;
  amount: number;
  bonusAmount: number;
  netAmount: number;
  balanceAfter: number;
  status: string;
  referenceCode?: string;
  orderId?: number;
  description?: string;
  createdAt: string;
  completedAt?: string;
};

export type ApiPaymentMethod = {
  id: number;
  code: string;
  name: string;
  icon?: string;
  bonusPercent: number;
  feePercent: number;
  minAmount?: number;
  maxAmount?: number;
  active: boolean;
  displayOrder: number;
};

export type ApiSettings = {
  theme: "LIGHT" | "DARK" | "TET" | "CHRISTMAS" | "HALLOWEEN";
  language: "VI" | "EN";
  currency: "VND" | "USD";
  fontScale: "SM" | "MD" | "LG";
  compactMode: boolean;
  enableNotifications: boolean;
  enableSound: boolean;
  enableDecorations: boolean;
};

export type ApiAffiliateStats = {
  totalClicks: number;
  totalReferrals: number;
  totalCommissionEarned: number;
  totalCommissionPaid: number;
  totalRevenue: number;
  currentTier: string;
  currentRate: number;
  refCode: string;
  referralLink: string;
};

export type ApiNotification = {
  id: number;
  type: string;
  title: string;
  body?: string;
  linkUrl?: string;
  readAt?: string;
  createdAt: string;
};

export type ApiError = {
  status: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
  details?: Record<string, string>;
};
