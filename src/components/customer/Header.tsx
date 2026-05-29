import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Bell, User, LogOut, Search, ChefHat } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import { logout } from "../../redux/slices/authSlice";
import { useLogoutMutation } from "../../api/authApi";
import { useGetCartQuery } from "../../api/cartApi";
import { useMyNotificationsQuery } from "../../api/miscApi";
import { useState } from "react";
import { tokenStorage } from "../../api/tokenStorage";

export default function Header() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutFn] = useLogoutMutation();
  const { data: cart } = useGetCartQuery(undefined, { skip: !user });
  const { data: notes } = useMyNotificationsQuery(undefined, { skip: !user });
  const unread = notes?.filter((n) => n.status === "UNREAD").length ?? 0;
  const [openMenu, setOpenMenu] = useState(false);
  const [q, setQ] = useState("");

  const onLogout = async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (refreshToken) {
      try {
        await logoutFn({ refreshToken }).unwrap();
      } catch { /* ignore */ }
    }
    dispatch(logout());
    navigate("/login");
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${isActive ? "text-rose-500" : "text-gray-700 hover:text-rose-500"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white">
            <ChefHat size={18} />
          </div>
          <span className="hidden text-lg font-extrabold text-gray-800 sm:block">
            Shop<span className="text-rose-500">Food</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink to="/" end className={navLink}>Trang chủ</NavLink>
          <NavLink to="/products" className={navLink}>Thực đơn</NavLink>
          <NavLink to="/orders" className={navLink}>Đơn hàng</NavLink>
          <NavLink to="/favourites" className={navLink}>Yêu thích</NavLink>
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden flex-1 max-w-md sm:block">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm món ăn..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Link
            to="/cart"
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart size={20} />
            {cart && cart.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </Link>
          {user && (
            <Link
              to="/notifications"
              className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Thông báo"
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          )}
          {user && (
            <Link to="/favourites" className="rounded-full p-2 text-gray-600 hover:bg-gray-100 sm:hidden">
              <Heart size={20} />
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpenMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-100"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-rose-400 to-amber-400 text-white flex items-center justify-center text-sm font-bold">
                  {user.image ? (
                    <img src={user.image} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    user.fullName?.[0]?.toUpperCase() ?? "U"
                  )}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  {user.fullName}
                </span>
              </button>
              {openMenu && (
                <div
                  className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
                  onMouseLeave={() => setOpenMenu(false)}
                >
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                    <User size={16} /> Tài khoản
                  </Link>
                  <Link to="/addresses" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                    📍 Địa chỉ
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                    📦 Đơn hàng
                  </Link>
                  {(user.role === "ADMIN" || user.role === "MANAGER") && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50"
                    >
                      ⚙️ Trang quản trị
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
