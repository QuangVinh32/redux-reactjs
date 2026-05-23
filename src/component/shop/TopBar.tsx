import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Sun, Moon, Settings as SettingsIcon } from "lucide-react";
import {
  setCurrency, setLanguage,
  setTheme, logoutThunk,
  type Theme,
} from "../../redux/slices/ShopSlice";
import type { AppDispatch } from "../../redux/Store";
import { formatVnd } from "../../constants/ShopData";

export default function TopBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, username, balance, discountPercent, currency, language, theme } =
    useSelector((s: any) => s.shop);

  const toggleDarkLight = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(next));
  };

  return (
    <div className="bg-stone-900 text-stone-300 text-[11px] md:text-xs border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-9 flex items-center justify-between gap-2">
        <div className="hidden md:flex items-center gap-4 min-w-0">
          <span className="whitespace-nowrap tracking-wider">
            HOTLINE: <span className="text-white font-semibold">0987.654.321</span>
          </span>
          <span className="text-stone-600">|</span>
          <span className="whitespace-nowrap tracking-wider uppercase">Hỗ trợ 24/7</span>
        </div>

        <div className="md:hidden flex items-center min-w-0">
          {isLoggedIn ? (
            <span className="text-white font-semibold truncate">
              {formatVnd(balance)}
            </span>
          ) : (
            <span className="text-stone-300 truncate">0987.654.321</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* Language */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => dispatch(setLanguage("vi"))}
              className={`px-1.5 sm:px-2 py-0.5 ${language === "vi" ? "bg-white text-stone-900 font-semibold" : "hover:text-white"}`}
            >
              VI
            </button>
            <button
              onClick={() => dispatch(setLanguage("en"))}
              className={`px-1.5 sm:px-2 py-0.5 ${language === "en" ? "bg-white text-stone-900 font-semibold" : "hover:text-white"}`}
            >
              EN
            </button>
          </div>

          <span className="hidden sm:inline text-stone-600">|</span>

          {/* Currency */}
          <div className="hidden sm:flex items-center gap-0.5">
            <button
              onClick={() => dispatch(setCurrency("VND"))}
              className={`px-2 py-0.5 ${currency === "VND" ? "bg-white text-stone-900 font-semibold" : "hover:text-white"}`}
            >
              VND
            </button>
            <button
              onClick={() => dispatch(setCurrency("USD"))}
              className={`px-2 py-0.5 ${currency === "USD" ? "bg-white text-stone-900 font-semibold" : "hover:text-white"}`}
            >
              USD
            </button>
          </div>

          <span className="hidden sm:inline text-stone-600">|</span>

          {/* Theme + Settings */}
          <button onClick={toggleDarkLight} className="hover:text-white p-1" title="Sáng/Tối">
            {theme === "dark" || theme === "halloween" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <Link to="/shop/settings" className="hover:text-white p-1" title="Cài đặt">
            <SettingsIcon size={14} />
          </Link>

          <span className="hidden sm:inline text-stone-600">|</span>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 md:gap-3">
              <span className="hidden md:inline">{username}</span>
              <span className="hidden md:inline text-white">
                Số dư: <b>{formatVnd(balance)}</b>
              </span>
              <span className="hidden lg:inline text-stone-400">
                Giảm: {discountPercent}%
              </span>
              <button
                onClick={() => dispatch(logoutThunk())}
                className="hover:text-white whitespace-nowrap uppercase tracking-wider"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <Link to="/shop/login" className="text-white hover:underline font-semibold uppercase tracking-wider">
                Đăng nhập
              </Link>
              <span className="hidden sm:inline text-stone-600">/</span>
              <Link to="/shop/register" className="hidden sm:inline text-stone-300 hover:text-white uppercase tracking-wider">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
