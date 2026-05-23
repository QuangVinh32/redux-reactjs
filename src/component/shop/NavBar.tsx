import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { mainNav, subNav } from "../../constants/ShopData";

export default function NavBar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    const base = path.split("?")[0];
    if (base === "/shop") return location.pathname === "/shop";
    return location.pathname.startsWith(base);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* ==== Mobile bar (< lg) ==== */}
        <div className="lg:hidden flex items-center justify-between py-2.5">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors"
            aria-label="Toggle menu"
          >
            <span className="text-lg leading-none">{mobileOpen ? "✕" : "☰"}</span>
            <span className="text-sm font-semibold">Menu</span>
          </button>
          <Link to="/shop" className="text-sm font-bold whitespace-nowrap">
            🏠 Trang Chủ
          </Link>
          <Link
            to="/shop/recharge"
            className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-900 text-xs font-bold whitespace-nowrap"
          >
            💳 Nạp
          </Link>
        </div>

        {/* ==== Mobile drawer ==== */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-emerald-500/40 py-3 max-h-[70vh] overflow-y-auto">
            <ul className="space-y-1">
              {mainNav.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={closeMobile}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive(item.path)
                        ? "bg-emerald-800/50"
                        : "hover:bg-emerald-800/30"
                    }`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="ml-5 mt-1 mb-2 border-l-2 border-emerald-500/30 pl-3 space-y-1">
                      {item.children.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            to={sub.path}
                            onClick={closeMobile}
                            className="block px-3 py-1.5 text-xs text-emerald-100 hover:bg-emerald-800/30 rounded transition-colors"
                          >
                            • {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-emerald-500/30 mt-3 pt-3">
              <div className="text-[10px] uppercase tracking-wider text-emerald-200 px-3 mb-1">
                Khác
              </div>
              <ul className="space-y-0.5">
                {subNav.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      onClick={closeMobile}
                      className="block px-3 py-2 text-xs hover:bg-emerald-800/30 rounded transition-colors"
                    >
                      {item.icon && <span className="mr-1.5">{item.icon}</span>}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ==== Desktop bar (>= lg) ==== */}
        <div className="hidden lg:flex items-center justify-between">
          <ul className="flex items-center">
            {mainNav.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 xl:px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive(item.path)
                      ? "bg-emerald-800/40"
                      : "hover:bg-emerald-800/30"
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                  {item.children && <span className="text-xs">▾</span>}
                </Link>

                {item.children && openMenu === item.label && (
                  <ul className="absolute top-full left-0 min-w-[220px] bg-white text-slate-800 shadow-xl rounded-b-lg overflow-hidden border-t-2 border-amber-400">
                    {item.children.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          to={sub.path}
                          className="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Sub nav - chỉ hiện ở xl trở lên để khỏi chen */}
          <ul className="hidden xl:flex items-center text-xs">
            {subNav.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className="block px-3 py-3.5 hover:bg-emerald-800/30 transition-colors whitespace-nowrap"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
