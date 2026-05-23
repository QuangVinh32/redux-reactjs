import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { categories, products, formatVnd } from "../../constants/ShopData";
import ProductCard from "../../component/shop/ProductCard";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("cat") ?? "all";
  const searchQuery = useSelector((s: any) => s.shop.searchQuery as string);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat !== "all") list = list.filter((p) => p.categoryId === activeCat);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeCat, searchQuery]);

  const activeCategoryInfo =
    activeCat === "all"
      ? null
      : categories.find((c) => c.id === activeCat);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 mb-4">
        <Link to="/shop" className="hover:text-emerald-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700 font-semibold">
          {activeCategoryInfo?.name ?? "Tất cả sản phẩm"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* SIDEBAR */}
        <aside className="space-y-4">
          {/* Categories */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-600 text-white px-4 py-3 font-bold text-sm">
              🗂️ Danh Mục
            </div>
            <ul className="divide-y divide-slate-100">
              <li>
                <button
                  onClick={() => setParams({})}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-emerald-50 ${
                    activeCat === "all"
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-700"
                  }`}
                >
                  <span>📦 Tất cả</span>
                  <span className="text-xs text-slate-400">{products.length}</span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setParams({ cat: cat.id })}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-emerald-50 ${
                      activeCat === cat.id
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-700"
                    }`}
                  >
                    <span>
                      <span className="mr-1">{cat.icon}</span>
                      {cat.name}
                    </span>
                    <span className="text-xs text-slate-400">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter giá */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="font-bold text-sm text-slate-800 mb-3">💰 Khoảng giá</div>
            <div className="space-y-2 text-sm">
              {[
                "Dưới 100K",
                "100K – 500K",
                "500K – 1 triệu",
                "1 – 2 triệu",
                "Trên 2 triệu",
              ].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 cursor-pointer hover:text-emerald-600"
                >
                  <input type="checkbox" className="accent-emerald-500" />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hỗ trợ */}
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl p-4 text-white">
            <div className="text-2xl mb-1">💬</div>
            <div className="font-bold mb-1">Cần hỗ trợ?</div>
            <p className="text-xs text-emerald-50 mb-3">
              Chat trực tiếp với CSKH 24/7
            </p>
            <button className="w-full h-9 rounded-lg bg-white text-emerald-700 text-xs font-bold hover:bg-emerald-50">
              Liên hệ ngay
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div>
          {/* Category banner */}
          {activeCategoryInfo && (
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100 rounded-xl p-5 mb-5 flex items-center gap-4">
              <div className="text-5xl">{activeCategoryInfo.icon}</div>
              <div>
                <h1 className="text-xl font-black text-slate-900">
                  {activeCategoryInfo.name}
                </h1>
                <p className="text-sm text-slate-600">
                  {activeCategoryInfo.description}
                </p>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              Tìm thấy <b className="text-emerald-600">{filtered.length}</b> sản phẩm
              {searchQuery && (
                <> cho từ khoá "<b>{searchQuery}</b>"</>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Sắp xếp:</span>
              <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:border-emerald-400 outline-none">
                <option>Mới nhất</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
                <option>Bán chạy</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="text-5xl mb-3">🫥</div>
              <p className="text-slate-600">Không có sản phẩm phù hợp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {["«", "1", "2", "3", "4", "»"].map((n, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                  n === "1"
                    ? "bg-emerald-500 text-white"
                    : "bg-white border border-slate-200 hover:border-emerald-400 text-slate-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Tổng quan giá */}
          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-3">📊 Bảng giá tham khảo</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {categories.slice(0, 6).map((c) => {
                const ps = products.filter((p) => p.categoryId === c.id);
                const min = ps.length ? Math.min(...ps.map((p) => p.price)) : 0;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2"
                  >
                    <span className="text-slate-700">
                      {c.icon} {c.name}
                    </span>
                    <span className="font-bold text-rose-600">
                      Từ {formatVnd(min)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
