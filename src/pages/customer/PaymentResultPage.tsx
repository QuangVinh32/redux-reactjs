import { useSearchParams, Link } from "react-router-dom";

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") ?? params.get("orderRef");
  const resultCode = params.get("resultCode");
  const message = params.get("message");
  const success = resultCode === "0" || resultCode === null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <div className="text-7xl">{success ? "🎉" : "❌"}</div>
        <h1 className="mt-4 text-2xl font-extrabold text-gray-800">
          {success ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h1>
        {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
        {orderId && (
          <p className="mt-1 text-sm text-gray-600">
            Mã đơn: <strong>#{orderId}</strong>
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          {orderId && (
            <Link
              to={`/orders/${orderId}`}
              className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
            >
              Xem đơn hàng
            </Link>
          )}
          <Link
            to="/products"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Tiếp tục mua
          </Link>
        </div>
      </div>
    </div>
  );
}
