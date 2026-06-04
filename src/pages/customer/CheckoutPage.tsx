import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Ticket, CreditCard, Wallet } from "lucide-react";
import { useGetCartQuery, useGetTotalQuery } from "../../api/cartApi";
import { useListAddressesQuery, useListMyVouchersQuery, useCreateMomoPaymentMutation } from "../../api/miscApi";
import { useCheckoutMutation } from "../../api/orderApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Empty from "../../components/common/Empty";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import {
  cartItemImageUrl,
  cartItemProductName,
  cartItemSizeName,
  cartItemUnitPrice,
  formatVND,
} from "../../utils/format";
import type { PaymentMethod } from "../../types/backend";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: items, isLoading } = useGetCartQuery();
  const { data: total } = useGetTotalQuery();
  const { data: addresses } = useListAddressesQuery();
  const { data: vouchers } = useListMyVouchersQuery();
  const [checkout, { isLoading: placing }] = useCheckoutMutation();
  const [createMomo, { isLoading: payingMomo }] = useCreateMomoPaymentMutation();

  const [addressId, setAddressId] = useState<number | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  if (addresses && addresses.length > 0 && addressId === null) {
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setAddressId(def.id);
  }

  if (isLoading) return <FullPageSpinner />;
  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Empty title="Giỏ hàng trống" icon="🛒" />
      </div>
    );
  }

  const shippingFee = (total ?? 0) >= 300_000 ? 0 : 25_000;
  const grandTotal = (total ?? 0) + shippingFee;

  const onPlace = async () => {
    if (!addressId) {
      dispatch(showToast({ message: "Chọn địa chỉ nhận hàng", kind: "error" }));
      return;
    }
    try {
      const res = await checkout({
        shippingAddressId: addressId,
        voucherCode: voucherCode || undefined,
        note: note || undefined,
        paymentMethod,
      }).unwrap();
      dispatch(
        showToast({
          message:
            paymentMethod === "COD"
              ? `Đặt đơn #${res.orderId} thành công — thanh toán khi nhận hàng`
              : `Tạo đơn #${res.orderId}, đang chuyển sang Momo...`,
          kind: "success",
        })
      );

      if (res.paymentMethod === "MOMO") {
        const pay = await createMomo(res.orderId).unwrap();
        window.location.href = pay.payUrl;
      } else {
        navigate(`/orders/${res.orderId}`);
      }
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi đặt đơn", kind: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-extrabold text-gray-800">Thanh toán</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Address */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
                <MapPin size={18} className="text-rose-500" /> Địa chỉ nhận hàng
              </h2>
              <Link to="/addresses" className="text-xs font-semibold text-rose-500 hover:underline">
                + Thêm địa chỉ
              </Link>
            </div>
            {!addresses || addresses.length === 0 ? (
              <p className="text-sm text-gray-500">
                Chưa có địa chỉ.{" "}
                <Link to="/addresses" className="text-rose-500 hover:underline">
                  Thêm ngay
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      addressId === a.id
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === a.id}
                      onChange={() => setAddressId(a.id)}
                      className="mt-1 accent-rose-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {a.receiverName} • {a.receiverPhone}
                        {a.isDefault && (
                          <span className="ml-2 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                            Mặc định
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {a.addressLine}, {a.ward}, {a.district}, {a.province}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Items */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 text-base font-bold text-gray-800">
              Sản phẩm ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <img src={cartItemImageUrl(item)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                      {cartItemProductName(item)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size {cartItemSizeName(item)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {formatVND(cartItemUnitPrice(item) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Voucher */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-800">
              <Ticket size={18} className="text-rose-500" /> Voucher
            </h2>
            <div className="flex gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Mã giảm giá"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm uppercase outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              />
            </div>
            {vouchers && vouchers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {vouchers.slice(0, 5).map((v) => (
                  <button
                    key={v.voucherId}
                    onClick={() => setVoucherCode(v.code)}
                    className="rounded-full border border-dashed border-rose-300 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100"
                  >
                    {v.code}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Note */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 text-base font-bold text-gray-800">Ghi chú</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Vd: Giao trước 18h, gọi trước khi đến..."
              className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 text-base font-bold text-gray-800">Phương thức thanh toán</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${paymentMethod === "COD" ? "border-rose-500 bg-rose-50" : "border-gray-200"}`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-rose-500"
                />
                <Wallet size={18} />
                <span className="text-sm font-semibold">Tiền mặt khi nhận</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${paymentMethod === "MOMO" ? "border-rose-500 bg-rose-50" : "border-gray-200"}`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === "MOMO"}
                  onChange={() => setPaymentMethod("MOMO")}
                  className="accent-rose-500"
                />
                <CreditCard size={18} className="text-pink-500" />
                <span className="text-sm font-semibold">Ví Momo</span>
              </label>
            </div>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-20 rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="text-base font-bold text-gray-800">Tóm tắt</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatVND(total ?? 0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
            </div>
            {voucherCode && (
              <div className="flex justify-between text-emerald-600">
                <span>Voucher</span>
                <span>{voucherCode}</span>
              </div>
            )}
            <div className="my-3 border-t border-dashed border-gray-200" />
            <div className="flex items-baseline justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="text-xl text-rose-500">{formatVND(grandTotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              * Voucher (nếu có) sẽ được áp tự động bởi server
            </p>
          </div>
          <Button
            full
            size="lg"
            className="mt-5"
            onClick={onPlace}
            loading={placing || payingMomo}
            disabled={!addressId}
          >
            Đặt hàng
          </Button>
        </aside>
      </div>
    </div>
  );
}
