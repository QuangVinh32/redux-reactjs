# Shop BM API – Hướng dẫn test

Base URL: **`http://localhost:8080`**
Tất cả request/response đều dùng `Content-Type: application/json` trừ các endpoint multipart upload (`multipart/form-data`).

Sau khi login, dùng header **`Authorization: Bearer <accessToken>`** cho tất cả endpoint yêu cầu auth.

> Demo accounts (tạo sẵn bởi `DataSeeder`):
> - **`admin / Admin@123`** — role ADMIN
> - **`demo / Demo@123`** — role USER, balance 250.000đ

Trong các ví dụ dưới, biến shell:
- `$TOKEN` — accessToken của user thường
- `$ADMIN_TOKEN` — accessToken của admin
- `$REFRESH` — refreshToken

Set token sau khi login:
```bash
export TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"demo","password":"Demo@123"}' | jq -r .accessToken)
```

---

## Mục lục

1. [Auth](#1-auth)
2. [User – Profile / Wallet / Avatar](#2-user)
3. [Settings](#3-settings)
4. [Categories](#4-categories)
5. [Products](#5-products)
6. [Cart](#6-cart)
7. [Orders](#7-orders)
8. [Wallet – Recharge / Transactions](#8-wallet)
9. [Affiliate](#9-affiliate)
10. [Coupons](#10-coupons)
11. [Notifications](#11-notifications)
12. [Blog](#12-blog)
13. [FAQ](#13-faq)
14. [Seasonal Banner](#14-seasonal-banner)
15. [File Upload](#15-file-upload)
16. [Admin – Product CRUD](#16-admin--product-crud)
17. [Error Format](#17-error-format)

---

## 1. Auth

### 1.1. Đăng ký
- **`POST /api/v1/auth/register`** — public
- **Body:**

| Field | Type | Validate | Bắt buộc |
|---|---|---|---|
| `username` | string | 3-50 ký tự | ✅ |
| `email` | string | email format | ✅ |
| `phone` | string | 9-11 chữ số | ✅ |
| `password` | string | 6-100 ký tự | ✅ |
| `refCode` | string | mã giới thiệu (optional) | ❌ |

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "phone": "0987111222",
    "password": "Test@123",
    "refCode": "BMDEMO1"
  }'
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "uuid-uuid",
  "expiresInSeconds": 3600,
  "user": {
    "id": 3, "username": "test_user", "email": "test@example.com",
    "fullName": "test_user", "role": "USER",
    "balance": 50000, "discountPercent": 0,
    "refCode": "BM7A3F2C"
  }
}
```

---

### 1.2. Đăng nhập
- **`POST /api/v1/auth/login`** — public
- **Body:**

| Field | Type | Bắt buộc |
|---|---|---|
| `usernameOrEmail` | string | ✅ (username hoặc email) |
| `password` | string | ✅ |

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"demo","password":"Demo@123"}'
```

---

### 1.3. Refresh token
- **`POST /api/v1/auth/refresh`** — public
- **Body:** `{ "refreshToken": "..." }`

```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH\"}"
```

---

### 1.4. Đăng xuất
- **`POST /api/v1/auth/logout`** — auth required
- Body: không. Sẽ revoke toàn bộ refresh token của user.

```bash
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

**Response 204** (No Content).

---

## 2. User

### 2.1. Thông tin user hiện tại
- **`GET /api/v1/me`** — auth

```bash
curl http://localhost:8080/api/v1/me -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "id": 2, "username": "demo", "email": "demo@shopbm.demo",
  "phone": "0987654321", "fullName": "Demo User",
  "avatarUrl": null, "balance": 250000, "discountPercent": 0,
  "role": "USER", "status": "ACTIVE",
  "refCode": "BMDEMO1", "createdAt": "2026-05-23T10:00:00"
}
```

---

### 2.2. Số dư ví
- **`GET /api/v1/me/wallet`** — auth
- Response: `{ "balance": 250000, "discountPercent": 0 }`

```bash
curl http://localhost:8080/api/v1/me/wallet -H "Authorization: Bearer $TOKEN"
```

---

### 2.3. Update profile
- **`PUT /api/v1/me/profile`** — auth
- **Body** (tất cả optional, gửi field nào update field đó):

| Field | Type | Validate |
|---|---|---|
| `fullName` | string | ≤ 120 ký tự |
| `email` | string | email format, unique |
| `phone` | string | 9-11 số, unique |

```bash
curl -X PUT http://localhost:8080/api/v1/me/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Nguyễn Văn A","email":"newemail@example.com"}'
```

---

### 2.4. Đổi avatar bằng URL
- **`PUT /api/v1/me/avatar`** — auth
- **Body:** `{ "avatarUrl": "https://..." }`

```bash
curl -X PUT http://localhost:8080/api/v1/me/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"avatarUrl":"http://localhost:8080/uploads/avatars/abc.png"}'
```

---

### 2.5. Upload avatar (file)
- **`POST /api/v1/me/avatar/upload`** — auth, **multipart/form-data**
- **Form param:** `file` (image, max 10MB)
- **Behavior:** Upload → tự động set làm avatar của user → xoá avatar cũ.

```bash
curl -X POST http://localhost:8080/api/v1/me/avatar/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/avatar.png"
```

**Response:**
```json
{
  "url": "http://localhost:8080/uploads/avatars/abc123def.png",
  "filename": "abc123def.png",
  "contentType": "image/png",
  "size": 234567,
  "subfolder": "avatars"
}
```

---

### 2.6. Đổi mật khẩu
- **`POST /api/v1/me/change-password`** — auth
- **Body:**

| Field | Type | Validate |
|---|---|---|
| `currentPassword` | string | bắt buộc |
| `newPassword` | string | 6-100 ký tự |

```bash
curl -X POST http://localhost:8080/api/v1/me/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"Demo@123","newPassword":"NewPass@456"}'
```

**Response 204.**

---

## 3. Settings

### 3.1. Lấy settings hiện tại
- **`GET /api/v1/me/settings`** — auth

```bash
curl http://localhost:8080/api/v1/me/settings -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "theme": "LIGHT", "language": "VI", "currency": "VND",
  "fontScale": "MD", "compactMode": false,
  "enableNotifications": true, "enableSound": false, "enableDecorations": true
}
```

---

### 3.2. Update settings
- **`PUT /api/v1/me/settings`** — auth
- **Body** (tất cả optional):

| Field | Type | Enum / range |
|---|---|---|
| `theme` | enum | `LIGHT / DARK / TET / CHRISTMAS / HALLOWEEN` |
| `language` | enum | `VI / EN` |
| `currency` | enum | `VND / USD` |
| `fontScale` | enum | `SM / MD / LG` |
| `compactMode` | boolean | |
| `enableNotifications` | boolean | |
| `enableSound` | boolean | |
| `enableDecorations` | boolean | |

```bash
curl -X PUT http://localhost:8080/api/v1/me/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme":"DARK","fontScale":"LG","enableDecorations":false}'
```

---

### 3.3. Reset về mặc định
- **`POST /api/v1/me/settings/reset`** — auth

```bash
curl -X POST http://localhost:8080/api/v1/me/settings/reset \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Categories

### 4.1. Danh sách danh mục
- **`GET /api/v1/categories`** — public

```bash
curl http://localhost:8080/api/v1/categories
```

**Response:**
```json
[
  {"id":1,"name":"BM Thường","slug":"bm-thuong","icon":"🏢","description":"...","productCount":2},
  ...
]
```

---

## 5. Products

### 5.1. Tìm kiếm / phân trang
- **`GET /api/v1/products`** — public
- **Query params:**

| Param | Type | Default | Mô tả |
|---|---|---|---|
| `categoryId` | long | null | Lọc theo danh mục |
| `q` | string | null | Tìm theo tên (LIKE) |
| `page` | int | 0 | Trang (0-indexed) |
| `size` | int | 20 | Số item/trang (max 100) |
| `sort` | string | `createdAt,desc` | Format `field,asc/desc` |

```bash
# Tất cả sản phẩm BM Thường (categoryId=1), trang 1
curl "http://localhost:8080/api/v1/products?categoryId=1&page=0&size=10"

# Tìm "BM 250"
curl "http://localhost:8080/api/v1/products?q=BM%20250"

# Sắp xếp giá tăng dần
curl "http://localhost:8080/api/v1/products?sort=price,asc"
```

**Response:**
```json
{
  "content": [
    {"id":1,"name":"BM 250$ – Tạo Sẵn","price":350000,"oldPrice":450000,
     "stock":42,"badge":"HOT","imageUrl":"🟦"}
  ],
  "page":0,"size":20,"totalElements":2,"totalPages":1,"last":true
}
```

---

### 5.2. Sản phẩm hot / sale
- **`GET /api/v1/products/featured`** — public
- Trả về tối đa 8 sản phẩm có badge HOT hoặc SALE.

```bash
curl http://localhost:8080/api/v1/products/featured
```

---

### 5.3. Sản phẩm mới
- **`GET /api/v1/products/latest`** — public
- Trả về 8 sản phẩm mới nhất.

```bash
curl http://localhost:8080/api/v1/products/latest
```

---

### 5.4. Chi tiết sản phẩm
- **`GET /api/v1/products/{slug}`** — public
- Mỗi lần gọi → tăng `viewCount` của sản phẩm.

```bash
curl http://localhost:8080/api/v1/products/bm-250-tao-san
```

---

## 6. Cart

### 6.1. Xem giỏ hàng
- **`GET /api/v1/cart`** — auth

```bash
curl http://localhost:8080/api/v1/cart -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "id": 2,
  "items": [
    {"id":1,"productId":1,"productName":"BM 250$","productImage":"🟦",
     "price":350000,"quantity":2,"subtotal":700000}
  ],
  "subtotal": 700000,
  "totalQuantity": 2
}
```

---

### 6.2. Thêm vào giỏ
- **`POST /api/v1/cart/items`** — auth
- **Body:**

| Field | Type | Validate |
|---|---|---|
| `productId` | long | bắt buộc |
| `quantity` | int | ≥ 1 |

```bash
curl -X POST http://localhost:8080/api/v1/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

---

### 6.3. Xoá item khỏi giỏ
- **`DELETE /api/v1/cart/items/{itemId}`** — auth

```bash
curl -X DELETE http://localhost:8080/api/v1/cart/items/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6.4. Xoá toàn bộ giỏ
- **`DELETE /api/v1/cart`** — auth

```bash
curl -X DELETE http://localhost:8080/api/v1/cart -H "Authorization: Bearer $TOKEN"
```

---

## 7. Orders

### 7.1. Checkout (đặt đơn)
- **`POST /api/v1/orders`** — auth
- **Body:**

| Field | Type | Mô tả |
|---|---|---|
| `items` | array | Danh sách `{productId, quantity}` |
| `couponCode` | string | optional, mã giảm giá |
| `note` | string | optional, ghi chú đơn |

**Flow:** lock user balance → check stock → tính discount → trừ ví → insert transaction → consume coupon → record affiliate commission (nếu có referrer) → send notification.

```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 1}
    ],
    "couponCode": "WELCOME10",
    "note": "Giao nhanh giúp em"
  }'
```

**Response:**
```json
{
  "id": 1,
  "orderCode": "ORD-20260523-0042",
  "subtotal": 350000,
  "discountAmount": 35000,
  "total": 315000,
  "status": "COMPLETED",
  "paymentMethod": "WALLET",
  "couponCode": "WELCOME10",
  "items": [
    {"id":1,"productId":1,"productName":"BM 250$","price":350000,
     "quantity":1,"subtotal":350000,
     "deliveredContent":"[Demo] Tài khoản BM 250$ #1735..."}
  ]
}
```

---

### 7.2. Lịch sử đơn hàng
- **`GET /api/v1/me/orders`** — auth
- **Query params:** `page` (default 0), `size` (default 20)

```bash
curl "http://localhost:8080/api/v1/me/orders?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7.3. Thống kê đơn
- **`GET /api/v1/me/orders/stats`** — auth
- Response: `{ "total": 5, "completed": 4, "processing": 0, "refunded": 1 }`

```bash
curl http://localhost:8080/api/v1/me/orders/stats -H "Authorization: Bearer $TOKEN"
```

---

### 7.4. Chi tiết đơn
- **`GET /api/v1/orders/{id}`** — auth (chỉ user sở hữu)

```bash
curl http://localhost:8080/api/v1/orders/1 -H "Authorization: Bearer $TOKEN"
```

---

## 8. Wallet

### 8.1. Nạp tiền
- **`POST /api/v1/wallet/recharges`** — auth
- **Body:**

| Field | Type | Validate |
|---|---|---|
| `methodCode` | string | enum: `BANK / PAYPAL / PM / CRYPTO / CARD` |
| `amount` | number | ≥ 10.000 (đ) |

Mỗi method có bonus %: BANK +5%, PM +3%, CRYPTO +8%, PAYPAL 0%, CARD -15%.

```bash
curl -X POST http://localhost:8080/api/v1/wallet/recharges \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"methodCode":"BANK","amount":100000}'
```

**Response:**
```json
{
  "id":15,"type":"RECHARGE","method":"BANK",
  "amount":100000,"bonusAmount":5000,"netAmount":105000,
  "balanceAfter":355000,"status":"COMPLETED",
  "referenceCode":"RCHG-3F2A8B91...",
  "description":"Nạp tiền qua Bank Transfer"
}
```

---

### 8.2. Lịch sử giao dịch
- **`GET /api/v1/me/transactions`** — auth
- Query: `page`, `size`

```bash
curl "http://localhost:8080/api/v1/me/transactions?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 8.3. Danh sách phương thức nạp
- **`GET /api/v1/payment-methods`** — public

```bash
curl http://localhost:8080/api/v1/payment-methods
```

---

## 9. Affiliate

### 9.1. Thống kê affiliate
- **`GET /api/v1/me/affiliate/stats`** — auth

```bash
curl http://localhost:8080/api/v1/me/affiliate/stats -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "totalClicks": 0, "totalReferrals": 3,
  "totalCommissionEarned": 150000, "totalCommissionPaid": 0,
  "totalRevenue": 1500000, "currentTier": "BRONZE", "currentRate": 5,
  "refCode": "BMDEMO1",
  "referralLink": "http://localhost:5173/shop/register?ref=BMDEMO1"
}
```

---

### 9.2. Lịch sử hoa hồng
- **`GET /api/v1/me/affiliate/commissions`** — auth
- Query: `page`, `size`

```bash
curl "http://localhost:8080/api/v1/me/affiliate/commissions?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 10. Coupons

### 10.1. Validate / preview discount
- **`GET /api/v1/coupons/validate`** — auth
- **Query params:**

| Param | Type | Mô tả |
|---|---|---|
| `code` | string | Mã coupon |
| `subtotal` | number | optional — nếu có sẽ tính `discount` thật |

```bash
curl "http://localhost:8080/api/v1/coupons/validate?code=WELCOME10&subtotal=500000" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "code":"WELCOME10","type":"PERCENT","value":10,
  "description":"Giảm 10% cho khách mới",
  "discount":50000
}
```

> Mã có sẵn từ seed: `WELCOME10` (10%), `XMAS25` (25%), `HALLO31` (31%), `LIXI88K` (-88K).

---

## 11. Notifications

### 11.1. Danh sách thông báo
- **`GET /api/v1/me/notifications`** — auth
- Query: `page`, `size`

```bash
curl "http://localhost:8080/api/v1/me/notifications?page=0" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 11.2. Đếm chưa đọc
- **`GET /api/v1/me/notifications/unread-count`** — auth
- Response: `{ "unread": 2 }`

```bash
curl http://localhost:8080/api/v1/me/notifications/unread-count \
  -H "Authorization: Bearer $TOKEN"
```

---

### 11.3. Đánh dấu 1 thông báo đã đọc
- **`POST /api/v1/me/notifications/{id}/read`** — auth

```bash
curl -X POST http://localhost:8080/api/v1/me/notifications/1/read \
  -H "Authorization: Bearer $TOKEN"
```

---

### 11.4. Đánh dấu tất cả đã đọc
- **`POST /api/v1/me/notifications/read-all`** — auth
- Response: `{ "updated": 2 }`

```bash
curl -X POST http://localhost:8080/api/v1/me/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 12. Blog

### 12.1. Danh sách bài viết
- **`GET /api/v1/blog`** — public
- Query: `page`, `size`

```bash
curl "http://localhost:8080/api/v1/blog?page=0&size=10"
```

---

### 12.2. Chi tiết bài viết
- **`GET /api/v1/blog/{slug}`** — public
- Mỗi lần gọi tăng `viewCount`.

```bash
curl http://localhost:8080/api/v1/blog/huong-dan-su-dung-bm
```

---

## 13. FAQ

### 13.1. Danh sách FAQ
- **`GET /api/v1/faqs`** — public
- **Query:** `category` (optional) — enum `GENERAL / PAYMENT / PRODUCT / ACCOUNT / AFFILIATE`

```bash
# Tất cả
curl http://localhost:8080/api/v1/faqs

# Theo category
curl "http://localhost:8080/api/v1/faqs?category=PAYMENT"
```

---

## 14. Seasonal Banner

### 14.1. Banner theo theme
- **`GET /api/v1/banners/{theme}`** — public
- **Path param:** `theme` enum `TET / CHRISTMAS / HALLOWEEN / LIGHT / DARK`

```bash
curl http://localhost:8080/api/v1/banners/TET
```

**Response:**
```json
{
  "id":1,"theme":"TET",
  "bannerText":"🧧 Chúc Mừng Năm Mới – Lì xì 88K cho đơn đầu năm! 🏮",
  "gradientClasses":"bg-gradient-to-r from-rose-600 via-red-600 to-amber-500",
  "emojis":"🧧,🏮,🎆,🌸,🐉,✨",
  "active":true
}
```

---

## 15. File Upload

### 15.1. Upload file chung
- **`POST /api/v1/files/upload`** — auth, **multipart/form-data**
- **Form params:**

| Param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `file` | File | ✅ | Image, max 10MB |
| `subfolder` | string | ❌ | `products / avatars / banners / blog / general` (default `general`) |

Cho phép: `image/jpeg, image/png, image/webp, image/gif, image/svg+xml`.

```bash
curl -X POST http://localhost:8080/api/v1/files/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.png" \
  -F "subfolder=general"
```

**Response:**
```json
{
  "url":"http://localhost:8080/uploads/general/abc123.png",
  "filename":"abc123.png","contentType":"image/png",
  "size":123456,"subfolder":"general"
}
```

> File đã upload truy cập được qua `GET /uploads/general/abc123.png` (public).

---

## 16. Admin – Product CRUD

> **Yêu cầu:** Đăng nhập bằng `admin / Admin@123`, lưu token vào `$ADMIN_TOKEN`.
> Các endpoint dưới đây check role `ADMIN`.

```bash
export ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"Admin@123"}' | jq -r .accessToken)
```

### 16.1. Tạo sản phẩm mới
- **`POST /api/v1/admin/products`** — ADMIN
- **Body:**

| Field | Type | Validate |
|---|---|---|
| `categoryId` | long | bắt buộc, phải tồn tại |
| `sku` | string | optional, unique |
| `name` | string | bắt buộc, ≤ 200 |
| `slug` | string | optional (auto từ name nếu thiếu) |
| `shortDescription` | string | ≤ 255 |
| `description` | string | text |
| `price` | number | ≥ 0, bắt buộc |
| `oldPrice` | number | ≥ 0, optional |
| `stock` | int | ≥ 0, bắt buộc |
| `badge` | enum | `HOT / NEW / SALE` (optional) |
| `imageUrl` | string | optional URL (hoặc upload sau bằng API 16.4) |
| `status` | enum | `ACTIVE / DRAFT / SOLD_OUT / ARCHIVED` (default ACTIVE) |

```bash
curl -X POST http://localhost:8080/api/v1/admin/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "name": "BM Test Mới",
    "shortDescription": "Sản phẩm test",
    "description": "Mô tả chi tiết",
    "price": 500000,
    "oldPrice": 600000,
    "stock": 10,
    "badge": "NEW"
  }'
```

---

### 16.2. Update sản phẩm
- **`PUT /api/v1/admin/products/{id}`** — ADMIN
- Body tương tự `POST` (16.1).

```bash
curl -X PUT http://localhost:8080/api/v1/admin/products/10 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "name": "BM Test (đã sửa)",
    "price": 480000,
    "stock": 8
  }'
```

---

### 16.3. Xoá sản phẩm
- **`DELETE /api/v1/admin/products/{id}`** — ADMIN
- **Behavior:** Soft delete → đổi status thành `ARCHIVED` + xoá ảnh khỏi disk.

```bash
curl -X DELETE http://localhost:8080/api/v1/admin/products/10 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

### 16.4. Upload ảnh sản phẩm
- **`POST /api/v1/admin/products/{id}/image`** — ADMIN, **multipart/form-data**
- **Form param:** `file` (image, max 10MB)
- **Behavior:** Upload vào `uploads/products/` → tự động gán URL cho `product.imageUrl` → xoá ảnh cũ.

```bash
curl -X POST http://localhost:8080/api/v1/admin/products/10/image \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@/path/to/product.jpg"
```

---

## 17. Error Format

Tất cả endpoint khi lỗi trả về format chung:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Số dư ví không đủ. Vui lòng nạp thêm tiền.",
  "path": "/api/v1/orders",
  "timestamp": "2026-05-23T14:32:01.234",
  "details": null
}
```

Khi validation lỗi, `details` chứa map field → message:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/auth/register",
  "timestamp": "...",
  "details": {
    "username": "tối thiểu 3 ký tự",
    "email": "must be a well-formed email address"
  }
}
```

### HTTP status codes thường gặp
| Code | Khi nào |
|---|---|
| 200 | Thành công có body |
| 204 | Thành công không body (logout, change-password, delete...) |
| 400 | Validation lỗi hoặc business rule (số dư không đủ, mã coupon sai...) |
| 401 | Chưa đăng nhập / token sai / hết hạn |
| 403 | Không đủ quyền (vd user gọi admin endpoint) |
| 404 | Resource không tồn tại |
| 409 | Conflict (email/username trùng khi register) |
| 500 | Lỗi server |

---

## 18. Quick test flow (end-to-end)

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"demo","password":"Demo@123"}' | jq -r .accessToken)

# 2. Xem ví: 250.000đ
curl -s http://localhost:8080/api/v1/me/wallet -H "Authorization: Bearer $TOKEN" | jq .

# 3. Nạp thêm 200K qua BANK (+5% bonus = 210K)
curl -s -X POST http://localhost:8080/api/v1/wallet/recharges \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"methodCode":"BANK","amount":200000}' | jq .

# 4. Xem sản phẩm BM Thường
curl -s "http://localhost:8080/api/v1/products?categoryId=1" | jq '.content[].name'

# 5. Đặt 1 BM với coupon WELCOME10
curl -s -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":1}],"couponCode":"WELCOME10"}' | jq .

# 6. Xem lịch sử đơn
curl -s http://localhost:8080/api/v1/me/orders -H "Authorization: Bearer $TOKEN" | jq .

# 7. Xem sổ ví
curl -s http://localhost:8080/api/v1/me/transactions -H "Authorization: Bearer $TOKEN" | jq .

# 8. Đổi theme sang dark
curl -s -X PUT http://localhost:8080/api/v1/me/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme":"DARK"}' | jq .
```

---

## 19. Postman / Swagger UI

- **Swagger UI:** http://localhost:8080/swagger-ui.html — sinh sẵn UI test cho mọi endpoint, hỗ trợ Authorize bằng JWT.
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs — import vào Postman / Insomnia / Bruno.

> Trên Swagger UI: bấm 🔒 Authorize → paste `Bearer <token>` (có sẵn prefix Bearer).
