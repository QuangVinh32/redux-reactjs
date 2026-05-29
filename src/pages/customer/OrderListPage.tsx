import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyOrdersQuery } from "../../api/orderApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Empty from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";
import { fileUrl, formatDate, formatVND } from "../../utils/format";
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
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {o.orderDetails?.slice(0, 4).map((d) => (
                <img
                  key={d.orderDetailId}
                  src={fileUrl(d.image)}
                  alt=""
                  className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                />
              ))}
              {o.orderDetails?.length > 4 && (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                  +{o.orderDetails.length - 4}
                </div>
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
