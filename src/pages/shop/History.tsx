import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatVnd, products } from "../../constants/ShopData";

const mockOrders = [
  {
    id: "#ORD-20260520-001",
    date: "2026-05-20 14:32",
    productId: "p1",
    qty: 2,
    status: "Đã giao",
    statusColor: "emerald",
  },
  {
    id: "#ORD-20260518-014",
    date: "2026-05-18 09:15",
    productId: "p3",
    qty: 1,
    status: "Đã giao",
    statusColor: "emerald",
  },
  {
    id: "#ORD-20260515-203",
    date: "2026-05-15 22:08",
    productId: "p6",
    qty: 5,
    status: "Đang xử lý",
    statusColor: "amber",
  },
  {
    id: "#ORD-20260510-188",
    date: "2026-05-10 11:42",
    productId: "p7",
    qty: 3,
    status: "Hoàn tiền",
    statusColor: "rose",
  },
];

export default function History() {
  const isLoggedIn = useSelector((s: any) => s.shop.isLoggedIn as boolean);

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Vui lòng đăng nhập
        </h2>
        <p className="text-slate-500 mb-6">
          Bạn cần đăng nhập để xem lịch sử đơn hàng.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg"
        >
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-slate-900 mb-6">📋 Lịch Sử Mua Hàng</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Tổng đơn", value: "127", icon: "📦", color: "emerald" },
          { label: "Đã giao", value: "121", icon: "✅", color: "blue" },
          { label: "Đang xử lý", value: "4", icon: "⏳", color: "amber" },
          { label: "Hoàn tiền", value: "2", icon: "↩️", color: "rose" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black text-${s.color}-600`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Mã đơn</th>
                <th className="text-left px-4 py-3 font-semibold">Thời gian</th>
                <th className="text-left px-4 py-3 font-semibold">Sản phẩm</th>
                <th className="text-center px-4 py-3 font-semibold">SL</th>
                <th className="text-right px-4 py-3 font-semibold">Tổng tiền</th>
                <th className="text-center px-4 py-3 font-semibold">Trạng thái</th>
                <th className="text-center px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockOrders.map((o) => {
                const product = products.find((p) => p.id === o.productId)!;
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-emerald-700">
                      {o.id}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {o.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{product.image}</span>
                        <span className="font-semibold text-slate-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{o.qty}</td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600">
                      {formatVnd(product.price * o.qty)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-${o.statusColor}-100 text-${o.statusColor}-700`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
