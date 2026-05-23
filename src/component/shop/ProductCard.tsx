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
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all overflow-hidden flex flex-col">
      <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-7xl">
        {product.image}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 ${badgeStyles[product.badge]} text-white text-[10px] font-black px-2 py-0.5 rounded`}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
          Kho: {product.stock}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-end justify-between gap-2 mb-3">
          <div>
            <div className="text-lg font-black text-rose-600">
              {formatVnd(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatVnd(product.oldPrice)}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => dispatch(addToCart(product.id))}
          className="w-full h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold transition-all"
        >
          🛒 Mua Ngay
        </button>
      </div>
    </div>
  );
}
