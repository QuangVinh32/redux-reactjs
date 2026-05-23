import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/ShopSlice";
import { formatVnd, type Product } from "../../constants/ShopData";

const badgeStyles: Record<string, string> = {
  HOT: "bg-rose-500",
  NEW: "bg-blue-500",
  SALE: "bg-amber-500",
};

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xl transition-all overflow-hidden flex flex-col">
      <div className="relative h-28 sm:h-36 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-5xl sm:text-7xl">
        {product.image}
        {product.badge && (
          <span
            className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 ${badgeStyles[product.badge]} text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded`}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white/90 backdrop-blur text-slate-700 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded">
          Kho: {product.stock}
        </span>
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-snug mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-end justify-between gap-2 mb-2 sm:mb-3 mt-2 sm:mt-0">
          <div>
            <div className="text-sm sm:text-lg font-black text-rose-600 leading-tight">
              {formatVnd(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-[10px] sm:text-xs text-slate-400 line-through leading-tight">
                {formatVnd(product.oldPrice)}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => dispatch(addToCart(product.id))}
          className="w-full h-8 sm:h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold transition-all"
        >
          🛒 Mua Ngay
        </button>
      </div>
    </div>
  );
}
