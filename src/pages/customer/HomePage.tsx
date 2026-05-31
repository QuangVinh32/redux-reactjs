import { Link } from "react-router-dom";
import { useListProductsQuery, useListCategoriesQuery, useListBannersQuery } from "../../api/catalogApi";
import ProductCard from "../../components/customer/ProductCard";
import { FullPageSpinner } from "../../components/common/Spinner";
import { fileUrl } from "../../utils/format";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const { data: products, isLoading } = useListProductsQuery({ size: 8, sort: "totalSold,desc" });
  const { data: categories } = useListCategoriesQuery({});
  const { data: banners } = useListBannersQuery({ size: 5 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero / Banner */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 via-amber-50 to-white p-8 sm:p-12">
        <div className="grid items-center gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-500">
              ShopFood • Đặt món online
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-gray-800 sm:text-4xl">
              Đói rồi? <br />
              Đặt món chỉ <span className="text-rose-500">3 chạm</span> 🍕
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Giao siêu tốc, freeship đơn từ 300k. Voucher 10% cho đơn đầu tiên.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-200 hover:bg-rose-600"
              >
                Khám phá thực đơn
              </Link>
              <Link
                to="/products?sort=averageRating,desc"
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Top đánh giá
              </Link>
            </div>
          </div>
          <div className="text-center text-8xl sm:text-[10rem]">🍔🍕🍜</div>
        </div>
      </section>

      {/* Banner carousel (simple grid) */}
      {banners && banners.content.length > 0 && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.content.slice(0, 3).map((b) => (
            <a
              key={b.bannerId}
              href={b.redirectUrl ?? "#"}
              className="block overflow-hidden rounded-2xl shadow-sm transition hover:shadow-lg"
            >
              <img
                src={fileUrl(b.image)}
                alt={b.title}
                className="aspect-[2/1] w-full object-cover"
              />
            </a>
          ))}
        </section>
      )}

      {/* Categories */}
      {categories && categories.content.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-extrabold text-gray-800">Danh mục</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* {categories.content.map((c) => (
              <Link
                key={c.categoryId} to={`/products?categoryId=${c.categoryId}`}
                className="group flex min-w-[120px] flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-rose-200 hover:shadow-md"
              >
                {c.image ? (
                  <img
                    src={fileUrl(c.image)}
                    alt={c.categoryStatus}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl">
                    🍱
                  </div>
                )}
                <span className="mt-2 text-xs font-semibold text-gray-700 group-hover:text-rose-500">
                  {c.categoryStatus}
                </span>
              </Link>
            ))} */}
            {categories?.content.map((c) => (
              <Link
                key={c.categoryId}
                to={`/products?categoryId=${c.categoryId}`}
                className="group flex min-w-[120px] flex-col items-center rounded-2xl border border-gray-100 bg-white p-4"
              >
                <img
                  src={fileUrl(c.categoryImage)}
                  alt={c.categoryStatus}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <span>
                  {c.categoryStatus}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-extrabold text-gray-800">Bán chạy nhất</h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:underline"
          >
            Xem tất cả <ChevronRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <FullPageSpinner />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products?.content.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
