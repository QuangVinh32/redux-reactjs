import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, ListTree, Image as ImageIcon, ShoppingBag,
  Ticket, Users, Bell, ChefHat,
} from "lucide-react";

const items = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
  { to: "/admin/categories", label: "Danh mục", icon: ListTree },
  { to: "/admin/banners", label: "Banner", icon: ImageIcon },
  { to: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
  { to: "/admin/vouchers", label: "Voucher", icon: Ticket },
  { to: "/admin/users", label: "Người dùng", icon: Users },
  { to: "/admin/notifications", label: "Thông báo", icon: Bell },
];

export default function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-100 bg-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white">
          <ChefHat size={18} />
        </div>
        <div>
          <p className="text-sm font-extrabold leading-tight text-gray-800">
            Shop<span className="text-rose-500">Food</span>
          </p>
          <p className="text-[10px] font-semibold uppercase text-gray-400">Admin</p>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-rose-50 text-rose-600" : "text-gray-600 hover:bg-gray-50"}`
            }
          >
            <it.icon size={18} />
            {it.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
