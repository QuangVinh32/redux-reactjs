import { useParams } from "react-router-dom";
import { useGetOrderQuery, useUpdateStatusMutation } from "../../api/orderApi";
import { useCreateMomoPaymentMutation } from "../../api/miscApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { fileUrl, formatDate, formatVND, priceAfterDiscount } from "../../utils/format";
import { orderStatusColor, orderStatusLabel } from "../../utils/status";

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const { data: order, isLoading } = useGetOrderQuery(orderId);
  const [updateStatus, { isLoading: cancelling }] = useUpdateStatusMutation();
  const [payMomo, { isLoading: payingMomo }] = useCreateMomoPaymentMutation();
  const dispatch = useAppDispatch();

  if (isLoading || !order) return <FullPageSpinner />;

  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  const onCancel = async () => {
    if (!confirm("Xác nhận hủy đơn này?")) return;
    try {
      await updateStatus({ orderId, status: "CANCELED" }).unwrap();
      dispatch(showToast({ message: "Đã hủy đơn", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  const onPay = async () => {
    try {
      const res = await payMomo(orderId).unwrap();
      window.location.href = res.payUrl;
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi thanh toán", kind: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Đơn #{order.orderId}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${orderStatusColor[order.status]}`}
        >
          {orderStatusLabel[order.status]}
        </span>
      </div>

      <div className="space-y-4">
        {/* Address */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-gray-700">Địa chỉ giao</h3>
          <p className="text-sm">
            <strong>{order.receiverName}</strong> • {order.receiverPhone}
          </p>
          <p className="mt-1 text-sm text-gray-600">{order.shippingAddress}</p>
          {order.note && (
            <p className="mt-2 rounded-lg bg-gray-50 p-2 text-xs italic text-gray-500">
              📝 {order.note}
            </p>
          )}
        </section>

        {/* Items */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-gray-700">Sản phẩm</h3>
          <div className="space-y-3">
            {order.orderDetails?.map((d) => (
              <div key={d.orderDetailId} className="flex gap-3">
                <img src={fileUrl(d.image)} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{d.productName}</p>
                  <p className="text-xs text-gray-500">
                    Size {d.sizeName} × {d.quantity}
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {formatVND(priceAfterDiscount(d.price, d.discount) * d.quantity)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-gray-700">Tổng tiền</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatVND(order.originalAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Giảm giá {order.voucherCode && `(${order.voucherCode})`}</span>
                <span>-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng</span>
              <span>{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</span>
            </div>
            <div className="my-3 border-t border-dashed border-gray-200" />
            <div className="flex items-baseline justify-between text-base font-bold">
              <span>Tổng cộng</span>
              <span className="text-xl text-rose-500">{formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {order.status === "PENDING" && (
            <Button variant="secondary" onClick={onPay} loading={payingMomo}>
              💳 Thanh toán Momo
            </Button>
          )}
          {canCancel && (
            <Button variant="danger" onClick={onCancel} loading={cancelling}>
              Hủy đơn
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
