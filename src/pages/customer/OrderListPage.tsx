import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyOrdersQuery } from "../../api/orderApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Empty from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";
import { formatDate, formatVND } from "../../utils/format";
import { orderStatusColor, orderStatusLabel } from "../../utils/status";
import { paymentMethodIcon, paymentMethodShortLabel } from "../../utils/payment";

export default function OrderListPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useMyOrdersQuery({ page, size: 10 });

  if (isLoading) return <FullPageSpinner />;
  if (!data || data.content.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Empty
          icon="📦"
          title="Chưa có đơn hàng nào"
          action={
            <Link to="/products" className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white">
              Mua sắm ngay
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-extrabold text-gray-800">Đơn hàng của tôi</h1>
      <div className="space-y-3">
        {data.content.map((o) => (
          <Link
            key={o.orderId}
            to={`/orders/${o.orderId}`}
            className="block rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-rose-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-800">Đơn #{o.orderId}</p>
                <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {o.paymentMethod && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                    {paymentMethodIcon[o.paymentMethod]} {paymentMethodShortLabel[o.paymentMethod]}
                  </span>
                )}
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${orderStatusColor[o.status]}`}
                >
                  {orderStatusLabel[o.status]}
                </span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {o.orderDetails?.slice(0, 3).map((d, i) => (
                <span key={i} className="mr-2">
                  {d.productName}{d.sizeName ? ` (${d.sizeName})` : ""} × {d.quantity}
                  {i < Math.min(o.orderDetails.length, 3) - 1 ? "," : ""}
                </span>
              ))}
              {o.orderDetails && o.orderDetails.length > 3 && (
                <span className="text-gray-400">+{o.orderDetails.length - 3} món khác</span>
              )}
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-gray-100 pt-3">
              <span className="text-xs text-gray-500">
                {o.orderDetails?.length ?? 0} sản phẩm
              </span>
              <span className="text-base font-extrabold text-rose-500">
                {formatVND(o.totalAmount)}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
    </div>
  );
}
