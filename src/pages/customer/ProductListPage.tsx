import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useListCategoriesQuery, useListProductsQuery } from "../../api/catalogApi";
import ProductCard from "../../components/customer/ProductCard";
import { FullPageSpinner } from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import Empty from "../../components/common/Empty";

const sortOptions = [
  { value: "productId,desc", label: "Mới nhất" },
  { value: "totalSold,desc", label: "Bán chạy" },
  { value: "averageRating,desc", label: "Đánh giá cao" },
];

export default function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("categoryId");
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "productId,desc";
  const [page, setPage] = useState(0);

  const { data: categories } = useListCategoriesQuery({});
  const { data, isFetching } = useListProductsQuery({
    page,
    size: 12,
    sort,
    categoryId: categoryId ? Number(categoryId) : undefined,
    q: q || undefined,
  });

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold text-gray-800">Thực đơn</h1>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setParam("categoryId", null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${!categoryId ? "bg-rose-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        >
          Tất cả
        </button>
        {categories?.content.map((c) => (
          <button
            key={c.categoryId}
            onClick={() => setParam("categoryId", String(c.categoryId))}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              Number(categoryId) === c.categoryId
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {c.categoryName}
          </button>
        ))}
      </div>

      {q && (
        <p className="mb-3 text-sm text-gray-500">
          Kết quả cho "<span className="font-semibold text-gray-700">{q}</span>"
        </p>
      )}

      {isFetching ? (
        <FullPageSpinner />
      ) : data && data.content.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.content.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        </>
      ) : (
        <Empty icon="🍽️" title="Không tìm thấy món nào" description="Thử bộ lọc khác xem sao." />
      )}
    </div>
  );
}
