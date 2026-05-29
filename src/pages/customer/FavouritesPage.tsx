import { useListFavouritesQuery } from "../../api/miscApi";
import ProductCard from "../../components/customer/ProductCard";
import { FullPageSpinner } from "../../components/common/Spinner";
import Empty from "../../components/common/Empty";
import { Link } from "react-router-dom";

export default function FavouritesPage() {
  const { data, isLoading } = useListFavouritesQuery();
  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-extrabold text-gray-800">Món yêu thích</h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}
        </div>
      ) : (
        <Empty
          icon="❤️"
          title="Chưa có món yêu thích"
          action={
            <Link
              to="/products"
              className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Khám phá ngay
            </Link>
          }
        />
      )}
    </div>
  );
}
