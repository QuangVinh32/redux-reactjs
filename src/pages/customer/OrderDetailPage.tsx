import { useParams } from "react-router-dom";
import { useGetOrderQuery, useUpdateStatusMutation } from "../../api/orderApi";
import { useCreateMomoPaymentMutation } from "../../api/miscApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { formatDate, formatVND, priceAfterDiscount } from "../../utils/format";
import { orderStatusColor, orderStatusLabel } from "../../utils/status";
import { paymentMethodColor, paymentMethodIcon, paymentMethodLabel } from "../../utils/payment";

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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Đơn #{order.orderId}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {order.paymentMethod && (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${paymentMethodColor[order.paymentMethod]}`}
            >
              {paymentMethodIcon[order.paymentMethod]} {paymentMethodLabel[order.paymentMethod]}
            </span>
          )}
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${orderStatusColor[order.status]}`}
          >
            {orderStatusLabel[order.status]}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Customer info (from OrderGetDTO: fullName, phone, address) */}
        {(order.fullName || order.phone || order.address) && (
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-gray-700">Thông tin nhận hàng</h3>
            {order.fullName && (
              <p className="text-sm">
                <strong>{order.fullName}</strong>
                {order.phone && <> • {order.phone}</>}
              </p>
            )}
            {order.address && (
              <p className="mt-1 text-sm text-gray-600">{order.address}</p>
            )}
          </section>
        )}

        {/* Items */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-gray-700">Sản phẩm</h3>
          <div className="space-y-3">
            {order.orderDetails?.map((d, i) => {
              const discount = d.discountApplied ?? 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xl">
                    🍽️
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{d.productName}</p>
                    <p className="text-xs text-gray-500">
                      {d.sizeName ? `Size ${d.sizeName} × ` : ""}{d.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {formatVND(priceAfterDiscount(d.price, discount) * d.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-gray-700">Tổng tiền</h3>
          <div className="space-y-2 text-sm">
            {order.originalAmount != null && (
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatVND(order.originalAmount)}</span>
              </div>
            )}
            {order.discountAmount != null && order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Giảm giá</span>
                <span>-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="my-3 border-t border-dashed border-gray-200" />
            <div className="flex items-baseline justify-between text-base font-bold">
              <span>Tổng cộng</span>
              <span className="text-xl text-rose-500">{formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        {order.paymentMethod === "COD" && order.status === "PENDING" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            💵 <strong>Thanh toán khi nhận hàng (COD).</strong> Vui lòng chuẩn bị <strong>{formatVND(order.totalAmount)}</strong> tiền mặt cho shipper.
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {order.paymentMethod === "MOMO" && order.status === "PENDING" && (
            <Button variant="secondary" onClick={onPay} loading={payingMomo}>
              💳 Thanh toán Momo ngay
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
