import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCartLocal } from "../../redux/slices/ShopSlice";
import { cartApi } from "../../api/endpoints";
import { tokenStorage, ApiClientError } from "../../api/client";
import { formatVnd, type Product } from "../../constants/ShopData";

const badgeStyles: Record<string, string> = {
  HOT: "border-rose-700 text-rose-700",
  NEW: "border-blue-700 text-blue-700",
  SALE: "border-amber-700 text-amber-700",
};

const isUrl = (s?: string) =>
  !!s && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const onAdd = async () => {
    setAdding(true);
    setMsg("");
    try {
      if (tokenStorage.getAccess()) {
        await cartApi.add(Number(product.id), 1);
      }
      dispatch(addToCartLocal(Number(product.id)));
      setMsg("Đã thêm");
      setTimeout(() => setMsg(""), 1500);
    } catch (e) {
      setMsg(e instanceof ApiClientError ? e.message : "Lỗi");
      setTimeout(() => setMsg(""), 2500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-stone-900 dark:hover:border-stone-300 transition-colors overflow-hidden flex flex-col">
      <div className="relative h-32 sm:h-40 bg-stone-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {isUrl(product.image) ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-4xl sm:text-5xl opacity-80">{product.image || "·"}</span>
        )}
        {product.badge && (
          <span className={`absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 border ${badgeStyles[product.badge] ?? "border-stone-700 text-stone-700"} text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider`}>
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-snug mb-1 group-hover:underline line-clamp-2">
          {product.name}
        </h3>
        <p className="hidden sm:block text-xs text-stone-500 dark:text-stone-400 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-end justify-between gap-2 mb-3 mt-2">
          <div>
            <div className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {formatVnd(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-[10px] sm:text-xs text-stone-400 line-through leading-tight">
                {formatVnd(product.oldPrice)}
              </div>
            )}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Kho {product.stock}
          </div>
        </div>

        <button
          onClick={onAdd}
          disabled={adding}
          className="w-full h-9 border border-stone-900 dark:border-stone-300 bg-white dark:bg-slate-900 hover:bg-stone-900 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 disabled:opacity-60 text-stone-900 dark:text-stone-100 text-xs font-semibold tracking-wide transition-colors"
        >
          {adding ? "..." : msg || "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}
