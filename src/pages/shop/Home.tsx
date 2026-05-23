import { Link } from "react-router-dom";
import { categories, products } from "../../constants/ShopData";
import ProductCard from "../../component/shop/ProductCard";

export default function Home() {
  const hotProducts = products.filter((p) => p.badge === "HOT" || p.badge === "SALE").slice(0, 4);
  const newProducts = products.slice(0, 8);

  return (
    <div>
      {/* HERO BANNER */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full mb-4">
              🔥 KHUYẾN MÃI THÁNG 5/2026
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Mua BM Facebook<br/>
              <span className="text-amber-300">Giá Rẻ – Uy Tín</span>
            </h1>
            <p className="text-emerald-100 mb-6 text-sm md:text-base">
              Kho hàng BM thường, BM xác minh doanh nghiệp Real Full Giấy Tờ.
              Bảo hành 24/7, giao hàng tự động ngay sau khi thanh toán.
            </p>
            <div className="flex gap-3">
              <Link
                to="/shop/products"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-lg transition-colors"
              >
                🛒 Mua Ngay
              </Link>
              <Link
                to="/shop/recharge"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold rounded-lg transition-colors"
              >
                💳 Nạp Tiền
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm">
              <div>
                <div className="text-2xl font-black text-amber-300">15K+</div>
                <div className="text-emerald-200 text-xs">Đơn hàng</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-300">99%</div>
                <div className="text-emerald-200 text-xs">Hài lòng</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-300">24/7</div>
                <div className="text-emerald-200 text-xs">Hỗ trợ</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop/products?cat=${cat.id}`}
                    className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-4 transition-colors"
                  >
                    <div className="text-3xl mb-1">{cat.icon}</div>
                    <div className="font-bold text-sm">{cat.name}</div>
                    <div className="text-xs text-emerald-100">{cat.count} sản phẩm</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS BAR */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "⚡", title: "Giao hàng tức thì", desc: "Tự động 24/7" },
            { icon: "🛡️", title: "Bảo hành dài hạn", desc: "Đổi trả nhanh" },
            { icon: "💎", title: "Giá rẻ nhất TT", desc: "Cam kết hoàn tiền" },
            { icon: "💬", title: "Hỗ trợ tận tâm", desc: "Telegram / Zalo" },
          ].map((it) => (
            <div key={it.title} className="flex items-center gap-3">
              <div className="text-3xl">{it.icon}</div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">{it.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DANH MỤC */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              🗂️ Danh Mục Sản Phẩm
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Chọn danh mục bạn quan tâm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/products?cat=${cat.id}`}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg transition-all p-4 text-center"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {cat.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {cat.count} sản phẩm
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED – BM XÁC MINH */}
      <section className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 border-y border-amber-100 dark:border-amber-900/40">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                🔥 SẢN PHẨM HOT
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                BM XMDT Real Full Giấy Tờ – Cháy hàng liên tục
              </p>
            </div>
            <Link
              to="/shop/products"
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {hotProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* SẢN PHẨM MỚI */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              ✨ Sản Phẩm Mới Nhất
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Mới về kho – Số lượng có hạn
            </p>
          </div>
          <Link
            to="/shop/products"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {newProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA AFFILIATE */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <div className="text-amber-400 font-bold text-sm mb-2">💰 KIẾM TIỀN CÙNG SHOP BM</div>
            <h3 className="text-3xl font-black mb-2">Affiliate – Hoa hồng 15%</h3>
            <p className="text-slate-300 text-sm">
              Giới thiệu bạn bè, nhận hoa hồng cho mỗi đơn hàng thành công.
              Rút tiền nhanh chóng, không giới hạn.
            </p>
          </div>
          <Link
            to="/shop/affiliate"
            className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl transition-colors whitespace-nowrap"
          >
            Tham Gia Ngay →
          </Link>
        </div>
      </section>
    </div>
  );
}
