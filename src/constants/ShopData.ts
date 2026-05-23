export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  count: number;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  badge?: "HOT" | "NEW" | "SALE";
  description: string;
  image: string;
};

export type NavItem = {
  label: string;
  path: string;
  icon?: string;
  children?: { label: string; path: string }[];
};

export const categories: Category[] = [
  {
    id: "bm-normal",
    name: "BM Thường",
    slug: "bm-thuong",
    icon: "🏢",
    description: "Tài khoản BM Facebook thường, đã verify email",
    count: 248,
  },
  {
    id: "bm-verified",
    name: "BM Xác Minh Doanh Nghiệp",
    slug: "bm-xac-minh",
    icon: "✅",
    description: "BM Real Full Giấy Tờ, đã xác minh doanh nghiệp",
    count: 96,
  },
  {
    id: "bm-limit",
    name: "BM Limit Cao",
    slug: "bm-limit-cao",
    icon: "💎",
    description: "BM tăng limit, dùng chạy ads dài hạn",
    count: 134,
  },
  {
    id: "via",
    name: "Via Facebook",
    slug: "via-facebook",
    icon: "👤",
    description: "Tài khoản Facebook cá nhân kháng XMDT",
    count: 412,
  },
  {
    id: "fanpage",
    name: "Fanpage / Group",
    slug: "fanpage-group",
    icon: "📢",
    description: "Fanpage có sẵn followers, group sỉ lẻ",
    count: 58,
  },
  {
    id: "service",
    name: "Dịch Vụ Tương Tác",
    slug: "dich-vu",
    icon: "🚀",
    description: "Tăng like, share, follower, comment",
    count: 25,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    categoryId: "bm-normal",
    name: "BM 250$ – Tạo Sẵn",
    price: 350000,
    oldPrice: 450000,
    stock: 42,
    badge: "HOT",
    description: "BM limit 250$, đã đổi info, sẵn sàng chạy ads.",
    image: "🟦",
  },
  {
    id: "p2",
    categoryId: "bm-normal",
    name: "BM 50$ Cổ – Trust 2018",
    price: 220000,
    stock: 18,
    description: "BM cổ đời 2018, ít bị checkpoint.",
    image: "🟦",
  },
  {
    id: "p3",
    categoryId: "bm-verified",
    name: "BM XMDT Real – Full Giấy Tờ",
    price: 1450000,
    oldPrice: 1800000,
    stock: 7,
    badge: "SALE",
    description: "BM xác minh doanh nghiệp thật, có giấy tờ pháp lý.",
    image: "🟩",
  },
  {
    id: "p4",
    categoryId: "bm-verified",
    name: "BM XMDT US – Trắng Tinh",
    price: 1850000,
    stock: 3,
    badge: "NEW",
    description: "BM xác minh thị trường US, hoàn toàn mới.",
    image: "🟩",
  },
  {
    id: "p5",
    categoryId: "bm-limit",
    name: "BM Limit 9000$ – Đã Chạy",
    price: 2200000,
    stock: 5,
    badge: "HOT",
    description: "BM đã được nâng limit 9k$, lịch sử sạch.",
    image: "💠",
  },
  {
    id: "p6",
    categoryId: "via",
    name: "Via Việt Cổ 2015",
    price: 85000,
    stock: 150,
    description: "Via Việt Nam đời 2015, kháng XMDT 902.",
    image: "🟪",
  },
  {
    id: "p7",
    categoryId: "via",
    name: "Via Philippines – Trust High",
    price: 120000,
    oldPrice: 150000,
    stock: 86,
    badge: "SALE",
    description: "Via Philippines độ trust cao, ít die.",
    image: "🟪",
  },
  {
    id: "p8",
    categoryId: "fanpage",
    name: "Fanpage 100k Follow – Niche Thời Trang",
    price: 3500000,
    stock: 2,
    badge: "HOT",
    description: "Fanpage 100k followers niche fashion.",
    image: "🟧",
  },
  {
    id: "p9",
    categoryId: "service",
    name: "Tăng 1000 Like Bài Viết",
    price: 90000,
    stock: 999,
    description: "Like người Việt thật, lên trong 24h.",
    image: "🚀",
  },
];

export const mainNav: NavItem[] = [
  { label: "Trang Chủ", path: "/shop", icon: "🏠" },
  {
    label: "Mua Tài Khoản",
    path: "/shop/products",
    icon: "🛒",
    children: [
      { label: "BM Thường", path: "/shop/products?cat=bm-normal" },
      { label: "BM Xác Minh DN", path: "/shop/products?cat=bm-verified" },
      { label: "BM Limit Cao", path: "/shop/products?cat=bm-limit" },
      { label: "Via Facebook", path: "/shop/products?cat=via" },
    ],
  },
  { label: "Fanpage / Group", path: "/shop/products?cat=fanpage", icon: "📢" },
  { label: "Dịch Vụ", path: "/shop/products?cat=service", icon: "🚀" },
  { label: "Lịch Sử Mua", path: "/shop/history", icon: "📋" },
  { label: "Affiliate", path: "/shop/affiliate", icon: "💰" },
];

export const subNav: NavItem[] = [
  { label: "Nạp Tiền", path: "/shop/recharge", icon: "💳" },
  { label: "Bài Viết", path: "/shop/blog" },
  { label: "Công Cụ", path: "/shop/tools" },
  { label: "Hỏi Đáp", path: "/shop/faq" },
  { label: "API Docs", path: "/shop/api" },
];

export const rechargeMethods = [
  { id: "bank", label: "Bank Transfer", icon: "🏦", bonus: "+5%" },
  { id: "paypal", label: "PayPal", icon: "💸", bonus: "0%" },
  { id: "pm", label: "Perfect Money", icon: "💵", bonus: "+3%" },
  { id: "crypto", label: "Crypto (USDT)", icon: "₿", bonus: "+8%" },
  { id: "card", label: "Thẻ Cào", icon: "💳", bonus: "-15%" },
];

export const formatVnd = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ";
