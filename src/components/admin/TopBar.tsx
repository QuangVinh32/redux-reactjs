import { Menu, LogOut, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import { toggleSidebar } from "../../redux/slices/uiSlice";
import { logout } from "../../redux/slices/authSlice";
import { useLogoutMutation } from "../../api/authApi";
import { tokenStorage } from "../../api/tokenStorage";

export default function TopBar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutFn] = useLogoutMutation();

  const onLogout = async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (refreshToken) {
      try { await logoutFn({ refreshToken }).unwrap(); } catch { /* ignore */ }
    }
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center gap-3 border-b border-gray-100 bg-white px-4">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="rounded p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
      >
        <Menu size={18} />
      </button>
      <h1 className="text-sm font-semibold text-gray-700">Trang quản trị</h1>
      <div className="ml-auto flex items-center gap-2">
        <Link
          to="/"
          className="hidden items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 sm:flex"
        >
          <ExternalLink size={14} /> Xem trang khách
        </Link>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 text-white flex items-center justify-center text-xs font-bold">
            {user?.fullName?.[0]?.toUpperCase() ?? "A"}
          </div>
          <span className="text-xs font-medium text-gray-700">{user?.fullName}</span>
        </div>
        <button
          onClick={onLogout}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Đăng xuất"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
