# Shop BM Backend (Spring Boot 3.3 / Java 17)

Backend REST API cho Shop BM marketplace — phục vụ React frontend ở `../`.

## Yêu cầu

- **JDK 17+**
- **Maven 3.8+** (hoặc dùng IDE như IntelliJ IDEA / VS Code có sẵn Maven)
- **MySQL 8.x** đang chạy ở `localhost:3306`

## 1. Cài MySQL & tạo database

Backend sẽ **tự tạo database** `shopbm` nhờ tham số `createDatabaseIfNotExist=true` trong JDBC URL, bạn chỉ cần có 1 MySQL server đang chạy.

Mặc định backend kết nối với:
- host: `localhost:3306`
- username: `root`
- password: `(rỗng)`

Nếu MySQL của bạn có password, export biến môi trường trước khi chạy:

```bash
# PowerShell
$env:DB_USER="root"
$env:DB_PASSWORD="mypassword"

# Bash / zsh
export DB_USER=root
export DB_PASSWORD=mypassword
```

## 2. Chạy backend

```bash
cd backend
./mvnw spring-boot:run        # Linux/Mac
mvnw.cmd spring-boot:run       # Windows (nếu có wrapper)
# hoặc nếu đã cài Maven sẵn:
mvn spring-boot:run
```

Lần đầu chạy:
- Flyway sẽ tạo toàn bộ schema (`V1__init_schema.sql`)
- Seed dữ liệu mẫu (`V2__seed_data.sql`) — 9 sản phẩm, 6 danh mục, mã giảm giá, FAQs...
- `DataSeeder.java` tạo 2 user mặc định với BCrypt hash đúng

Server chạy ở **http://localhost:8080**.

## 3. Tài khoản mặc định

| Tài khoản | Mật khẩu | Role  | Balance |
| --------- | -------- | ----- | ------- |
| `admin`   | `Admin@123` | ADMIN | 0       |
| `demo`    | `Demo@123`  | USER  | 250.000đ |

## 4. Swagger UI

http://localhost:8080/swagger-ui.html

Đầy đủ documentation tự sinh cho 50+ endpoint.

## 5. Endpoint chính

### Public (không cần token)
| Method | Path                                | Mô tả                       |
| ------ | ----------------------------------- | --------------------------- |
| POST   | `/api/v1/auth/register`             | Đăng ký                     |
| POST   | `/api/v1/auth/login`                | Đăng nhập                   |
| POST   | `/api/v1/auth/refresh`              | Refresh access token        |
| GET    | `/api/v1/categories`                | Danh sách danh mục          |
| GET    | `/api/v1/products?categoryId=&q=`   | Danh sách sản phẩm + filter |
| GET    | `/api/v1/products/featured`         | Sản phẩm HOT/SALE           |
| GET    | `/api/v1/products/latest`           | Sản phẩm mới                |
| GET    | `/api/v1/products/{slug}`           | Chi tiết sản phẩm           |
| GET    | `/api/v1/payment-methods`           | Danh sách phương thức nạp   |
| GET    | `/api/v1/blog`                      | Bài viết                    |
| GET    | `/api/v1/faqs`                      | FAQ                         |
| GET    | `/api/v1/banners/{theme}`           | Banner theo theme           |

