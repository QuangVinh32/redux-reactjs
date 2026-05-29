import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Product } from "../../types/backend";
import { fileUrl, formatVND, priceAfterDiscount } from "../../utils/format";

export default function ProductCard({ product }: { product: Product }) {
  const firstSize = product.productSizes?.[0];
  const price = firstSize ? priceAfterDiscount(firstSize.price, firstSize.discount) : 0;
  const original = firstSize?.price ?? 0;
  const hasDiscount = firstSize && firstSize.discount > 0;
  const img = product.productImages?.[0]?.image;
  const lowStock =
    product.productSizes && product.productSizes.every((s) => s.quantity === 0);

  return (
    <Link
      to={`/products/${product.productId}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {img && (
          <img
            src={fileUrl(img)}
            alt={product.productName}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{firstSize?.discount}%
          </span>
        )}
        {lowStock && (
          <span className="absolute right-2 top-2 rounded-full bg-gray-800/80 px-2 py-0.5 text-[10px] font-bold text-white">
            Hết hàng
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-800">
          {product.productName}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
          <Star size={12} fill="currentColor" />
          <span>{product.averageRating?.toFixed(1) ?? "—"}</span>
          {product.totalSold != null && (
            <span className="ml-1 text-gray-400">• Đã bán {product.totalSold}</span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-bold text-rose-500">{formatVND(price)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">{formatVND(original)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
