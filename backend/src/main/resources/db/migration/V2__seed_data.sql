-- =================================================================
-- Shop BM – Seed data (categories, products, coupons, FAQs, banners)
-- NOTE: Users (admin / demo_user) được tạo qua DataSeeder.java sau migration
-- để có BCrypt hash đúng. Đăng nhập:
--   admin / Admin@123   (role ADMIN)
--   demo / Demo@123     (role USER, balance 250.000đ)
-- =================================================================

-- Categories
INSERT INTO categories (name, slug, icon, description, display_order, product_count, created_at, updated_at) VALUES
('BM Thường', 'bm-thuong', '🏢', 'Tài khoản BM Facebook thường, đã verify email', 1, 2, NOW(), NOW()),
('BM Xác Minh Doanh Nghiệp', 'bm-xac-minh', '✅', 'BM Real Full Giấy Tờ, đã xác minh doanh nghiệp', 2, 2, NOW(), NOW()),
('BM Limit Cao', 'bm-limit-cao', '💎', 'BM tăng limit, dùng chạy ads dài hạn', 3, 1, NOW(), NOW()),
('Via Facebook', 'via-facebook', '👤', 'Tài khoản Facebook cá nhân kháng XMDT', 4, 2, NOW(), NOW()),
('Fanpage / Group', 'fanpage-group', '📢', 'Fanpage có sẵn followers, group sỉ lẻ', 5, 1, NOW(), NOW()),
('Dịch Vụ Tương Tác', 'dich-vu', '🚀', 'Tăng like, share, follower, comment', 6, 1, NOW(), NOW());

-- Products
INSERT INTO products (category_id, sku, name, slug, short_description, description, price, old_price, stock, badge, image_url, status, created_at, updated_at) VALUES
(1, 'BM250-001', 'BM 250$ – Tạo Sẵn', 'bm-250-tao-san', 'BM limit 250$ đã đổi info', 'BM limit 250$, đã đổi info, sẵn sàng chạy ads.', 350000, 450000, 42, 'HOT', '🟦', 'ACTIVE', NOW(), NOW()),
(1, 'BM50-002', 'BM 50$ Cổ – Trust 2018', 'bm-50-co-2018', 'BM cổ đời 2018', 'BM cổ đời 2018, ít bị checkpoint.', 220000, NULL, 18, NULL, '🟦', 'ACTIVE', NOW(), NOW()),
(2, 'BMVR-003', 'BM XMDT Real – Full Giấy Tờ', 'bm-xmdt-real-full-giay-to', 'BM xác minh DN thật', 'BM xác minh doanh nghiệp thật, có giấy tờ pháp lý.', 1450000, 1800000, 7, 'SALE', '🟩', 'ACTIVE', NOW(), NOW()),
(2, 'BMUS-004', 'BM XMDT US – Trắng Tinh', 'bm-xmdt-us-trang-tinh', 'BM xác minh US', 'BM xác minh thị trường US, hoàn toàn mới.', 1850000, NULL, 3, 'NEW', '🟩', 'ACTIVE', NOW(), NOW()),
(3, 'BMLM-005', 'BM Limit 9000$ – Đã Chạy', 'bm-limit-9000', 'BM limit 9000$', 'BM đã được nâng limit 9k$, lịch sử sạch.', 2200000, NULL, 5, 'HOT', '💠', 'ACTIVE', NOW(), NOW()),
(4, 'VIA-006', 'Via Việt Cổ 2015', 'via-viet-co-2015', 'Via VN đời 2015', 'Via Việt Nam đời 2015, kháng XMDT 902.', 85000, NULL, 150, NULL, '🟪', 'ACTIVE', NOW(), NOW()),
(4, 'VIA-007', 'Via Philippines – Trust High', 'via-philippines-trust-high', 'Via PH trust cao', 'Via Philippines độ trust cao, ít die.', 120000, 150000, 86, 'SALE', '🟪', 'ACTIVE', NOW(), NOW()),
(5, 'FP-008', 'Fanpage 100k Follow – Thời Trang', 'fanpage-100k-thoi-trang', 'Fanpage 100k followers', 'Fanpage 100k followers niche fashion.', 3500000, NULL, 2, 'HOT', '🟧', 'ACTIVE', NOW(), NOW()),
(6, 'SV-009', 'Tăng 1000 Like Bài Viết', 'tang-1000-like', 'Like người Việt thật', 'Like người Việt thật, lên trong 24h.', 90000, NULL, 999, NULL, '🚀', 'ACTIVE', NOW(), NOW());