### Auth required (header `Authorization: Bearer <accessToken>`)
| Method | Path                                   | Mô tả                  |
| ------ | -------------------------------------- | ---------------------- |
| GET    | `/api/v1/me`                           | Thông tin user hiện tại|
| GET    | `/api/v1/me/wallet`                    | Số dư ví               |
| PUT    | `/api/v1/me/profile`                   | Update fullName/email/phone|
| PUT    | `/api/v1/me/avatar`                    | Đổi avatar (URL có sẵn)|
| POST   | `/api/v1/me/avatar/upload`             | Upload + đặt avatar (multipart)|
| POST   | `/api/v1/me/change-password`           | Đổi mật khẩu           |
| POST   | `/api/v1/files/upload`                 | Upload file chung (multipart)|
| GET    | `/api/v1/me/settings`                  | Lấy settings           |
| PUT    | `/api/v1/me/settings`                  | Update settings        |
| POST   | `/api/v1/me/settings/reset`            | Reset về mặc định      |
| GET    | `/api/v1/cart`                         | Xem giỏ hàng           |
| POST   | `/api/v1/cart/items`                   | Thêm sản phẩm          |
| DELETE | `/api/v1/cart/items/{itemId}`          | Xoá khỏi giỏ           |
| POST   | `/api/v1/orders`                       | Đặt đơn (checkout)     |
| GET    | `/api/v1/me/orders`                    | Lịch sử đơn hàng       |
| GET    | `/api/v1/me/orders/stats`              | Thống kê đơn hàng      |
| POST   | `/api/v1/wallet/recharges`             | Nạp tiền               |
| GET    | `/api/v1/me/transactions`              | Sổ ví                  |
| GET    | `/api/v1/me/affiliate/stats`           | Thống kê affiliate     |
| GET    | `/api/v1/me/affiliate/commissions`     | Hoa hồng affiliate     |
| GET    | `/api/v1/coupons/validate?code=&subtotal=` | Kiểm tra mã giảm giá |
| GET    | `/api/v1/me/notifications`             | Thông báo              |
| POST   | `/api/v1/me/notifications/read-all`    | Đánh dấu đã đọc        |
| POST   | `/api/v1/auth/logout`                  | Logout (revoke refresh)|

### Admin only (role ADMIN)
| Method | Path                                       | Mô tả                       |
| ------ | ------------------------------------------ | --------------------------- |
| POST   | `/api/v1/admin/products`                   | Tạo sản phẩm mới            |
| PUT    | `/api/v1/admin/products/{id}`              | Update sản phẩm             |
| DELETE | `/api/v1/admin/products/{id}`              | Archive sản phẩm (soft del) |
| POST   | `/api/v1/admin/products/{id}/image`        | Upload ảnh + gán cho product (multipart) |

