import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import {
  useAdminOrdersQuery,
  useUpdateStatusMutation,
} from "../../api/orderApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { fileUrl, formatDate, formatVND, priceAfterDiscount } from "../../utils/format";
import { nextAdminStatuses, orderStatusColor, orderStatusLabel } from "../../utils/status";
import type { Order, OrderStatus } from "../../types/backend";

const statusFilters: (OrderStatus | "")[] = [
  "", "PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "COMPLETED", "CANCELED", "RETURNED",
];

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const { data, isFetching } = useAdminOrdersQuery({
    page,
    size: 15,
    search: search || undefined,
    status: (status || undefined) as OrderStatus | undefined,
  });
  const [updateStatus, { isLoading: updating }] = useUpdateStatusMutation();
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<Order | null>(null);

  const setStatusFor = async (orderId: number, s: OrderStatus) => {
    try {
      await updateStatus({ orderId, status: s }).unwrap();
      dispatch(showToast({ message: `Đã chuyển sang ${orderStatusLabel[s]}`, kind: "success" }));
      setSelected(null);
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  return (
    <div>
      <h1 className="mb-5 text-xl font-extrabold text-gray-800">Đơn hàng</h1>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OrderStatus | "");
            setPage(0);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          {statusFilters.map((s) => (
            <option key={s} value={s}>
              {s ? orderStatusLabel[s as OrderStatus] : "Tất cả trạng thái"}
            </option>
          ))}
        </select>
      </div>

      {isFetching ? (
        <FullPageSpinner />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">Tổng</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Ngày tạo</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data?.content.map((o) => (
                <tr key={o.orderId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-bold text-gray-800">#{o.orderId}</td>
                  <td className="px-4 py-3 text-gray-700">{o.fullName}</td>
                  <td className="px-4 py-3 font-bold text-rose-500">{formatVND(o.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${orderStatusColor[o.status]}`}>
                      {orderStatusLabel[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(o)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Đơn #${selected.orderId}` : ""}
        width="max-w-2xl"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${orderStatusColor[selected.status]}`}>
                {orderStatusLabel[selected.status]}
              </span>
              <span className="text-xs text-gray-400">{formatDate(selected.createdAt)}</span>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-semibold text-gray-800">
                {selected.receiverName ?? selected.fullName} • {selected.receiverPhone}
              </p>
              <p className="mt-1 text-xs text-gray-500">{selected.shippingAddress}</p>
              {selected.note && (
                <p className="mt-2 text-xs italic text-gray-500">📝 {selected.note}</p>
              )}
            </div>

            <div className="space-y-2">
              {selected.orderDetails?.map((d) => (
                <div key={d.orderDetailId} className="flex gap-3 rounded-lg border border-gray-100 p-2">
                  <img src={fileUrl(d.image)} alt="" className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 text-xs font-semibold">{d.productName}</p>
                    <p className="text-xs text-gray-500">{d.sizeName} × {d.quantity}</p>
                  </div>
                  <span className="text-xs font-bold">
                    {formatVND(priceAfterDiscount(d.price, d.discount) * d.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 border-t border-gray-100 pt-3 text-xs">
              <div className="flex justify-between"><span>Tạm tính</span><span>{formatVND(selected.originalAmount)}</span></div>
              <div className="flex justify-between text-emerald-600"><span>Giảm giá</span><span>-{formatVND(selected.discountAmount)}</span></div>
              <div className="flex justify-between"><span>Phí ship</span><span>{formatVND(selected.shippingFee)}</span></div>
              <div className="flex justify-between text-base font-bold text-rose-500"><span>Tổng</span><span>{formatVND(selected.totalAmount)}</span></div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase text-gray-500">Chuyển trạng thái</p>
              <div className="flex flex-wrap gap-2">
                {nextAdminStatuses[selected.status].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={s === "CANCELED" || s === "RETURNED" ? "danger" : "primary"}
                    loading={updating}
                    onClick={() => setStatusFor(selected.orderId, s)}
                  >
                    → {orderStatusLabel[s]}
                  </Button>
                ))}
                {nextAdminStatuses[selected.status].length === 0 && (
                  <p className="text-xs text-gray-400">Trạng thái cuối, không thể chuyển tiếp</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
