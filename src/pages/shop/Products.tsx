import { useMemo, useState } from"react";
import { useSearchParams, Link } from"react-router-dom";
import { useSelector } from"react-redux";
import { useApi } from"../../hooks/useApi";
import { catalogApi } from"../../api/endpoints";
import ProductCard from"../../component/shop/ProductCard";
import type { ApiCategory, ApiProduct } from"../../api/types";

const toCard = (p: ApiProduct) => ({
 id: String(p.id),
 categoryId: String(p.categoryId),
 name: p.name,
 price: p.price,
 oldPrice: p.oldPrice,
 stock: p.stock,
 badge: p.badge,
 description: p.shortDescription ??"",
 image: p.imageUrl ??"",
});

export default function Products() {
 const [params, setParams] = useSearchParams();
 const catParam = params.get("cat") ??"all";
 const searchQuery = useSelector((s: any) => s.shop.searchQuery as string);
 const [page, setPage] = useState(0);

 const cats = useApi(() => catalogApi.categories(), []);

 // Map slug → id (vì URL dùng slug)
 const activeCategory: ApiCategory | undefined = useMemo(() => {
 if (catParam ==="all" || !cats.data) return undefined;
 return cats.data.find((c) => c.slug === catParam || String(c.id) === catParam);
 }, [catParam, cats.data]);

 const products = useApi(
 () => catalogApi.products({
 categoryId: activeCategory?.id,
 q: searchQuery || undefined,
 page,
 size: 12,
 }),
 [activeCategory?.id, searchQuery, page]
 );

 return (
 <div className="max-w-7xl mx-auto px-4 py-8">
 {/* Breadcrumb */}
 <div className="text-xs text-stone-500 dark:text-stone-400 mb-6 tracking-wider uppercase">
 <Link to="/shop" className="hover:text-stone-900 dark:hover:text-stone-100">Trang chủ</Link>
 <span className="mx-2">/</span>
 <span className="text-stone-900 dark:text-stone-100">
 {activeCategory?.name ??"Tất cả sản phẩm"}
 </span>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
 {/* SIDEBAR */}
 <aside className="space-y-6">
 {/* Categories */}
 <div className="border border-stone-300 dark:border-slate-700">
 <div className="border-b border-stone-300 dark:border-slate-700 px-4 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 dark:text-stone-100">
 Danh Mục
 </div>
 <ul className="divide-y divide-stone-200 dark:divide-slate-800">
 <li>
 <button
 onClick={() => { setParams({}); setPage(0); }}
 className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
 catParam ==="all"
 ?"bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold"
 :"text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
 }`}
 >
 <span>Tất cả</span>
 <span className="text-xs opacity-70">{cats.data?.reduce((s, c) => s + c.productCount, 0) ??""}</span>
 </button>
 </li>
 {cats.data?.map((cat) => {
 const active = catParam === cat.slug || catParam === String(cat.id);
 return (
 <li key={cat.id}>
 <button
 onClick={() => { setParams({ cat: cat.slug }); setPage(0); }}
 className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
 active
 ?"bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold"
 :"text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
 }`}
 >
 <span>{cat.name}</span>
 <span className="text-xs opacity-70">{cat.productCount}</span>
 </button>
 </li>
 );
 })}
 </ul>
 </div>

 {/* Filter giá */}
 <div className="border border-stone-300 dark:border-slate-700 p-4">
 <div className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 dark:text-stone-100 mb-3 pb-2 border-b border-stone-200 dark:border-slate-700">
 Khoảng giá
 </div>
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
 className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
 >
 <input type="checkbox" className="accent-stone-900 dark:accent-stone-100" />
 <span>{r}</span>
 </label>
 ))}
 </div>
 </div>

 {/* Hỗ trợ */}
 <div className="border border-stone-300 dark:border-slate-700 bg-stone-900 dark:bg-stone-100 p-5 text-white dark:text-stone-900">
 <div className="text-xs uppercase tracking-[0.3em] mb-2 opacity-70">Hỗ trợ</div>
 <div className="text-lg font-semibold mb-2">Liên hệ CSKH</div>
 <p className="text-xs opacity-80 mb-4">
 Chat trực tiếp 24/7. Hotline 0987.654.321.
 </p>
 <button className="w-full h-9 border border-white dark:border-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-white transition-colors">
 Liên hệ
 </button>
 </div>
 </aside>

 {/* MAIN */}
 <div>
 {/* Category banner */}
 {activeCategory && (
 <div className="border border-stone-300 dark:border-slate-700 p-6 mb-6">
 <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400 mb-2">
 Danh mục
 </div>
 <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
 {activeCategory.name}
 </h1>
 {activeCategory.description && (
 <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 italic">
 {activeCategory.description}
 </p>
 )}
 </div>
 )}

 {/* Toolbar */}
 <div className="border border-stone-300 dark:border-slate-700 px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-3 font-sans">
 <div className="text-sm text-stone-600 dark:text-stone-300">
 Tìm thấy{""}
 <b className="text-stone-900 dark:text-stone-100">
 {products.data?.totalElements ?? 0}
 </b>{""}
 sản phẩm
 {searchQuery && <> cho từ khoá"<b>{searchQuery}</b>"</>}
 </div>
 <div className="flex items-center gap-2 text-sm">
 <span className="text-stone-500 dark:text-stone-400 uppercase text-xs tracking-wider">Sắp xếp:</span>
 <select className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-200 px-3 py-1.5 text-sm focus:border-stone-900 outline-none">
 <option>Mới nhất</option>
 <option>Giá tăng dần</option>
 <option>Giá giảm dần</option>
 <option>Bán chạy</option>
 </select>
 </div>
 </div>

 {/* Grid */}
 {products.loading && (
 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="h-64 border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800 animate-pulse" />
 ))}
 </div>
 )}
 {products.error && (
 <div className="border border-stone-300 dark:border-slate-700 p-6 text-center text-sm">
 <p className="text-stone-600 dark:text-stone-400 mb-3">{products.error}</p>
 <button onClick={products.reload} className="underline text-stone-900 dark:text-stone-100">
 Thử lại
 </button>
 </div>
 )}
 {products.data && products.data.content.length === 0 && (
 <div className="border border-stone-300 dark:border-slate-700 p-12 text-center">
 <p className="text-stone-600 dark:text-stone-300">Không có sản phẩm phù hợp.</p>
 </div>
 )}
 {products.data && products.data.content.length > 0 && (
 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
 {products.data.content.map((p) => (
 <ProductCard key={p.id} product={toCard(p)} />
 ))}
 </div>
 )}

 {/* Pagination */}
 {products.data && products.data.totalPages > 1 && (
 <div className="mt-10 flex items-center justify-center gap-1 font-sans">
 <button
 onClick={() => setPage((p) => Math.max(0, p - 1))}
 disabled={page === 0}
 className="px-4 h-10 border border-stone-300 dark:border-slate-700 text-sm hover:border-stone-900 disabled:opacity-40 text-stone-700 dark:text-stone-200"
 >
 ←
 </button>
 {Array.from({ length: products.data.totalPages }).map((_, i) => (
 <button
 key={i}
 onClick={() => setPage(i)}
 className={`w-10 h-10 border text-sm font-semibold ${
 i === page
 ?"bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900"
 :"bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 hover:border-stone-900 text-stone-700 dark:text-stone-200"
 }`}
 >
 {i + 1}
 </button>
 ))}
 <button
 onClick={() => setPage((p) => Math.min((products.data?.totalPages ?? 1) - 1, p + 1))}
 disabled={products.data.last}
 className="px-4 h-10 border border-stone-300 dark:border-slate-700 text-sm hover:border-stone-900 disabled:opacity-40 text-stone-700 dark:text-stone-200"
 >
 →
 </button>
 </div>
 )}

 {/* Bảng giá tham khảo */}
 {cats.data && (
 <div className="mt-12 border border-stone-300 dark:border-slate-700">
 <div className="border-b border-stone-300 dark:border-slate-700 px-5 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 dark:text-stone-100">
 Bảng giá tham khảo
 </div>
 <table className="w-full text-sm font-sans">
 <tbody className="divide-y divide-stone-200 dark:divide-slate-800">
 {cats.data.map((c) => (
 <tr key={c.id} className="hover:bg-stone-50 dark:hover:bg-slate-800">
 <td className="px-5 py-2.5 text-stone-700 dark:text-stone-300">{c.name}</td>
 <td className="px-5 py-2.5 text-right text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
 {c.productCount} sản phẩm
 </td>
 <td className="px-5 py-2.5 text-right font-semibold text-stone-900 dark:text-stone-100">
 <Link to={`/shop/products?cat=${c.slug}`} className="hover:underline">
 Xem →
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
