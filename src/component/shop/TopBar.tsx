import { useSelector, useDispatch } from "react-redux";
import { setCurrency, setLanguage, login, logout } from "../../redux/slices/ShopSlice";
import { formatVnd } from "../../constants/ShopData";

export default function TopBar() {
  const dispatch = useDispatch();
  const { isLoggedIn, username, balance, discountPercent, currency, language } =
    useSelector((s: any) => s.shop);

  return (
    <div className="bg-slate-900 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">
            Hotline: <span className="text-emerald-400 font-semibold">0987.654.321</span>
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">Hỗ trợ 24/7</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(setLanguage("vi"))}
              className={`px-2 py-0.5 rounded ${language === "vi" ? "bg-emerald-500 text-white" : "hover:text-white"}`}
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => dispatch(setLanguage("en"))}
              className={`px-2 py-0.5 rounded ${language === "en" ? "bg-emerald-500 text-white" : "hover:text-white"}`}
            >
              🇬🇧 EN
            </button>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(setCurrency("VND"))}
              className={`px-2 py-0.5 rounded ${currency === "VND" ? "bg-emerald-500 text-white" : "hover:text-white"}`}
            >
              VND
            </button>
            <button
              onClick={() => dispatch(setCurrency("USD"))}
              className={`px-2 py-0.5 rounded ${currency === "USD" ? "bg-emerald-500 text-white" : "hover:text-white"}`}
            >
              USD
            </button>
          </div>

          <span className="text-slate-600">|</span>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span>👤 {username}</span>
              <span className="text-emerald-400">
                Số Dư: <b>{formatVnd(balance)}</b>
              </span>
              <span className="text-amber-400">Giảm: {discountPercent}%</span>
              <button
                onClick={() => dispatch(logout())}
                className="hover:text-white"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                dispatch(login({ username: "demo_user", balance: 250000 }))
              }
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
