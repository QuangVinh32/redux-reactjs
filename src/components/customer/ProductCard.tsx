import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/backend";
import { fileUrl } from "../../utils/format";

export default function ProductCard({ product }: { product: ProductSummary }) {
  const rawImg = product.productImages?.[0];

  return (
    <Link
      to={`/products/${product.productId}`}
      className="group block overflow-hidden rounded-lg border border-gray-100 bg-white transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        {rawImg ? (
          <img
            src={fileUrl(rawImg)}
            alt={product.productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl">🍔</div>
        )}
      </div>

      <div className="px-2 py-1.5">
        <h3 className="truncate text-xs font-medium text-gray-800 text-center">
          {product.productName}
        </h3>
      </div>
    </Link>
  );
}
