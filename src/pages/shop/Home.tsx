import { Link } from"react-router-dom";
import { useApi } from"../../hooks/useApi";
import { catalogApi } from"../../api/endpoints";
import ProductCard from"../../component/shop/ProductCard";
import type { ApiProduct } from"../../api/types";

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

export default function Home() {
 const cats = useApi(() => catalogApi.categories(), []);
 const featured = useApi(() => catalogApi.featured(), []);
 const latest = useApi(() => catalogApi.latest(), []);

 return (
 <div className="">
 <section className="bg-stone-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800">
 <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
 <div className="inline-block text-xs tracking-[0.3em] uppercase text-stone-500 dark:text-stone-400 mb-4">
 Est. 2024 · Shop BM
 </div>
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight tracking-tight">
 Tài khoản BM Facebook<br/>
 <span className="italic text-stone-600 dark:text-stone-300">— uy tín, bảo hành dài hạn</span>
 </h1>
 <p className="mt-6 text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-base">
 Kho hàng BM thường, BM xác minh doanh nghiệp Real Full Giấy Tờ.
 Giao hàng tự động ngay sau khi thanh toán.
 </p>
 <div className="mt-8 flex justify-center gap-3">
 <Link to="/shop/products" className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold tracking-wide transition-colors">
 Xem sản phẩm
 </Link>
 <Link to="/shop/recharge" className="px-6 py-3 border border-stone-900 dark:border-stone-300 text-stone-900 dark:text-stone-100 hover:bg-stone-900 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 text-sm font-semibold tracking-wide transition-colors">
 Nạp tiền
 </Link>
 </div>
 </div>
 </section>

 <section className="bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800">
 <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
 {[
 { value:"15.000+", label:"Đơn hàng" },
 { value:"99%", label:"Hài lòng" },
 { value:"24/7", label:"Hỗ trợ" },
 { value:"5 năm", label:"Kinh nghiệm" },
 ].map((s) => (
 <div key={s.label}>
 <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">{s.value}</div>
 <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mt-1">{s.label}</div>
 </div>
 ))}
 </div>
 </section>

 <section className="max-w-7xl mx-auto px-4 py-16">
 <div className="text-center mb-12">
 <div className="text-xs uppercase tracking-[0.4em] text-stone-500 dark:text-stone-400 mb-3">
 — Mục lục —
 </div>
 <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
 Danh Mục Sản Phẩm
 </h2>
 <div className="w-12 h-px bg-stone-900 dark:bg-stone-100 mx-auto mt-4" />
 </div>

 {cats.loading && <Skeleton rows={6} />}
 {cats.error && <ErrorState message={cats.error} onRetry={cats.reload} />}
 {cats.data && (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
 {cats.data.map((cat, idx) => (
 <Link
 key={cat.id}
 to={`/shop/products?cat=${cat.id}`}
 className="group block py-6 border-t border-stone-300 dark:border-slate-700 hover:border-stone-900 dark:hover:border-stone-100 transition-colors"
 >
 <div className="flex items-baseline gap-4">
 <span className="italic text-2xl text-stone-400 dark:text-stone-500 w-10 shrink-0">
 {romanize(idx + 1)}.
 </span>
 <div className="flex-1 min-w-0">
 <div className="text-xl md:text-2xl font-semibold text-stone-900 dark:text-stone-100 group-hover:underline underline-offset-4 decoration-1">
 {cat.name}
 </div>
 {cat.description && (
 <div className="text-sm text-stone-500 dark:text-stone-400 mt-1 italic line-clamp-1">
 {cat.description}
 </div>
 )}
 <div className="text-[11px] text-stone-500 dark:text-stone-500 mt-2 uppercase tracking-[0.2em]">
 {cat.productCount} sản phẩm · Xem tiếp →
 </div>
 </div>
 </div>
 </Link>
 ))}
 </div>
 )}
 </section>

 <section className="bg-stone-50 dark:bg-slate-900 border-y border-stone-200 dark:border-slate-800">
 <div className="max-w-7xl mx-auto px-4 py-12">
 <div className="flex items-end justify-between mb-6">
 <SectionHeading title="Sản phẩm nổi bật" subtitle="Hot · Sale" noMargin />
 <Link to="/shop/products" className="text-sm text-stone-700 dark:text-stone-300 hover:underline">
 Xem tất cả →
 </Link>
 </div>
 {featured.loading && <Skeleton rows={4} />}
 {featured.error && <ErrorState message={featured.error} onRetry={featured.reload} />}
 {featured.data && featured.data.length > 0 && (
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
 {featured.data.map((p) => <ProductCard key={p.id} product={toCard(p)} />)}
 </div>
 )}
 </div>
 </section>

 <section className="max-w-7xl mx-auto px-4 py-12">
 <div className="flex items-end justify-between mb-6">
 <SectionHeading title="Sản phẩm mới" subtitle="Mới về kho" noMargin />
 <Link to="/shop/products" className="text-sm text-stone-700 dark:text-stone-300 hover:underline">
 Xem tất cả →
 </Link>
 </div>
 {latest.loading && <Skeleton rows={8} />}
 {latest.error && <ErrorState message={latest.error} onRetry={latest.reload} />}
 {latest.data && (
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
 {latest.data.map((p) => <ProductCard key={p.id} product={toCard(p)} />)}
 </div>
 )}
 </section>

 <section className="max-w-7xl mx-auto px-4 pb-16">
 <div className="border border-stone-300 dark:border-slate-700 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
 <div>
 <div className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400 mb-2">Affiliate</div>
 <h3 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
 Giới thiệu — Hoa hồng 15%
 </h3>
 <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
 Giới thiệu bạn bè, nhận hoa hồng cho mỗi đơn hàng thành công.
 </p>
 </div>
 <Link to="/shop/affiliate" className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold tracking-wide whitespace-nowrap">
 Tham gia →
 </Link>
 </div>
 </section>
 </div>
 );
}

function romanize(n: number): string {
 const map: [number, string][] = [
 [10,"X"], [9,"IX"], [5,"V"], [4,"IV"], [1,"I"],
 ];
 let res ="";
 for (const [val, sym] of map) {
 while (n >= val) { res += sym; n -= val; }
 }
 return res;
}

function SectionHeading({ title, subtitle, noMargin }: { title: string; subtitle?: string; noMargin?: boolean }) {
 return (
 <div className={noMargin ?"" :"mb-6"}>
 <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">{title}</h2>
 {subtitle && <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mt-1">{subtitle}</div>}
 </div>
 );
}

function Skeleton({ rows }: { rows: number }) {
 return (
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
 {Array.from({ length: rows }).map((_, i) => (
 <div key={i} className="h-48 bg-stone-100 dark:bg-slate-800 animate-pulse" />
 ))}
 </div>
 );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
 return (
 <div className="border border-stone-300 dark:border-slate-700 p-6 text-center">
 <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">{message}</p>
 <button onClick={onRetry} className="text-sm underline text-stone-900 dark:text-stone-100 hover:no-underline">
 Thử lại
 </button>
 </div>
 );
}
