import { useSelector, useDispatch } from "react-redux";
import { setCurrency, setLanguage, login, logout } from "../../redux/slices/ShopSlice";
import { formatVnd } from "../../constants/ShopData";

export default function TopBar() {
  const dispatch = useDispatch();
  const { isLoggedIn, username, balance, discountPercent, currency, language } =
    useSelector((s: any) => s.shop);

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] md:text-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-9 flex items-center justify-between gap-2">
        {/* Left - hide hotline section on small */}
        <div className="hidden md:flex items-center gap-4 min-w-0">
          <span className="whitespace-nowrap">
            Hotline:{" "}
            <span className="text-emerald-400 font-semibold">0987.654.321</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="whitespace-nowrap">Hỗ trợ 24/7</span>
        </div>

        {/* Mobile fallback left - status */}
        <div className="md:hidden flex items-center min-w-0">
          {isLoggedIn ? (
            <span className="text-emerald-400 font-semibold truncate">
              💰 {formatVnd(balance)}
            </span>
          ) : (
            <span className="text-emerald-400 truncate">📞 0987.654.321</span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* Lang */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => dispatch(setLanguage("vi"))}
              className={`px-1.5 sm:px-2 py-0.5 rounded ${
                language === "vi"
                  ? "bg-emerald-500 text-white"
                  : "hover:text-white"
              }`}
            >
              VI
            </button>
            <button
              onClick={() => dispatch(setLanguage("en"))}
              className={`px-1.5 sm:px-2 py-0.5 rounded ${
                language === "en"
                  ? "bg-emerald-500 text-white"
                  : "hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          {/* Currency - hidden on very small */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => dispatch(setCurrency("VND"))}
              className={`px-2 py-0.5 rounded ${
                currency === "VND"
                  ? "bg-emerald-500 text-white"
                  : "hover:text-white"
              }`}
            >
              VND
            </button>
            <button
              onClick={() => dispatch(setCurrency("USD"))}
              className={`px-2 py-0.5 rounded ${
                currency === "USD"
                  ? "bg-emerald-500 text-white"
                  : "hover:text-white"
              }`}
            >
              USD
            </button>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          {/* User */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 md:gap-3">
              <span className="hidden md:inline">👤 {username}</span>
              <span className="hidden md:inline text-emerald-400">
                Số Dư: <b>{formatVnd(balance)}</b>
              </span>
              <span className="hidden lg:inline text-amber-400">
                Giảm: {discountPercent}%
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="hover:text-white whitespace-nowrap"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                dispatch(login({ username: "demo_user", balance: 250000 }))
              }
              className="text-emerald-400 hover:text-emerald-300 font-semibold whitespace-nowrap"
            >
              <span className="hidden sm:inline">Đăng nhập / Đăng ký</span>
              <span className="sm:hidden">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
