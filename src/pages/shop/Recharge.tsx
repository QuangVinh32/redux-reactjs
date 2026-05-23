import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBalance } from "../../redux/slices/ShopSlice";
import { formatVnd, rechargeMethods } from "../../constants/ShopData";

const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

export default function Recharge() {
  const dispatch = useDispatch();
  const { isLoggedIn, balance } = useSelector((s: any) => s.shop);
  const [method, setMethod] = useState("bank");
  const [amount, setAmount] = useState(100000);

  const onRecharge = () => {
    dispatch(addBalance(amount));
    alert(`Nạp thành công ${formatVnd(amount)}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">💳 Nạp Tiền Vào Tài Khoản</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Form chính */}
        <div className="space-y-5">
          {/* Phương thức */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">
              1️⃣ Chọn phương thức thanh toán
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {rechargeMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    method === m.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                  }`}
                >
                  <div className="text-3xl mb-1">{m.icon}</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{m.label}</div>
                  <div
                    className={`text-xs mt-0.5 font-bold ${
                      m.bonus.startsWith("-") ? "text-rose-500" : "text-emerald-600"
                    }`}
                  >
                    {m.bonus}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mệnh giá */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">2️⃣ Chọn mệnh giá</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {quickAmounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`py-3 rounded-lg font-bold text-sm transition-all ${
                    amount === a
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {formatVnd(a)}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Hoặc nhập số tiền tuỳ chọn:</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full h-11 px-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-400 outline-none text-sm"
                placeholder="Nhập số tiền..."
              />
            </label>
          </div>

          {/* Hướng dẫn */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="font-bold text-amber-800 mb-2">📌 Hướng dẫn nạp tiền</h2>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>Nội dung chuyển khoản: <code className="bg-white px-2 py-0.5 rounded font-mono">NAP demo_user</code></li>
              <li>Tự động cộng tiền sau 1-3 phút.</li>
              <li>Liên hệ CSKH nếu sau 10 phút chưa được cộng.</li>
            </ul>
          </div>
        </div>

        {/* Sidebar tổng kết */}
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white rounded-xl p-5 mb-4">
            <div className="text-sm text-emerald-50">Số dư hiện tại</div>
            <div className="text-3xl font-black mt-1">
              {isLoggedIn ? formatVnd(balance) : "0đ"}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">📝 Tóm tắt giao dịch</h3>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Phương thức:</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">
                  {rechargeMethods.find((m) => m.id === method)?.label}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Số tiền:</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{formatVnd(amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Khuyến mãi:</dt>
                <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {rechargeMethods.find((m) => m.id === method)?.bonus}
                </dd>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-base text-slate-800 dark:text-slate-100">
                <dt className="font-bold">Tổng cộng:</dt>
                <dd className="font-black text-rose-600 dark:text-rose-400">{formatVnd(amount)}</dd>
              </div>
            </dl>

            <button
              onClick={onRecharge}
              disabled={!isLoggedIn || amount <= 0}
              className="w-full h-12 mt-4 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold transition-colors"
            >
              {isLoggedIn ? "✅ Xác Nhận Nạp" : "🔒 Đăng nhập để nạp"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