-- Payment methods
INSERT INTO payment_methods (code, name, icon, bonus_percent, min_amount, active, display_order, created_at, updated_at) VALUES
('BANK', 'Bank Transfer', '🏦', 5, 10000, TRUE, 1, NOW(), NOW()),
('PAYPAL', 'PayPal', '💸', 0, 10000, TRUE, 2, NOW(), NOW()),
('PM', 'Perfect Money', '💵', 3, 10000, TRUE, 3, NOW(), NOW()),
('CRYPTO', 'Crypto (USDT)', '₿', 8, 100000, TRUE, 4, NOW(), NOW()),
('CARD', 'Thẻ Cào', '💳', -15, 10000, TRUE, 5, NOW(), NOW());

-- Coupons (mã giảm giá theo theme)
INSERT INTO coupons (code, type, value, min_order_amount, max_uses, active, description, created_at, updated_at) VALUES
('LIXI88K', 'FIXED', 88000, 200000, 1000, TRUE, 'Lì xì Tết 88.000đ – đơn từ 200K', NOW(), NOW()),
('XMAS25', 'PERCENT', 25, 100000, 500, TRUE, 'Giảm 25% dịp Giáng sinh', NOW(), NOW()),
('HALLO31', 'PERCENT', 31, 100000, 500, TRUE, 'Trick or Treat – giảm 31%', NOW(), NOW()),
('WELCOME10', 'PERCENT', 10, 50000, NULL, TRUE, 'Giảm 10% cho khách mới', NOW(), NOW());

-- Seasonal banners
INSERT INTO seasonal_banners (theme, banner_text, gradient_classes, emojis, active, created_at, updated_at) VALUES
('TET', '🧧 Chúc Mừng Năm Mới – Lì xì 88K cho đơn đầu năm! 🏮', 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-500', '🧧,🏮,🎆,🌸,🐉,✨', TRUE, NOW(), NOW()),
('CHRISTMAS', '🎄 Merry Christmas – Giảm 25% toàn shop dịp lễ! 🎁', 'bg-gradient-to-r from-red-700 via-green-700 to-red-700', '❄️,🎄,⛄,🎅,🎁,✨', TRUE, NOW(), NOW()),
('HALLOWEEN', '🎃 Trick or Treat – Giảm 31% mã HALLO31! 👻', 'bg-gradient-to-r from-orange-600 via-purple-800 to-orange-600', '🎃,👻,🦇,🕷️,🕸️,💀', TRUE, NOW(), NOW());

-- FAQs
INSERT INTO faqs (category, question, answer, display_order, created_at, updated_at) VALUES
('GENERAL', 'Shop BM là gì?', 'Shop BM là marketplace bán tài khoản Facebook BM, Via, Fanpage uy tín 24/7.', 1, NOW(), NOW()),
('PAYMENT', 'Có những hình thức nạp tiền nào?', 'Bank Transfer (+5%), PayPal, Perfect Money (+3%), Crypto USDT (+8%), Thẻ Cào (-15%).', 1, NOW(), NOW()),
('PAYMENT', 'Sau bao lâu tiền được cộng vào ví?', 'Tự động 1-3 phút. Nếu sau 10 phút chưa cộng vui lòng liên hệ CSKH.', 2, NOW(), NOW()),
('PRODUCT', 'BM Xác minh DN khác BM Thường thế nào?', 'BM Xác Minh có giấy tờ doanh nghiệp thật, limit cao, ít bị die.', 1, NOW(), NOW()),
('ACCOUNT', 'Quên mật khẩu phải làm sao?', 'Bấm "Quên mật khẩu" ở trang đăng nhập để nhận email đặt lại.', 1, NOW(), NOW()),
('AFFILIATE', 'Affiliate kiếm tiền thế nào?', 'Bạn share link giới thiệu, nhận 5-15% hoa hồng theo cấp bậc (Bronze → Diamond).', 1, NOW(), NOW());

-- Blog posts (author_id null until admin được tạo bởi DataSeeder)
INSERT INTO blog_posts (slug, title, excerpt, content, published, published_at, created_at, updated_at) VALUES
('huong-dan-su-dung-bm', 'Hướng dẫn sử dụng BM Facebook chạy ads', 'Cách setup BM đúng chuẩn để chạy ads bền vững.', '# Hướng dẫn\n\nBước 1: Đăng nhập...', TRUE, NOW(), NOW(), NOW()),
('khang-xmdt-902', 'Cách kháng XMDT 902 hiệu quả 2026', 'Tổng hợp kinh nghiệm kháng tài khoản FB bị checkpoint.', '# Kháng 902\n\nNội dung...', TRUE, NOW(), NOW(), NOW());

-- Sample notifications được tạo runtime trong DataSeeder.java