### File serving (public)
| Method | Path                  | Mô tả                                |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/uploads/**`         | Static file đã upload (ảnh, v.v.)    |

## 6. Test nhanh bằng curl

```bash
# Login
curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"demo","password":"Demo@123"}' | jq .

# Copy accessToken vào $TOKEN, rồi gọi:
curl -s http://localhost:8080/api/v1/me -H "Authorization: Bearer $TOKEN" | jq .

# Xem sản phẩm BM Thường
curl -s "http://localhost:8080/api/v1/products?categoryId=1" | jq .

# Nạp tiền 100K qua bank
curl -s -X POST http://localhost:8080/api/v1/wallet/recharges \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"methodCode":"BANK","amount":100000}' | jq .

# Checkout 1 sản phẩm với coupon
curl -s -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":1}],"couponCode":"WELCOME10"}' | jq .

# Upload avatar (multipart)
curl -s -X POST http://localhost:8080/api/v1/me/avatar/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/avatar.png" | jq .

# Update profile
curl -s -X PUT http://localhost:8080/api/v1/me/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Nguyễn Văn A","email":"new@email.com"}' | jq .

# Admin: tạo sản phẩm + upload ảnh
curl -s -X POST http://localhost:8080/api/v1/admin/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"categoryId":1,"name":"BM mới","price":500000,"stock":10,"badge":"NEW"}' | jq .
# → trả về productId, sau đó upload ảnh:
curl -s -X POST http://localhost:8080/api/v1/admin/products/$PRODUCT_ID/image \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@/path/to/product.jpg" | jq .
```

## 7. Tích hợp với frontend React

Trong dự án React (`../`):
- Đổi `fetch`/`axios` base URL thành `http://localhost:8080`
- Lưu `accessToken` vào localStorage / Redux
- Mỗi request authenticated thêm header `Authorization: Bearer <token>`
- Khi access token hết hạn (401), gọi `/api/v1/auth/refresh` với `refreshToken` để lấy token mới

CORS đã cho phép `http://localhost:5173` (Vite dev) và `http://localhost:3000`.

## 8. Cấu hình môi trường

| Biến                   | Default                                                                | Ghi chú             |
| ---------------------- | ---------------------------------------------------------------------- | ------------------- |
| `DB_USER`              | `root`                                                                 |                     |
| `DB_PASSWORD`          | `(empty)`                                                              |                     |
| `JWT_SECRET`           | (default ≥64-byte string, đổi cho production)                          | Khoá ký JWT         |
| `SPRING_PROFILES_ACTIVE`| `default`                                                              | Profile             |

## 9. Cấu trúc dự án (layer-based 3-tier + SOLID DIP)

Theo mô hình của [shopfood_V2](https://github.com/QuangVinh32/shopfood_V2): Service tách thành **interface (`IXxxService.java`) + implementation (`Service/Class/XxxService.java`)**. Controller chỉ phụ thuộc vào interface — tuân thủ Dependency Inversion Principle.

```
backend/
├── pom.xml
├── README.md
└── src/main/
    ├── java/com/shopbm/
    │   ├── ShopBmApplication.java
    │   ├── Config/         — CorsConfig, SecurityConfig, PasswordConfig, OpenApiConfig
    │   ├── Controller/     — 14 controller (Auth, User, Cart, Order...)
    │   ├── Exception/      — ApiException + GlobalExceptionHandler
    │   ├── Model/
    │   │   ├── Entity/     — 19 JPA entity (User, Order, Product...)
    │   │   ├── DTO/        — Response DTO (UserResponse, OrderResponse, PageResponse...)
    │   │   ├── Request/    — Request DTO (LoginRequest, CreateOrderRequest...)
    │   │   └── Enum/       — 17 enum (UserRole, OrderStatus, Theme, AffiliateTier...)
    │   ├── Repository/     — 19 JPA repository
    │   ├── Security/       — JwtService, JwtAuthFilter, CurrentUser
    │   ├── Service/        — 14 interface (IAuthService, IOrderService...)
    │   │   └── Class/      — 14 implementation (AuthService implements IAuthService)
    │   ├── Seed/           — DataSeeder (admin / demo user)
    │   └── Utils/          — SlugUtil
    └── resources/
        ├── application.yml
        └── db/migration/
            ├── V1__init_schema.sql
            └── V2__seed_data.sql
```

### Nguyên tắc SOLID đã áp dụng
- **S** — Single Responsibility: mỗi class 1 chức năng (entity ≠ DTO ≠ service ≠ controller)
- **O** — Open/Closed: thêm tính năng = thêm interface + impl mới, không sửa code cũ
- **L** — Liskov: tất cả implementation thay thế được interface tương ứng
- **I** — Interface Segregation: 14 interface nhỏ thay vì 1 mega-interface
- **D** — Dependency Inversion: Controller phụ thuộc `IXxxService` (abstraction), không phụ thuộc `XxxService` (impl)

Ví dụ DIP: `AuthController` chỉ biết về `IAuthService`, Spring tự inject implementation:
```java
@RestController
public class AuthController {
    private final IAuthService authService;   // depend on abstraction
    // ...
}
```
Muốn thay AuthService bằng AuthServiceV2/AuthServiceMock — chỉ cần `@Primary` impl mới, không sửa Controller.

## 10. Lưu ý production

- **Không** dùng `JWT_SECRET` mặc định — phải set qua env var
- Đổi `spring.jpa.hibernate.ddl-auto` về `validate` (đã sẵn) — luôn migrate qua Flyway
- Thêm rate-limit (Bucket4j / Redis) trước khi public
- Encrypt `delivered_content` bằng AES-256 (hiện đang lưu plain demo)
- Đóng Swagger UI (`springdoc.swagger-ui.enabled=false`) trên production
