import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import {
  useDeleteProductMutation,
  useListProductsQuery,
} from "../../api/catalogApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { fileUrl } from "../../utils/format";

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const { data, isFetching } = useListProductsQuery({ page, size: 12, q: q || undefined });
  const [deleteProduct] = useDeleteProductMutation();
  const dispatch = useAppDispatch();

  const onDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa "${name}"?`)) return;
    try {
      await deleteProduct(id).unwrap();
      dispatch(showToast({ message: "Đã xóa sản phẩm", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-gray-800">Sản phẩm</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
        >
          <Plus size={16} /> Thêm sản phẩm
        </Link>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {isFetching ? (
        <FullPageSpinner />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Sản phẩm</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data?.content.map((p) => (
                <tr key={p.productId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.productImages?.[0] && (
                        <img
                          src={fileUrl(p.productImages[0])}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{p.productName}</p>
                        <p className="text-xs text-gray-400">#{p.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{String(p.categoryStatus ?? "—")}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/admin/products/${p.productId}`}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => onDelete(p.productId, p.productName)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && (
            <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
          )}
        </div>
      )}
    </div>
  );
}
